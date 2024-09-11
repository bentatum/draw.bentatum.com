import { FC, useState } from "react";
import ColorPicker from "./components/ColorPicker";
import StrokeWidthButtons from "./components/StrokeWidthButtons";
import { Bars2Icon } from "@heroicons/react/20/solid";
import ControlButton from "@/components/ControlButton";
import useMediaQuery from "@/lib/useMediaQuery";
import GithubIcon from "@/components/icons/GithubIcon";
import Panel from "@/components/Panel/Panel";

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
        <Panel className="flex flex-col gap-3">
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
          <div className="mt-1.5 border-t border-gray-300 pt-3.5">
            <p className="text-xs text-gray-400">Made by Ben Tatum. <a href="https://github.com/bentatum/draw.bentatum.com" className="text-blue-500"><span className="inline-flex items-center gap-1">Github <GithubIcon className="w-3 h-3 inline-block" /></span></a></p>
          </div>
        </Panel>
      )}
    </div>
  )
}

export default DrawControlPanel;