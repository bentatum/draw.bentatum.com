import ControlButton from "@/components/ControlButton";
import Konva from "konva";
import { FC } from "react";

export interface ZoomControlPanelProps {
  setScale: (scale: number) => void;
  scale: number;
  stageRef: React.RefObject<Konva.Stage>;
}

const ZoomControlPanel: FC<ZoomControlPanelProps> = ({ setScale, scale, stageRef }) => {
  const handleZoomIn = () => {
    // @ts-expect-error todo
    setScale((prevScale: number) => {
      const newScale = Math.min(prevScale * 1.1, 30);
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

  const handleZoomOut = () => {
    // @ts-expect-error todo
    setScale((prevScale) => {
      const newScale = Math.max(prevScale / 1.1, 0.1);
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
  return (
    <div className="z-10 fixed bottom-4 left-4 bg-white p-2 rounded shadow flex items-center">
      <ControlButton onClick={handleZoomOut}>-</ControlButton>
      <span className="mx-2">{Math.round(scale * 100)}%</span>
      <ControlButton onClick={handleZoomIn}>+</ControlButton>
    </div>
  )
};

export default ZoomControlPanel;