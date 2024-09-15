"use client";

import React, { useState, useCallback } from "react";
import { Stage, Layer, Line } from "react-konva";
import clsx from "clsx";
import Konva from "konva";
import DrawControlPanel from "./components/DrawControlPanel/DrawControlPanel";
import ZoomControlPanel from "./components/ZoomControlPanel";
import { LineData } from "@/types";
import ToolSelectPanel from "./components/ToolSelectPanel";
import useLines from "./lib/useLines";
import DarkModeControlButton from "@/components/DarkModeControlButton";
import { useDefaultLineColor } from "./lib/useDefaultLineColor";
import useScale from "./lib/useScale";
import useCanvasTool from "./lib/useCanvasTool";
import useCanvasPosition from "./lib/useCanvasPosition";
import useStageRef from "./lib/useStageRef";
import useStageContainerRef from "./lib/useStageContainerRef";
import useLinesMutation from "./lib/useLinesMutation";
import usePinchHandler from "./lib/usePinchHandler";
import useWheelHandler from "./lib/useWheelHandler";
import useStartHandlers  from "./lib/useStartHandlers";
import useEndHandlers from "./lib/useEndHandlers";

const Canva = () => {
  const [lines, setLines] = useLines();
  const [newLines, setNewLines] = useState<LineData[]>([]);

  const [scale] = useScale();
  const [tool] = useCanvasTool();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [position, setPosition] = useCanvasPosition();

  const { ref: stageRef, ready: stageReady, setRef: setStageRef } = useStageRef();
  const { ref: stageContainerRef, ready: stageContainerReady, width, height } = useStageContainerRef();

  const { handlePinch, isPinching } = usePinchHandler(stageRef);

  const saveLines = useLinesMutation();

  const getRelativePointerPosition = useCallback((node: Konva.Node) => {
    const transform = node.getAbsoluteTransform().copy();
    transform.invert();
    const pos = node.getStage()?.getPointerPosition();
    if (!pos) return { x: 0, y: 0 };
    const relativePos = transform.point(pos);
    return relativePos;
  }, []);

  const { handleMouseDown, handleTouchStart, isDrawing, dragStartPos, lastPointerPosition } = useStartHandlers(getRelativePointerPosition, setLines, setNewLines);

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

  const { handleMouseUp, handleTouchEnd } = useEndHandlers(isDrawing, saveLines, newLines, setNewLines, stageRef, setPosition, isPinching, dragStartPos, lastPointerPosition);

  const handleWheel = useWheelHandler(stageRef);

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
