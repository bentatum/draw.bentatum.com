import { useState, useEffect, useCallback } from "react";

const useDimensions = (ref: React.RefObject<HTMLElement>) => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    ready: false,
  });

  const updateDimensions = useCallback(() => {
    if (ref.current) {
      setDimensions({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
        ready: true,
      });
    }
  }, [ref]);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [updateDimensions]);

  return { ...dimensions, dimensionsReady: dimensions.ready };
};

export default useDimensions;