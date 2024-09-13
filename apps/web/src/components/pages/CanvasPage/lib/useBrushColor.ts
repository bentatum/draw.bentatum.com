import { WHITE, BLACK } from "@/config";
import useLocalStorage from "@/lib/useLocalStorage";
import { useTheme } from "next-themes";

const useBrushColor = () => {
  const { theme } = useTheme();
  return useLocalStorage("brushColor", theme === "dark" ? WHITE : BLACK);
};

export default useBrushColor;