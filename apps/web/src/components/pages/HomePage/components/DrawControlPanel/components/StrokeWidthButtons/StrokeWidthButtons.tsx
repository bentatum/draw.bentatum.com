import ControlButton from "@/components/ControlButton";
import clsx from "clsx";

export interface StrokeWidthButtonsProps {
  setBrushRadius: (radius: number) => void;
  brushRadius: number;
  scale: number; // Add scale prop
}

const baseStrokeWidths = [10, 40, 50];

const StrokeWidthButtons: React.FC<StrokeWidthButtonsProps> = ({ setBrushRadius, brushRadius, scale }) => {
  return (
    <div className="flex items-center gap-1.5 mt-1">
      {baseStrokeWidths.map((width, index) => (
        <ControlButton
          key={width}
          selected={!brushRadius || brushRadius === Math.round(width * scale)}
          onClick={() => setBrushRadius(Math.round(width * scale))}
        >
          <div className={clsx("w-full rounded-full bg-black dark:bg-white", {
            "h-1": index === 0,
            "h-3": index === 1,
            "h-5": index === 2,
          })} />
        </ControlButton>
      ))}
    </div>
  );
};

export default StrokeWidthButtons;