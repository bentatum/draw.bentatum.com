"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  const lastPointerPosition = useRef<{ x: number; y: number } | null>(null);
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
    localStorage.setItem("canvasScale", scale.toString());
  }, [scale, isStageReady]);

  const saveLines = useCallback(async (lines: LineData[]) => {
    try {
      await fetcher(`/lines`, {
        method: 'POST',
        body: JSON.stringify(lines),
      });
      // mutate(); // Refresh the lines after saving
    } catch (error) {
      console.error('Error saving lines:', error);
    }
  }, []);

  const getRelativePointerPosition = useCallback((node: Konva.Node) => {
    const transform = node.getAbsoluteTransform().copy();
    transform.invert();
    const pos = node.getStage()?.getPointerPosition();
    if (!pos) return { x: 0, y: 0 };
    const relativePos = transform.point(pos);
    return relativePos;
  }, []);

  const handleStart = useCallback((e: Konva.KonvaEventObject<MouseEvent | TouchEvent>, tool: string) => {
    const stage = e.target.getStage();
    if (!stage) return;
    if (tool === "pencil") {
      isDrawing.current = true;
      const pos = getRelativePointerPosition(stage);
      const newLine: LineData = { points: [pos.x, pos.y], color, brushRadius, brushOpacity };
      setLines((prevLines) => [...prevLines, newLine]);
      setNewLines((prevNewLines) => [...prevNewLines, newLine]);
    } else if (tool === "hand") {
      dragStartPos.current = stage.getPointerPosition() || null;
      lastPointerPosition.current = dragStartPos.current;
    }
  }, [color, brushRadius, brushOpacity, getRelativePointerPosition]);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => handleStart(e, tool);
  const handleTouchStart = (e: Konva.KonvaEventObject<TouchEvent>) => handleStart(e, tool);

  const handleMove = useCallback((e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
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
    } else if (tool === "hand" && dragStartPos.current && lastPointerPosition.current) {
      const newPos = stage.getPointerPosition();
      if (!newPos) return;

      const dx = newPos.x - lastPointerPosition.current.x;
      const dy = newPos.y - lastPointerPosition.current.y;

      stage.x(stage.x() + dx);
      stage.y(stage.y() + dy);
      stage.batchDraw();

      lastPointerPosition.current = newPos;

      // Update localStorage with the new position
      localStorage.setItem("canvasPosition", JSON.stringify(stage.position()));
    }
  }, [tool, getRelativePointerPosition]);

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => handleMove(e);
  const handleTouchMove = (e: Konva.KonvaEventObject<TouchEvent>) => handleMove(e);

  const handleEnd = useCallback(() => {
    if (isDrawing.current) {
      saveLines(newLines);
      setNewLines([]); // Clear new lines after saving
    }
    isDrawing.current = false;
    dragStartPos.current = null;
    lastPointerPosition.current = null;

    // Save final position to localStorage
    if (stageRef.current) {
      localStorage.setItem("canvasPosition", JSON.stringify(stageRef.current.position()));
    }
  }, [saveLines, newLines]);

  const handleMouseUp = handleEnd;
  const handleTouchEnd = handleEnd;

  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
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
    const newScale = e.evt.deltaY > 0 ? oldScale / 1.1 : oldScale * 1.1;
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
  }, []);

  const handlePinch = useCallback((e: Konva.KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    if (e.evt.touches.length === 2) {
      const touch1 = e.evt.touches[0];
      const touch2 = e.evt.touches[1];

      if (!touch1 || !touch2 || !stageRef.current) return;

      const dist = Math.sqrt(
        Math.pow(touch1.clientX - touch2.clientX, 2) +
        Math.pow(touch1.clientY - touch2.clientY, 2)
      );

      if (!stageRef.current?.attrs.lastDist) {
        stageRef.current.attrs.lastDist = dist;
      }

      const oldScale = stage.scaleX();
      const newScale = oldScale * (dist / stageRef.current.attrs.lastDist);

      stageRef.current.attrs.lastDist = dist;

      const pointer = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

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
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDrawingPropertyChange = useCallback((property: 'color' | 'brushRadius' | 'brushOpacity', value: any) => {
    if (property === 'color') setColor(value);
    if (property === 'brushRadius') setBrushRadius(value);
    if (property === 'brushOpacity') setBrushOpacity(value);
    
    // Switch to pencil tool if currently in hand tool
    if (tool === 'hand') {
      setTool('pencil');
    }
  }, [tool]);

  return (
    <div>
      <ToolSelectPanel setTool={setTool} tool={tool} />
      <DrawControlPanel 
        setColor={(color) => handleDrawingPropertyChange('color', color)}
        color={color}
        setBrushRadius={(radius) => handleDrawingPropertyChange('brushRadius', radius)}
        brushRadius={brushRadius}
        setBrushOpacity={(opacity) => handleDrawingPropertyChange('brushOpacity', opacity)}
        brushOpacity={brushOpacity}
      />
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
            onTouchMove={(e) => {
              handleTouchMove(e);
              handlePinch(e);
            }}
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
