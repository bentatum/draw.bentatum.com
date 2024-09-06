"use client";

import React, { useState, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";
import useDimensions from "@/lib/useDimensions";
import clsx from "clsx";
import { PencilIcon, HandRaisedIcon } from "@heroicons/react/24/outline";

const ControlButton: React.FC<any> = ({ onClick, selected, children, className, ...props }) => {
  return (
    <button
      className={clsx(
        'h-7 w-7 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-200 p-1 flex items-center justify-center',
        {
          "bg-gray-300": selected,
        },
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const StrokeWidthButtons: React.FC<any> = ({ setBrushRadius, brushRadius }) => {
  const strokeWidths = [2, 8, 15];
  return (
    <div className="flex items-center gap-1.5 mt-1">
      {strokeWidths.map((width, index) => (
        <ControlButton
          key={width}
          selected={brushRadius === width}
          onClick={() => setBrushRadius(width)}
        >
          <div className={clsx("w-full rounded-full", {
            "h-px bg-black": index === 0,
            "h-1 bg-black": index === 1,
            "h-1.5 bg-black": index === 2,
          })} />
        </ControlButton>
      ))}
    </div>
  );
};

const ColorPicker: React.FC<any> = ({ setColor, color }) => {
  const presetColors = [
    { name: "black", hex: "#000000" },
    { name: "red", hex: "#EF4444" },
    { name: "green", hex: "#10B981" },
    { name: "blue", hex: "#3B82F6" },
    { name: "yellow", hex: "#F59E0B" },
  ];

  return (
    <div className="flex items-center gap-1.5 mt-1">
      {presetColors.map(({ name, hex }) => (
        <ControlButton
          key={name}
          className={clsx({
            'bg-black': name === 'black',
            'bg-red-500': name === 'red',
            'bg-green-500': name === 'green',
            'bg-blue-500': name === 'blue',
            'bg-yellow-500': name === 'yellow',
          })}
          onClick={() => setColor(hex)}
        />
      ))}
      <div
        className={clsx("w-7 h-7 rounded ml-1 border border-gray-50", {
          'bg-black': color === '#000000',
          'bg-red-500': color === '#EF4444',
          'bg-green-500': color === '#10B981',
          'bg-blue-500': color === '#3B82F6',
          'bg-yellow-500': color === '#F59E0B',
        })}
      />
    </div>
  );
};

const HomePage = () => {
  const [color, setColor] = useState("#000000");
  const [brushRadius, setBrushRadius] = useState(4);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [lines, setLines] = useState<any[]>([]);
  const [scale, setScale] = useState(1);
  const [tool, setTool] = useState("pencil"); // New state for tool selection
  const isDrawing = useRef(false);
  const stageRef = useRef<any>(null);
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const { width, height, dimensionsReady } = useDimensions(stageContainerRef);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const stageStartPos = useRef<{ x: number; y: number } | null>(null);

  const getRelativePointerPosition = (stage: any) => {
    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    const pos = stage.getPointerPosition();
    return transform.point(pos);
  };

  const handleMouseDown = (e: any) => {
    if (tool === "pencil") {
      isDrawing.current = true;
      const pos = getRelativePointerPosition(e.target.getStage());
      setLines((prevLines) => [
        ...prevLines,
        { points: [pos.x, pos.y], color, brushRadius, brushOpacity },
      ]);
    } else if (tool === "hand") {
      dragStartPos.current = { x: e.evt.clientX, y: e.evt.clientY };
      stageStartPos.current = { x: stageRef.current.x(), y: stageRef.current.y() };
    }
  };

  const handleMouseMove = (e: any) => {
    if (tool === "pencil" && isDrawing.current) {
      const stage = e.target.getStage();
      const point = getRelativePointerPosition(stage);
      setLines((prevLines) => {
        const lastLine = prevLines[prevLines.length - 1];
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        const newLines = prevLines.slice(0, prevLines.length - 1);
        return [...newLines, lastLine];
      });
    } else if (tool === "hand" && dragStartPos.current) {
      const dx = e.evt.clientX - dragStartPos.current.x;
      const dy = e.evt.clientY - dragStartPos.current.y;
      stageRef.current.position({
        x: stageStartPos.current.x + dx,
        y: stageStartPos.current.y + dy,
      });
      stageRef.current.batchDraw();
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    dragStartPos.current = null;
    stageStartPos.current = null;
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    if (newScale < 0.1 || newScale > 30) return; // Limit zoom scale

    setScale(newScale);
    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  };

  const handleZoomIn = () => {
    setScale((prevScale) => {
      const newScale = Math.min(prevScale * 1.1, 30);
      const stage = stageRef.current;
      const pointer = stage.getPointerPosition();

      const mousePointTo = {
        x: (pointer.x - stage.x()) / prevScale,
        y: (pointer.y - stage.y()) / prevScale,
      };

      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      stage.position(newPos);
      stage.batchDraw();

      return newScale;
    });
  };

  const handleZoomOut = () => {
    setScale((prevScale) => {
      const newScale = Math.max(prevScale / 1.1, 0.1);
      const stage = stageRef.current;
      const pointer = stage.getPointerPosition();

      const mousePointTo = {
        x: (pointer.x - stage.x()) / prevScale,
        y: (pointer.y - stage.y()) / prevScale,
      };

      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      stage.position(newPos);
      stage.batchDraw();

      return newScale;
    });
  };

  return (
    <div className="container">
      <div className="z-10 fixed top-4 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow flex items-center gap-2">
        <ControlButton onClick={() => setTool("pencil")} selected={tool === "pencil"}>
          <PencilIcon className="w-5 h-5" />
        </ControlButton>
        <ControlButton onClick={() => setTool("hand")} selected={tool === "hand"}>
          <HandRaisedIcon className="w-5 h-5" />
        </ControlButton>
      </div>
      <div className="z-10 fixed top-4 left-4 bg-white p-3 rounded-lg shadow flex flex-col gap-3 border border-gray-50">
        <div>
          <label className="text-sm">Stroke</label>
          <ColorPicker setColor={setColor} color={color} />
        </div>
        <div>
          <label className="text-sm">Stroke width</label>
          <StrokeWidthButtons setBrushRadius={setBrushRadius} brushRadius={brushRadius} />
        </div>
        <div>
          <label className="text-sm">
            Opacity
          </label>
          <div className="flex items-center gap-1.5 mt-1">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={brushOpacity}
              className="w-full"
              onChange={(e) => setBrushOpacity(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>
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
            </Layer>
          </Stage>
        )}
      </div>
      <div className="fixed bottom-4 left-4 bg-white p-2 rounded shadow flex items-center">
        <ControlButton onClick={handleZoomOut}>-</ControlButton>
        <span className="mx-2">{Math.round(scale * 100)}%</span>
        <ControlButton onClick={handleZoomIn}>+</ControlButton>
      </div>
    </div>
  );
};

export default HomePage;
