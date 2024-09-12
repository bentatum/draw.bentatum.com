import { FC, useState } from "react";
import ColorPicker from "./components/ColorPicker";
import StrokeWidthButtons from "./components/StrokeWidthButtons";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/20/solid";
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
        <ControlButton onClick={() => setIsCollapsed(!isCollapsed)} className="h-12 w-12">
          {isCollapsed ? <Bars2Icon className="w-7 h-7" /> : <XMarkIcon className="w-7 h-7" />}
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
          <div className="mt-1.5 pt-3.5 flex items-center justify-between text-sm gap-2">
            <p>Made by Ben Tatum</p>
            <a href="https://github.com/bentatum/draw.bentatum.com" target="_blank" rel="noopener noreferrer" className="text-blue-500"><span className="inline-flex items-center gap-1"><GithubIcon className="w-3 h-3 inline-block" /> Github</span></a>
          </div>
        </Panel>
      )}
    </div>
  )
}

export default DrawControlPanel;