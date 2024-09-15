import Konva from "konva";
import { useRef, useState } from "react";

const useStageRef = () => {
  const [isStageReady, setIsStageReady] = useState(false);
  const stageRef = useRef<Konva.Stage | null>(null);
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