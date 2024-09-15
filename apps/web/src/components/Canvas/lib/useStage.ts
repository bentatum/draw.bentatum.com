import { useState, useRef, useEffect } from "react";
import Konva from "konva";
import useDimensions from "@/lib/useDimensions";
import useCanvasPosition from "./useCanvasPosition";

const useStage = () => {
  const [position] = useCanvasPosition();
  const stageRef = useRef<Konva.Stage | null>(null);
  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const [isStageReady, setIsStageReady] = useState(false);
  const { width, height, dimensionsReady } = useDimensions(stageContainerRef);

  const setStageRef = (node: Konva.Stage | null) => {
    if (node) {
      stageRef.current = node;
      setIsStageReady(true);
    }
  };

  useEffect(() => {
    if (isStageReady && position && stageRef.current) {
      stageRef.current.position(position);
    }
  }, [isStageReady, position]);

  return { stageRef, stageContainerRef, isStageReady, setStageRef, width, height, dimensionsReady };
};

export default useStage;