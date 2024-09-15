import { useCallback, useRef } from "react";
import Konva from "konva";
import { LineData } from "@/types";
import useCanvasTool from "./useCanvasTool";
import useBrushColor from "./useBrushColor";
import useBrushRadius from "./useBrushRadius";
import useBrushOpacity from "./useBrushOpacity";
import useRelativePointerPosition from "./useRelativePointerPosition";

interface UseStartHandlersProps {
  setLines: React.Dispatch<React.SetStateAction<LineData[]>>,
  setNewLines: React.Dispatch<React.SetStateAction<LineData[]>>
}

const useStartHandlers = ({
  setLines,
  setNewLines
}: UseStartHandlersProps) => {
  const [tool] = useCanvasTool();
  const [color] = useBrushColor();
  const [brushRadius] = useBrushRadius();
  const [brushOpacity] = useBrushOpacity();
  const isDrawing = useRef(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const lastPointerPosition = useRef<{ x: number; y: number } | null>(null);
  const getRelativePointerPosition = useRelativePointerPosition();

  const handleStart = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>, tool: string) => {
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
    },
    [color, brushRadius, brushOpacity, getRelativePointerPosition, setLines, setNewLines]
  );

  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => handleStart(e, tool),
    [handleStart, tool]
  );

  const handleTouchStart = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => handleStart(e, tool),
    [handleStart, tool]
  );

  return { handleMouseDown, handleTouchStart, isDrawing, dragStartPos, lastPointerPosition };
};

export default useStartHandlers;