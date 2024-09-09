import { FC, useState } from "react";
import ColorPicker from "./components/ColorPicker";
import StrokeWidthButtons from "./components/StrokeWidthButtons";
import { Bars2Icon } from "@heroicons/react/20/solid";
import ControlButton from "@/components/ControlButton";
import useMediaQuery from "@/lib/useMediaQuery";
import clsx from "clsx";

export interface DrawControlPanelProps {
  setColor: (color: string) => void;
  color: string;
  setBrushRadius: (radius: number) => void;
  brushRadius: number;
  setBrushOpacity: (opacity: number) => void;
  brushOpacity: number;
}

const DrawControlPanel: FC<DrawControlPanelProps> = ({ setColor, color, setBrushRadius, brushRadius, setBrushOpacity, brushOpacity }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="z-10 fixed top-4 left-4">
      <div className="md:hidden mb-2">
        <ControlButton onClick={() => setIsCollapsed(!isCollapsed)}>
          <Bars2Icon className="w-5 h-5" />
        </ControlButton>
      </div>
      {(!isMobile || !isCollapsed) && (
        <div className="bg-white p-3 rounded-lg shadow flex flex-col gap-3 border border-gray-50">
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
      )}
    </div>
  )
}

export default DrawControlPanel;