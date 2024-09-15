import { useCallback, useRef } from 'react';
import Konva from 'konva';
import useCanvasScale from './useCanvasScale';

export const useZoom = (stageRef: React.RefObject<Konva.Stage>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_scale, setScale] = useCanvasScale();
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

const useWheelHandler = (stageRef: React.RefObject<Konva.Stage>) => {
  const handleZoom = useZoom(stageRef);

  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const newScale = e.evt.deltaY > 0 ? oldScale / 1.1 : oldScale * 1.1;
    handleZoom(newScale, pointer);
  }, [handleZoom, stageRef]);

  return handleWheel;
};

const usePinchHandler = (stageRef: React.RefObject<Konva.Stage>) => {
  const isPinching = useRef(false);
  const handleZoom = useZoom(stageRef);

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
  }, [handleZoom, stageRef]);

  return { handlePinch, isPinching };
};

const useZoomHandlers = (stageRef: React.RefObject<Konva.Stage>) => {
  const handleWheel = useWheelHandler(stageRef);
  const { handlePinch, isPinching } = usePinchHandler(stageRef);
  return { handleWheel, handlePinch, isPinching };
};

export default useZoomHandlers;
