"use client";

import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import useDimensions from "@/lib/useDimensions";
import clsx from "clsx";
import { PencilIcon, HandRaisedIcon } from "@heroicons/react/24/outline";
import io from "socket.io-client";
import Konva from "konva";
import { API_URL } from "@/config";

const socket = io(API_URL);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lines, setLines] = useState<any[]>([]);
  const [scale, setScale] = useState(1);
  const [tool, setTool] = useState("pencil");
  const isDrawing = useRef(false);
  const stageRef = useRef(null);
  const stageContainerRef = useRef(null);
  const dragStartPos = useRef(null);
  const { width, height, dimensionsReady } = useDimensions(stageContainerRef);

  useEffect(() => {
    socket.on('drawing', (data) => {
      setLines((prevLines) => [...prevLines, data]);
    });

    return () => {
      socket.off('drawing');
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getRelativePointerPosition = (node: any) => {
    const transform = node.getAbsoluteTransform().copy();
    transform.invert();
    const pos = node.getStage().getPointerPosition();
    return transform.point(pos);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMouseDown = (e: any) => {
    if (tool === "pencil") {
      isDrawing.current = true;
      const pos = getRelativePointerPosition(e.target.getStage());
      const newLine = { points: [pos.x, pos.y], color, brushRadius, brushOpacity };
      setLines((prevLines) => [...prevLines, newLine]);
      socket.emit('drawing', newLine);
    } else if (tool === "hand") {
      dragStartPos.current = getRelativePointerPosition(e.target.getStage());
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMouseMove = (e: any) => {
    if (tool === "pencil" && isDrawing.current) {
      const stage = e.target.getStage();
      const point = getRelativePointerPosition(stage);
      setLines((prevLines) => {
        const lastLine = prevLines[prevLines.length - 1];
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        const newLines = prevLines.slice(0, prevLines.length - 1);
        socket.emit('drawing', lastLine);
        return [...newLines, lastLine];
      });
    } else if (tool === "hand" && dragStartPos.current) {
      const stage = e.target.getStage();
      const newPos = getRelativePointerPosition(stage);
      // @ts-expect-error todo
      const dx = newPos.x - dragStartPos.current.x;
      // @ts-expect-error todo
      const dy = newPos.y - dragStartPos.current.y;
      stage.x(stage.x() + dx);
      stage.y(stage.y() + dy);
      dragStartPos.current = newPos;
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    dragStartPos.current = null;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current as unknown as Konva.Stage;
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

  const handleZoomIn = () => {
    setScale((prevScale) => {
      const newScale = Math.min(prevScale * 1.1, 30);
      const stage = stageRef.current as unknown as Konva.Stage;
      const pointer = stage.getPointerPosition();

      if (!pointer) return prevScale;

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
      const stage = stageRef.current as unknown as Konva.Stage;
      const pointer = stage.getPointerPosition();

      if (!pointer) return prevScale;

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
      <div className="z-10 fixed top-4 right-4 bg-white p-2 rounded shadow flex items-center gap-2">
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
