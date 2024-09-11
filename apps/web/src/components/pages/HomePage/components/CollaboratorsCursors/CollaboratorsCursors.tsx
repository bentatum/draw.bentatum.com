import React, { useState, useEffect, useRef } from "react";
import { Circle } from "react-konva";
import Konva from "konva";
import { CHANNEL_NAME } from "@/config";
import getClientColor from "@/lib/getClientColor";

interface CollaboratorCursorsProps {
  stageRef: React.RefObject<Konva.Stage>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  channel: any;
}

const CollaboratorCursors: React.FC<CollaboratorCursorsProps> = ({ stageRef, channel }) => {
  const [collaboratorMousePositions, setCollaboratorMousePositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const latestMousePositions = useRef<{ [key: string]: { x: number; y: number } }>({});
  const requestRef = useRef<number>();

  // Transform the cursor position based on the current scale and position of the canvas
  const transformPosition = (x: number, y: number) => {
    const stage = stageRef.current;
    if (!stage) return { x, y };
    const scale = stage.scaleX();
    const stageX = stage.x();
    const stageY = stage.y();
    return {
      x: (x - stageX) / scale,
      y: (y - stageY) / scale,
    };
  };

  useEffect(() => {
    // Update the state with the latest mouse positions using requestAnimationFrame
    const updateMousePositions = () => {
      setCollaboratorMousePositions({ ...latestMousePositions.current });
      requestRef.current = requestAnimationFrame(updateMousePositions);
    };
    requestRef.current = requestAnimationFrame(updateMousePositions);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMessage = (message: any) => {
      if (message.name === CHANNEL_NAME && message.data.points) {
        const points = message.data.points;
        const lastIndex = points.length - 2;
        latestMousePositions.current = {
          ...latestMousePositions.current,
          [message.connectionId]: { x: points[lastIndex], y: points[lastIndex + 1] },
        };
      }
    };

    channel.subscribe(handleMessage);
    return () => {
      channel.unsubscribe(handleMessage);
    };
  }, [channel]);

  return (
    <>
      {Object.entries(collaboratorMousePositions).map(([clientId, pos]) => {
        const transformedPos = transformPosition(pos.x, pos.y);
        const { hue } = getClientColor(clientId);
        return (
          <Circle
            key={clientId}
            x={transformedPos.x}
            y={transformedPos.y}
            radius={5}
            fill={`hsl(${hue}, 70%, 60%)`}
            opacity={1}
          />
        );
      })}
    </>
  );
};

export default React.memo(CollaboratorCursors);