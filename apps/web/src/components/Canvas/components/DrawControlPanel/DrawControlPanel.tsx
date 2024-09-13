import { FC, useState } from "react";
import ColorPicker from "./components/ColorPicker";
import StrokeWidthButtons from "./components/StrokeWidthButtons";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/20/solid";
import ControlButton from "@/components/ControlButton";
import useMediaQuery from "@/lib/useMediaQuery";
import GithubIcon from "@/components/icons/GithubIcon";
import Panel from "@/components/Panel/Panel";
import OpacitySlider from "./components/OpacitySlider";

export interface DrawControlPanelProps {}

const DrawControlPanel: FC<DrawControlPanelProps> = () => {
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
            <ColorPicker onColorChange={handlePanelClose} />
            <StrokeWidthButtons onStrokeWidthChange={handlePanelClose} />
            <OpacitySlider />
          </div>
        </Panel>
      )}
    </div>
  )
}

export default DrawControlPanel;