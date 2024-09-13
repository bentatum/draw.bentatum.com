import useLocalStorage from "@/lib/useLocalStorage";

const useBrushOpacity = () => {
  return useLocalStorage("brushOpacity", 1);
}

export default useBrushOpacity;
