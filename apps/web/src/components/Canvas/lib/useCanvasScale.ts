import useLocalStorage from "@/lib/useLocalStorage";

const useCanvasScale = () => {
  return useLocalStorage<number>("canvasScale", 1);
}

export default useCanvasScale;