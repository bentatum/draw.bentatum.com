import ControlButton from "@/components/ControlButton";
import { PencilIcon, HandRaisedIcon } from "@heroicons/react/24/outline";
import { FC } from "react";

export interface ToolSelectPanelProps {
  setTool: (tool: string) => void;
  tool: string;
}

const ToolSelectPanel: FC<ToolSelectPanelProps> = ({ setTool, tool }) => {
  return (
    <div className="z-10 fixed bottom-4 right-4 flex items-center gap-2">
      <ControlButton className="h-12 w-12" onClick={() => setTool("pencil")} selected={tool === "pencil"}>
        <PencilIcon className="w-6 h-6" />
      </ControlButton>
      <ControlButton className="h-12 w-12" onClick={() => setTool("hand")} selected={tool === "hand"}>
        <HandRaisedIcon className="w-6 h-6" />
      </ControlButton>
    </div>
  )
}

export default ToolSelectPanel;