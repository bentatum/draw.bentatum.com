import { useCallback } from "react";
import Konva from "konva";

const useRelativePointerPosition = () => {
  return useCallback((node: Konva.Node) => {
    const transform = node.getAbsoluteTransform().copy();
    transform.invert();
    const pos = node.getStage()?.getPointerPosition();
    if (!pos) return { x: 0, y: 0 };
    const relativePos = transform.point(pos);
    return relativePos;
  }, []);
};

export default useRelativePointerPosition;