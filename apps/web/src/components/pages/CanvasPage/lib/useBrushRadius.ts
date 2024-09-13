import useLocalStorage from "@/lib/useLocalStorage";

const useBrushRadius = () => {
  return useLocalStorage("brushRadius", 4); ``
}

export default useBrushRadius;