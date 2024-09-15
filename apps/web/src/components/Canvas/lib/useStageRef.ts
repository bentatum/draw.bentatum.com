import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import useCanvasPosition from "./useCanvasPosition";

const useStageRef = () => {
  const [position] = useCanvasPosition();
  const [isStageReady, setIsStageReady] = useState(false);
  const stageRef = useRef<Konva.Stage | null>(null);

  useEffect(() => {
    if (isStageReady && position && stageRef.current) {
      stageRef.current.position(position);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStageReady]);


  return {
    ref: stageRef,
    ready: isStageReady,
    setRef: (node: Konva.Stage | null) => {
      stageRef.current = node;
      setIsStageReady(true);
    },
  };
};

export default useStageRef;