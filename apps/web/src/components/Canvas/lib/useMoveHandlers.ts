import { useCallback, MutableRefObject } from "react";
import Konva from "konva";
import useCanvasTool from "./useCanvasTool";
import useCanvasPosition from "./useCanvasPosition";
import { LineData } from "@/types";
import useRelativePointerPosition from "./useRelativePointerPosition";

interface UseMoveHandlersProps {
  isDrawing: MutableRefObject<boolean>;
  setLines: React.Dispatch<React.SetStateAction<LineData[]>>;
  isPinching: MutableRefObject<boolean>;
  dragStartPos: MutableRefObject<{ x: number; y: number } | null>;
  lastPointerPosition: MutableRefObject<{ x: number; y: number } | null>;
}

const useMoveHandlers = ({
  isDrawing,
  setLines,
  isPinching,
  dragStartPos,
  lastPointerPosition
}: UseMoveHandlersProps) => {
  const [tool] = useCanvasTool();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [position, setPosition] = useCanvasPosition();
  const getRelativePointerPosition = useRelativePointerPosition();

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
  }, [tool, isDrawing, setLines, getRelativePointerPosition, isPinching, dragStartPos, lastPointerPosition, setPosition]);

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => handleMove(e);
  const handleTouchMove = (e: Konva.KonvaEventObject<TouchEvent>) => handleMove(e);

  return { handleMouseMove, handleTouchMove };
};

export default useMoveHandlers;