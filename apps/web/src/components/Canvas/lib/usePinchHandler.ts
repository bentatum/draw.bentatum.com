import { useCallback, useRef } from "react";
import Konva from "konva";
import { useZoom } from "./useZoom";

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

export default usePinchHandler;