import useDimensions from "@/lib/useDimensions";
import { useRef } from "react";

const useStageContainerRef = () => {
  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const { width, height, dimensionsReady } = useDimensions(stageContainerRef);
  return {
    ref: stageContainerRef,
    ready: dimensionsReady,
    height,
    width,
  };
};

export default useStageContainerRef;