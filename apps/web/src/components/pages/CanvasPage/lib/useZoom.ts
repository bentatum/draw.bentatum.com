import { useCallback } from 'react';
import Konva from 'konva';
import useLocalStorage from '@/lib/useLocalStorage';

export const useZoom = (stageRef: React.RefObject<Konva.Stage>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_scale, setScale] = useLocalStorage("canvasScale", 1);
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
    localStorage.setItem("canvasPosition", JSON.stringify(newPos));
  }, [stageRef, setScale]);

  return handleZoom;
};