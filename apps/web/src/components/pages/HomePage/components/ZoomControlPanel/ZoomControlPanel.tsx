import ControlButton from "@/components/ControlButton";
import Panel from "@/components/Panel";
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
    <Panel className="z-10 fixed bottom-4 left-4 bg-white p-2 rounded flex items-center gap-2 text-gray-600">
      <ControlButton onClick={handleZoomOut}>-</ControlButton>
      <span className="leading-none">{Math.round(scale * 100)}%</span>
      <ControlButton onClick={handleZoomIn}>+</ControlButton>
    </Panel>
  )
};

export default ZoomControlPanel;