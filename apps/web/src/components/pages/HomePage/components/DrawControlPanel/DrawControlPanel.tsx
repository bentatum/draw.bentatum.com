import { FC, useState } from "react";
import ColorPicker from "./components/ColorPicker";
import StrokeWidthButtons from "./components/StrokeWidthButtons";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/20/solid";
import ControlButton from "@/components/ControlButton";
import useMediaQuery from "@/lib/useMediaQuery";
import GithubIcon from "@/components/icons/GithubIcon";
import Panel from "@/components/Panel/Panel";
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

  const handlePanelClose = () => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  return (
    <div className="z-10 fixed top-4 right-4">
      <div className="md:hidden mb-2 flex justify-end">
        <ControlButton onClick={() => setIsCollapsed(!isCollapsed)} className="h-12 w-12">
          {isCollapsed ? <Bars2Icon className="w-7 h-7" /> : <XMarkIcon className="w-7 h-7" />}
        </ControlButton>
      </div>
      {(!isMobile || !isCollapsed) && (
        <Panel className="flex flex-col p-0">
          <div className="px-4 min-h-[3rem] flex items-center justify-between text-sm gap-2 border-b border-gray-200 dark:border-gray-700">
            <p>Made by Ben Tatum</p>
            <a href="https://github.com/bentatum/draw.bentatum.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400"><span className="inline-flex items-center gap-1"><GithubIcon className="w-3 h-3 inline-block" /> Github</span></a>
          </div>
          <div className="p-3 flex flex-col gap-3">
            <ColorPicker setColor={setColor} color={color} onColorChange={handlePanelClose} />
            <StrokeWidthButtons setBrushRadius={setBrushRadius} brushRadius={brushRadius} onStrokeWidthChange={handlePanelClose} />
            <div className="mb-1.5">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={brushOpacity}
                className={clsx(
                  "w-full appearance-none h-2 rounded-full",
                  "bg-gradient-to-r from-transparent",
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
                style={{
                  WebkitAppearance: 'none',
                  outline: 'none',
                }}
              />
            </div>
          </div>

        </Panel>
      )}
    </div>
  )
}

export default DrawControlPanel;