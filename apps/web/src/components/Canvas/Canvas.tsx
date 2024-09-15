"use client";

import React, { useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import clsx from "clsx";
import DrawControlPanel from "./components/DrawControlPanel/DrawControlPanel";
import ZoomControlPanel from "./components/ZoomControlPanel";
import { LineData } from "@/types";
import ToolSelectPanel from "./components/ToolSelectPanel";
import useLines from "./lib/useLines";
import DarkModeControlButton from "@/components/DarkModeControlButton";
import { useDefaultLineColor } from "./lib/useDefaultLineColor";
import useScale from "./lib/useScale";
import useCanvasTool from "./lib/useCanvasTool";
import useStageRef from "./lib/useStageRef";
import useStageContainerRef from "./lib/useStageContainerRef";
import useStartHandlers from "./lib/useStartHandlers";
import useEndHandlers from "./lib/useEndHandlers";
import useMoveHandlers from "./lib/useMoveHandlers";
import useZoomHandlers from "./lib/useZoomHandlers";
import useRelativePointerPosition from "./lib/useRelativePointerPosition";

const Canva = () => {
  const [lines, setLines] = useLines();
  const [newLines, setNewLines] = useState<LineData[]>([]);

  const [scale] = useScale();
  const [tool] = useCanvasTool();

  const { ref: stageRef, ready: stageReady, setRef: setStageRef } = useStageRef();
  const { ref: stageContainerRef, ready: stageContainerReady, width, height } = useStageContainerRef();

  const { handleWheel, handlePinch, isPinching } = useZoomHandlers(stageRef);

  const { handleMouseDown, handleTouchStart, isDrawing, dragStartPos, lastPointerPosition } = useStartHandlers({
    setLines,
    setNewLines
  });

  const { handleMouseMove, handleTouchMove } = useMoveHandlers({
    isDrawing,
    setLines,
    isPinching,
    dragStartPos,
    lastPointerPosition
  });

  const { handleMouseUp, handleTouchEnd } = useEndHandlers({
    isDrawing,
    newLines,
    setNewLines,
    stageRef,
    isPinching,
    dragStartPos,
    lastPointerPosition
  });


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
