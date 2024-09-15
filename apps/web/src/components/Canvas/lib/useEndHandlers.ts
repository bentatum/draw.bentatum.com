import { useCallback, MutableRefObject } from "react";
import Konva from "konva";
import { LineData } from "@/types";
import useCanvasPosition from "./useCanvasPosition";
import useLinesMutation from "./useLinesMutation";

interface UseEndHandlersProps {
  isDrawing: MutableRefObject<boolean>,
  newLines: LineData[],
  setNewLines: React.Dispatch<React.SetStateAction<LineData[]>>,
  stageRef: MutableRefObject<Konva.Stage | null>,
  isPinching: MutableRefObject<boolean>,
  dragStartPos: MutableRefObject<{ x: number; y: number } | null>,
  lastPointerPosition: MutableRefObject<{ x: number; y: number } | null>
}

const useEndHandlers = ({
  isDrawing,
  newLines,
  setNewLines,
  stageRef,
  isPinching,
  dragStartPos,
  lastPointerPosition
}: UseEndHandlersProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [position, setPosition] = useCanvasPosition();

  const saveLines = useLinesMutation();

  const handleMouseUp = useCallback(() => {
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
  }, [isDrawing, saveLines, newLines, setNewLines, stageRef, setPosition, dragStartPos, lastPointerPosition]);

  const handleTouchEnd = useCallback(() => {
    handleMouseUp();
    isPinching.current = false; // Reset pinching flag
    if (stageRef.current) {
      delete stageRef.current.attrs.lastDist;
      delete stageRef.current.attrs.lastCenter;
      delete stageRef.current.attrs.lastScale;
    }
  }, [handleMouseUp, isPinching, stageRef]);

  return { handleMouseUp, handleTouchEnd };
};

export default useEndHandlers;