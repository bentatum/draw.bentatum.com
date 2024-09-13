import { useCallback } from 'react';
import Konva from 'konva';

export const useZoom = (stageRef: React.RefObject<Konva.Stage>, setScale: React.Dispatch<React.SetStateAction<number>>) => {
  const handleZoom = useCallback((newScale: number, pointer: { x: number; y: number } | null) => {
    const stage = stageRef.current;
    if (!stage || !pointer) return;

    const oldScale = stage.scaleX();
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

    // Save scale and position to localStorage
    localStorage.setItem("canvasScale", newScale.toString());
    localStorage.setItem("canvasPosition", JSON.stringify(newPos));
  }, [stageRef, setScale]);

  return handleZoom;
};