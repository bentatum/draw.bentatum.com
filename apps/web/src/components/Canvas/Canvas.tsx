"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Stage, Layer, Line } from "react-konva";
import clsx from "clsx";
import Konva from "konva";
import DrawControlPanel from "./components/DrawControlPanel/DrawControlPanel";
import ZoomControlPanel from "./components/ZoomControlPanel";
import { LineData } from "@/types";
import ToolSelectPanel from "./components/ToolSelectPanel";
import useLines from "./lib/useLines";
import fetcher from "@/lib/fetcher";
import DarkModeControlButton from "@/components/DarkModeControlButton";
import { useZoom } from "./lib/useZoom";
import { useDefaultLineColor } from "./lib/useDefaultLineColor";
import useScale from "./lib/useScale";
import useCanvasTool from "./lib/useCanvasTool";
import useCanvasPosition from "./lib/useCanvasPosition";
import useCanvasStartHandler from "./lib/useCanvasStartHandler";
import useStageRef from "./lib/useStageRef";
import useStageContainerRef from "./lib/useStageContainerRef";

const Canva = () => {
  const [lines, setLines] = useLines();

  const [scale] = useScale();
  const [tool] = useCanvasTool();
  const [position, setPosition] = useCanvasPosition();

  const { ref: stageRef, ready: stageReady, setRef: setStageRef } = useStageRef();
  const { ref: stageContainerRef, ready: stageContainerReady, width, height } = useStageContainerRef();

  const [newLines, setNewLines] = useState<LineData[]>([]);

  const handleZoom = useZoom(stageRef);

  useEffect(() => {
    if (stageReady && position && stageRef.current) {
      stageRef.current.position(position);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageReady]);

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

  const isPinching = useRef(false);

  const { handleMouseDown, handleTouchStart, isDrawing, dragStartPos, lastPointerPosition } = useCanvasStartHandler(getRelativePointerPosition, setLines, setNewLines);

  const handleMove = useCallback((e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = e.target.getStage();
    if (!stage || isPinching.current) return; // Disable drawing if pinching
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
      setPosition(stage.position());
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
      setPosition(stageRef.current.position());
    }
  }, [saveLines, newLines, setPosition]);

  const handleMouseUp = handleEnd;
  const handleTouchEnd = useCallback(() => {
    handleEnd();
    isPinching.current = false; // Reset pinching flag
    if (stageRef.current) {
      delete stageRef.current.attrs.lastDist;
      delete stageRef.current.attrs.lastCenter;
      delete stageRef.current.attrs.lastScale;
    }
  }, [handleEnd]);

  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const newScale = e.evt.deltaY > 0 ? oldScale / 1.1 : oldScale * 1.1;
    handleZoom(newScale, pointer);
  }, [handleZoom]);

  const handlePinch = useCallback((e: Konva.KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    if (e.evt.touches.length === 2) {
      const touch1 = e.evt.touches[0];
      const touch2 = e.evt.touches[1];

      if (!touch1 || !touch2) return;

      const dist = Math.sqrt(
        Math.pow(touch1.clientX - touch2.clientX, 2) +
        Math.pow(touch1.clientY - touch2.clientY, 2)
      );

      const pointTo = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };

      if (!isPinching.current) {
        isPinching.current = true; // Set pinching flag
        stage.attrs.lastDist = dist;
        stage.attrs.lastCenter = pointTo;
        stage.attrs.lastScale = stage.scaleX(); // Save the initial scale
        return;
      }

      const oldScale = stage.attrs.lastScale || stage.scaleX();
      const newScale = oldScale * (dist / stage.attrs.lastDist);

      handleZoom(newScale, pointTo);
    }
  }, [handleZoom]);

  const getDefaultLineColor = useDefaultLineColor();

  return (
    <div>
      <DarkModeControlButton className="fixed top-4 left-4 z-10" />

      {stageReady && (
        <>
          <ToolSelectPanel />
          <DrawControlPanel />
          <ZoomControlPanel stageRef={stageRef} />
        </>
      )}
      <div
        className={clsx("h-screen w-screen", {
          "cursor-crosshair": tool === "pencil",
          "cursor-grab active:cursor-grabbing": tool === "hand",
        })}
        ref={stageContainerRef}
      >
        {stageContainerReady && (
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
                  stroke={getDefaultLineColor(line.color)}
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

export default Canva;
