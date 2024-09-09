import { FC } from "react";
import ColorPicker from "./components/ColorPicker";
import StrokeWidthButtons from "./components/StrokeWidthButtons";

export interface DrawControlPanelProps {
  setColor: (color: string) => void;
  color: string;
  setBrushRadius: (radius: number) => void;
  brushRadius: number;
  setBrushOpacity: (opacity: number) => void;
  brushOpacity: number;
}

const DrawControlPanel: FC<DrawControlPanelProps> = ({ setColor, color, setBrushRadius, brushRadius, setBrushOpacity, brushOpacity }) => {
  return (
    <div className="z-10 fixed top-4 left-4 bg-white p-3 rounded-lg shadow flex flex-col gap-3 border border-gray-50">
      <div>
        <label className="text-sm">Stroke</label>
        <ColorPicker setColor={setColor} color={color} />
      </div>
      <div>
        <label className="text-sm">Stroke width</label>
        <StrokeWidthButtons setBrushRadius={setBrushRadius} brushRadius={brushRadius} />
      </div>
      <div>
        <label className="text-sm">
          Opacity
        </label>
        <div className="flex items-center gap-1.5 mt-1">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={brushOpacity}
            className="w-full"
            onChange={(e) => setBrushOpacity(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  )
}

export default DrawControlPanel;