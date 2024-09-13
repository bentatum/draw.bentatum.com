import useLocalStorage from "@/lib/useLocalStorage";

const useCanvasPosition = () => {
  // @ts-expect-error todo
  return useLocalStorage<{ x: number; y: number }>("canvasPosition", JSON.stringify({ x: 0, y: 0 }));
}

export default useCanvasPosition;
