import ControlButton from "@/components/ControlButton";
import { PlusIcon } from "@heroicons/react/24/solid";
import { MinusIcon } from "@heroicons/react/24/solid";
import Konva from "konva";
import { FC } from "react";

export interface ZoomControlPanelProps {
  setScale: React.Dispatch<React.SetStateAction<number>>;
  scale: number;
  stageRef: React.RefObject<Konva.Stage>;
}

const ZoomControlPanel: FC<ZoomControlPanelProps> = ({ setScale, scale, stageRef }) => {
  const handleZoom = (zoomIn: boolean) => {
    setScale((prevScale: number) => {
      const newScale = zoomIn ? Math.min(prevScale * 1.1, 30) : Math.max(prevScale / 1.1, 0.1);
      const stage = stageRef.current;
      if (!stage) return prevScale;
      const pointer = stage.getPointerPosition();

      if (!pointer) return prevScale;

      const mousePointTo = {
        x: (pointer.x - stage.x()) / prevScale,
        y: (pointer.y - stage.y()) / prevScale,
      };

      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      stage.position(newPos);
      stage.batchDraw();

      return newScale;
    });
  };

  const handleZoomIn = () => handleZoom(true);
  const handleZoomOut = () => handleZoom(false);

  return (
    <div className="z-10 fixed bottom-4 left-4 flex items-center gap-2">
      <ControlButton className="h-12 w-12" onClick={handleZoomOut}><MinusIcon className="w-7 h-7" /></ControlButton>
      <span className="leading-none">{Math.round(scale * 100)}%</span>
      <ControlButton className="h-12 w-12" onClick={handleZoomIn}><PlusIcon className="w-7 h-7" /></ControlButton>
    </div>
  )
};

export default ZoomControlPanel;