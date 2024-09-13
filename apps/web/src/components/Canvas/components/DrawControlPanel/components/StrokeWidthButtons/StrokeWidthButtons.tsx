import ControlButton from "@/components/ControlButton";
import useBrushRadius from "@/components/Canvas/lib/useBrushRadius";
import useCanvasTool from "@/components/Canvas/lib/useCanvasTool";
import clsx from "clsx";
import { useEffect } from "react";

export interface StrokeWidthButtonsProps {
  onStrokeWidthChange?: () => void;
}

const strokeWidths = [4, 17, 32, 47, 62, 75];

const StrokeWidthButtons: React.FC<StrokeWidthButtonsProps> = ({ onStrokeWidthChange }) => {
  const [brushRadius, setBrushRadius] = useBrushRadius();
  const [tool, setTool] = useCanvasTool();

  useEffect(() => {
    if (tool === "hand") {
      setTool("pencil");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brushRadius]);

  return (
    <div className="flex items-center gap-1.5 mt-1">
      {strokeWidths.map((width, index) => {
        return (
          <ControlButton
            key={width}
            selected={brushRadius === width}
            onClick={() => {
              setBrushRadius(width);
              onStrokeWidthChange?.();
            }}
          >
            <div className={clsx("w-full rounded-full bg-gray-800 dark:bg-gray-200", {
              "h-px": index === 0,
              "h-0.5": index === 1,
              "h-1": index === 2,
              "h-1.5": index === 3,
              "h-2": index === 4,
              "h-2.5": index === 5
            })} />
          </ControlButton>
        );
      })}
    </div>
  );
};

export default StrokeWidthButtons;