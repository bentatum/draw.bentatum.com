import useBrushColor from "@/components/Canvas/lib/useBrushColor";
import useBrushOpacity from "@/components/Canvas/lib/useBrushOpacity";
import useCanvasTool from "@/components/Canvas/lib/useCanvasTool";
import clsx from "clsx";
import { useEffect } from "react";

const OpacitySlider = () => {
  const [color] = useBrushColor();
  const [brushOpacity, setBrushOpacity] = useBrushOpacity();
  const [tool, setTool] = useCanvasTool();
  
  useEffect(() => {
    if (tool === "hand") {
      setTool("pencil");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brushOpacity]);

  return (
    <div className="mb-1.5">
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={brushOpacity}
        className={clsx(
          "w-full appearance-none h-2 rounded-full",
          "bg-gradient-to-r from-transparent outline-none",
          {
            'to-black dark:to-white': color === '#000000' || color === '#FFFFFF',
            'to-red-500': color === '#EF4444',
            'to-green-500': color === '#10B981',
            'to-blue-500': color === '#3B82F6',
            'to-yellow-500': color === '#F59E0B',
            'to-purple-500': color === '#8B5CF6',
          }
        )}
        onChange={(e) => setBrushOpacity(parseFloat(e.target.value))}
      />
    </div>
  );
}

export default OpacitySlider;