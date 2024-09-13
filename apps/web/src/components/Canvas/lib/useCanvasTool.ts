import useLocalStorage from "@/lib/useLocalStorage"

const useCanvasTool = () => {
  return useLocalStorage<"pencil" | "hand">("canvasTool", "pencil");
}

export default useCanvasTool;