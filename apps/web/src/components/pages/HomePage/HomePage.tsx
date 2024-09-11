"use client";

import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import useDimensions from "@/lib/useDimensions";
import clsx from "clsx";
import Konva from "konva";
import DrawControlPanel from "./components/DrawControlPanel/DrawControlPanel";
import ZoomControlPanel from "./components/ZoomControlPanel";
import { LineData } from "@/types";
import ToolSelectPanel from "./components/ToolSelectPanel";
import useLines from "@/lib/useLines";
import fetcher from "@/lib/fetcher";
import ConnectedUsersPanel from "./components/ConnectedUsersPanel";

const HomePage = () => {
  const { lines: fetchedLines } = useLines();
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
  const [newLines, setNewLines] = useState<LineData[]>([]);
  const [isStageReady, setIsStageReady] = useState(false);

  const setStageRef = (node: Konva.Stage | null) => {
    if (node) {
      stageRef.current = node;
      setIsStageReady(true);
    }
  };

  useEffect(() => {
    if (fetchedLines) {
      setLines(fetchedLines);
    }
  }, [fetchedLines]);

  useEffect(() => {
    if (!isStageReady) return;

    const savedScale = localStorage.getItem("canvasScale");
    const savedPosition = localStorage.getItem("canvasPosition");

    if (savedScale && stageRef.current) {
      const scale = parseFloat(savedScale);
      stageRef.current.scale({ x: scale, y: scale });
      setScale(scale);
    }

    if (savedPosition && stageRef.current) {
      const position = JSON.parse(savedPosition);
      stageRef.current.position(position);
    }
  }, [isStageReady]);

  useEffect(() => {
    if (!isStageReady) return;

    // Save scale to localStorage whenever it changes
    console.log('saving scale', scale);
    localStorage.setItem("canvasScale", scale.toString());
  }, [scale, isStageReady]);

  const saveLines = async (lines: LineData[]) => {
    try {
      console.log('saving lines', lines);
      await fetcher(`/lines`, {
        method: 'POST',
        body: JSON.stringify(lines),
      });

      console.log('lines saved');

      // mutate(); // Refresh the lines after saving
    } catch (error) {
      console.error('Error saving lines:', error);
    }
  };

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
      setNewLines((prevNewLines) => [...prevNewLines, newLine]);
    } else if (tool === "hand") {
      dragStartPos.current = getRelativePointerPosition(stage);
    }
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => handleStart(e, tool);
  const handleTouchStart = (e: Konva.KonvaEventObject<TouchEvent>) => handleStart(e, tool);

  const handleMove = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>, tool: string) => {
    const stage = e.target.getStage();
    if (!stage) return;
    if (tool === "pencil" && isDrawing.current) {
      setLines((prevLines) => {
        const lastLine = prevLines[prevLines.length - 1];
        if (!lastLine) return prevLines;
        const point = getRelativePointerPosition(stage);
        lastLine.points = lastLine.points?.concat([point.x, point.y]);
        const newLines = prevLines.slice(0, prevLines.length - 1);
        return [...newLines, lastLine];
      });
    } else if (tool === "hand" && dragStartPos.current) {
      const newPos = getRelativePointerPosition(stage);
      if (lastPosRef.current) {
        const dx = (newPos.x - lastPosRef.current.x);
        const dy = (newPos.y - lastPosRef.current.y);
        requestAnimationFrame(() => {
          stage.x(stage.x() + dx * scale);
          stage.y(stage.y() + dy * scale);
          stage.batchDraw();

          // Commenting out localStorage update during drawing
          localStorage.setItem("canvasPosition", JSON.stringify(stage.position()));
        });
      }
      lastPosRef.current = newPos;
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => handleMove(e, tool);
  const handleTouchMove = (e: Konva.KonvaEventObject<TouchEvent>) => handleMove(e, tool);

  const handleEnd = () => {
    if (isDrawing.current) {
      saveLines(newLines);
      setNewLines([]); // Clear new lines after saving
    }
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

    // Save position to localStorage
    localStorage.setItem("canvasPosition", JSON.stringify(newPos));
  };

  return (
    <div>
      <ToolSelectPanel setTool={setTool} tool={tool} />
      <DrawControlPanel setColor={setColor} color={color} setBrushRadius={setBrushRadius} brushRadius={brushRadius} setBrushOpacity={setBrushOpacity} brushOpacity={brushOpacity} />
      <ZoomControlPanel setScale={setScale} scale={scale} stageRef={stageRef} />
      <ConnectedUsersPanel />
      <div
        className={clsx("h-screen w-screen", {
          "cursor-crosshair": tool === "pencil",
          "cursor-grab active:cursor-grabbing": tool === "hand",
        })}
        ref={stageContainerRef}
      >
        {dimensionsReady && (
          <Stage
            ref={setStageRef}
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
            </Layer>
          </Stage>
        )}
      </div>
    </div>
  );
};

export default HomePage;
