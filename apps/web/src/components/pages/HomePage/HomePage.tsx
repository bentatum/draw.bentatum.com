"use client";

import React, { useState, useRef, useCallback } from "react";
import { Stage, Layer, Line } from "react-konva";
import useDimensions from "@/lib/useDimensions";
import clsx from "clsx";
import Konva from "konva";
import useAblyChannel from "@/lib/useAblyChannel";
import DrawControlPanel from "./components/DrawControlPanel/DrawControlPanel";
import ZoomControlPanel from "./components/ZoomControlPanel";
import { LineData } from "@/types";
import ToolSelectPanel from "./components/ToolSelectPanel";
import CollaboratorsViewPanel from "./components/CollaboratorsViewPanel";
import CollaboratorsCursors from "./components/CollaboratorsCursors";

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
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const { width, height, dimensionsReady } = useDimensions(stageContainerRef);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDrawingMessage = useCallback((message: any) => {
    setLines((prevLines) => [...prevLines, message.data]);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleIncomingMessage = useCallback((message: any) => {
    if (message.name === 'drawing') {
      handleDrawingMessage(message);
    }
  }, [handleDrawingMessage]);

  const { channel: drawingChannel } = useAblyChannel('drawing', handleIncomingMessage);

  const getRelativePointerPosition = (node: Konva.Node) => {
    const transform = node.getAbsoluteTransform().copy();
    transform.invert();
    const pos = node.getStage()?.getPointerPosition();
    if (!pos) return { x: 0, y: 0 };
    const relativePos = transform.point(pos);
    return relativePos;
  };

  const handleStart = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>, tool: string) => {
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

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => handleStart(e, tool);
  const handleTouchStart = (e: Konva.KonvaEventObject<TouchEvent>) => handleStart(e, tool);

  const handleMove = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>, tool: string) => {
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
      if (lastPosRef.current) {
        const dx = (newPos.x - lastPosRef.current.x) / scale;
        const dy = (newPos.y - lastPosRef.current.y) / scale;
        requestAnimationFrame(() => {
          stage.x(stage.x() + dx);
          stage.y(stage.y() + dy);
          stage.batchDraw();
        });
      }
      lastPosRef.current = newPos;
    }
    // publishMouse(point);
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => handleMove(e, tool);
  const handleTouchMove = (e: Konva.KonvaEventObject<TouchEvent>) => handleMove(e, tool);

  const handleEnd = () => {
    isDrawing.current = false;
    dragStartPos.current = null;
    lastPosRef.current = null;
  };

  const handleMouseUp = handleEnd;
  const handleTouchEnd = handleEnd;

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
    setScale(newScale);
  };

  return (
    <div>
      <ToolSelectPanel setTool={setTool} tool={tool} />
      <DrawControlPanel setColor={setColor} color={color} setBrushRadius={setBrushRadius} brushRadius={brushRadius} setBrushOpacity={setBrushOpacity} brushOpacity={brushOpacity} />
      <ZoomControlPanel setScale={setScale} scale={scale} stageRef={stageRef} />
      <CollaboratorsViewPanel channel={drawingChannel} />
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
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
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
              <CollaboratorsCursors stageRef={stageRef} />
            </Layer>
          </Stage>
        )}
      </div>
    </div>
  );
};

export default HomePage;
