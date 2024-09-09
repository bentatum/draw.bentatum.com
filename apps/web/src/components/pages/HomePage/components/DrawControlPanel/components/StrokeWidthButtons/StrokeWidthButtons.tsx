import ControlButton from "@/components/ControlButton";
import clsx from "clsx";

export interface StrokeWidthButtonsProps {
  setBrushRadius: (radius: number) => void;
  brushRadius: number;
}

const strokeWidths = [2, 8, 15];

const StrokeWidthButtons: React.FC<StrokeWidthButtonsProps> = ({ setBrushRadius, brushRadius }) => {
  return (
    <div className="flex items-center gap-1.5 mt-1">
      {strokeWidths.map((width, index) => (
        <ControlButton
          key={width}
          selected={brushRadius === width}
          onClick={() => setBrushRadius(width)}
        >
          <div className={clsx("w-full rounded-full bg-black", {
            "h-px": index === 0,
            "h-1": index === 1,
            "h-1.5": index === 2,
          })} />
        </ControlButton>
      ))}
    </div>
  );
};

export default StrokeWidthButtons;