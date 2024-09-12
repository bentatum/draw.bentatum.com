import ControlButton from "@/components/ControlButton";
import Panel from "@/components/Panel";
import { PencilIcon, HandRaisedIcon } from "@heroicons/react/24/outline";
import { FC } from "react";

export interface ToolSelectPanelProps {
  setTool: (tool: string) => void;
  tool: string;
}

const ToolSelectPanel: FC<ToolSelectPanelProps> = ({ setTool, tool }) => {
  return (
    <Panel className="z-10 fixed bottom-4 right-4 flex items-center gap-2">
      <ControlButton onClick={() => setTool("pencil")} selected={tool === "pencil"}>
        <PencilIcon className="w-5 h-5" />
      </ControlButton>
      <ControlButton onClick={() => setTool("hand")} selected={tool === "hand"}>
        <HandRaisedIcon className="w-5 h-5" />
      </ControlButton>
    </Panel>
  )
}

export default ToolSelectPanel;