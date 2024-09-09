"use client";

import React, { useState, useRef, useCallback } from "react";
import { Stage, Layer, Line, Circle } from "react-konva";
import useDimensions from "@/lib/useDimensions";
import clsx from "clsx";
import Konva from "konva";
import useAblyChannel from "@/lib/useAblyChannel";
import DrawControlPanel from "./components/DrawControlPanel/DrawControlPanel";
import ZoomControlPanel from "./components/ZoomControlPanel";
import { LineData } from "@/types";
import ToolSelectPanel from "./components/ToolSelectPanel";
import CollaboratorsViewPanel from "./components/CollaboratorsViewPanel";

const HomePage = () => {
  const [color, setColor] = useState("#000000");
  const [brushRadius, setBrushRadius] = useState(4);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [lines, setLines] = useState<LineData[]>([]);
  const [scale, setScale] = useState(1);
  const [tool, setTool] = useState("pencil");
  const isDrawing = useRef(false);
  const stageRef = useRef<Konva.Stage | null>(null);
  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const { width, height, dimensionsReady } = useDimensions(stageContainerRef);
  const [collaboratorMousePositions, setCollaboratorMousePositions] = useState<{ [key: string]: { x: number; y: number } }>({});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDrawingMessage = useCallback((message: any) => {
    setLines((prevLines) => [...prevLines, message.data]);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMouseMessage = useCallback((message: any) => {
    setCollaboratorMousePositions((prevPositions) => ({
      ...prevPositions,
      [message.data.clientId]: { x: message.data.x, y: message.data.y },
    }));
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleIncomingMessage = useCallback((message: any) => {
    if (message.name === 'drawing') {
      handleDrawingMessage(message);
    } else if (message.name === 'mouse') {
      handleMouseMessage(message);
    }
  }, [handleDrawingMessage, handleMouseMessage]);

  const { channel: drawingChannel } = useAblyChannel('drawing', handleIncomingMessage);
  const { channel: mouseChannel } = useAblyChannel('mouse', handleIncomingMessage);

  const throttledPublishMouse = useCallback((point: { x: number; y: number }) => {
    if (mouseChannel) {
      console.log('publishing mouse', point);
      mouseChannel.publish('mouse', { x: point.x, y: point.y });
    }
  }, [mouseChannel]); // Adjust the throttle delay as needed

  const getRelativePointerPosition = (node: Konva.Node) => {
    const transform = node.getAbsoluteTransform().copy();
    transform.invert();
    const pos = node.getStage()?.getPointerPosition();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return transform.point(pos as any);
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    if (tool === "pencil") {
      isDrawing.current = true;
      const pos = getRelativePointerPosition(stage);
      const newLine: LineData = { points: [pos.x, pos.y], color, brushRadius, brushOpacity };
      setLines((prevLines) => [...prevLines, newLine]);
      if (drawingChannel) {
        drawingChannel.publish('drawing', newLine);
      }
    } else if (tool === "hand") {
      dragStartPos.current = getRelativePointerPosition(stage);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const point = getRelativePointerPosition(stage);
    if (tool === "pencil" && isDrawing.current) {
      setLines((prevLines) => {
        const lastLine = prevLines[prevLines.length - 1];
        if (!lastLine) return prevLines;
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        const newLines = prevLines.slice(0, prevLines.length - 1);
        if (drawingChannel) {
          drawingChannel.publish('drawing', lastLine);
        }
        return [...newLines, lastLine];
      });
    } else if (tool === "hand" && dragStartPos.current) {
      const newPos = getRelativePointerPosition(stage);
      const dx = newPos.x - dragStartPos.current.x;
      const dy = newPos.y - dragStartPos.current.y;
      stage.x(stage.x() + dx);
      stage.y(stage.y() + dy);
      dragStartPos.current = newPos;
    }
    throttledPublishMouse(point);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    dragStartPos.current = null;
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    const newScale = e.evt.deltaY > 0 ? oldScale * 1.1 : oldScale / 1.1;
    stage.scale({ x: newScale, y: newScale });
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  };

  return (
    <div>
      <ToolSelectPanel setTool={setTool} tool={tool} />
      <DrawControlPanel setColor={setColor} color={color} setBrushRadius={setBrushRadius} brushRadius={brushRadius} setBrushOpacity={setBrushOpacity} brushOpacity={brushOpacity} />
      <ZoomControlPanel setScale={setScale} scale={scale} stageRef={stageRef} />
      {drawingChannel && <CollaboratorsViewPanel channel={drawingChannel} />}
      <div
        className={clsx("h-screen w-screen", {
          "cursor-crosshair": tool === "pencil",
          "cursor-grab active:cursor-grabbing": tool === "hand",
        })}
        ref={stageContainerRef}
      >
        {dimensionsReady && (
          <Stage
            ref={stageRef}
            width={width}
            height={height}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            onWheel={handleWheel}
            scaleX={scale}
            scaleY={scale}
          >
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.color}
                  strokeWidth={line.brushRadius}
                  opacity={line.brushOpacity}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation="source-over"
                />
              ))}
              {Object.entries(collaboratorMousePositions).map(([clientId, pos]) => (
                <Circle
                  key={clientId}
                  x={pos.x}
                  y={pos.y}
                  radius={5}
                  fill="red"
                />
              ))}
            </Layer>
          </Stage>
        )}
      </div>
    </div>
  );
};

export default HomePage;
