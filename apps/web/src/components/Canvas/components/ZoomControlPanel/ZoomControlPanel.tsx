import ControlButton from "@/components/ControlButton";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/solid";
import Konva from "konva";
import { FC } from "react";
import { useZoom } from "../../lib/useZoomHandlers";
import useScale from "../../lib/useScale";

export interface ZoomControlPanelProps {
  stageRef: React.RefObject<Konva.Stage>;
}

const ZoomControlPanel: FC<ZoomControlPanelProps> = ({ stageRef }) => {
  const [scale] = useScale();
  const handleZoom = useZoom(stageRef);

  const handleZoomButton = (zoomIn: boolean) => {
    const stage = stageRef.current;
    if (!stage) return;

    const newScale = zoomIn ? scale * 1.1 : scale / 1.1;
    const pointer = stage.getPointerPosition() || { x: stage.width() / 2, y: stage.height() / 2 };

    handleZoom(newScale, pointer);
  };

  const handleZoomIn = () => handleZoomButton(true);
  const handleZoomOut = () => handleZoomButton(false);

  return (
    <div className="z-10 fixed bottom-4 left-4 flex items-center gap-2">
      <ControlButton className="h-12 w-12" onClick={handleZoomOut}><MinusIcon className="w-6 h-6" /></ControlButton>
      <span className="leading-none">{Math.round(scale * 100)}%</span>
      <ControlButton className="h-12 w-12" onClick={handleZoomIn}><PlusIcon className="w-6 h-6" /></ControlButton>
    </div>
  )
};

export default ZoomControlPanel;