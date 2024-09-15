import { useCallback } from "react";
import Konva from "konva";
import { useZoom } from "./useZoomHandlers";

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

export default useWheelHandler;