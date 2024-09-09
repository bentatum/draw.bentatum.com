import React, { useState, useCallback, useEffect, useRef } from "react";
import { Circle } from "react-konva";
import useAblyChannel from "@/lib/useAblyChannel";
import Konva from "konva";

interface CollaboratorCursorsProps {
  stageRef: React.RefObject<Konva.Stage>;
}

const CollaboratorCursors: React.FC<CollaboratorCursorsProps> = ({ stageRef }) => {
  const [collaboratorMousePositions, setCollaboratorMousePositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const latestMousePositions = useRef<{ [key: string]: { x: number; y: number } }>({});
  const requestRef = useRef<number>();

  // Handle incoming mouse position messages from collaborators
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMouseMessage = useCallback((message: any) => {
    latestMousePositions.current = {
      ...latestMousePositions.current,
      [message.data.clientId]: { x: message.data.x, y: message.data.y },
    };
  }, []);

  // Subscribe to the 'mouse' channel to receive mouse position updates
  const { channel: mouseChannel } = useAblyChannel('mouse', handleMouseMessage);

  // Publish the current user's mouse position to the 'mouse' channel
  const publishMouse = useCallback((point: { x: number; y: number }) => {
    if (mouseChannel) {
      mouseChannel.publish('mouse', { x: point.x, y: point.y });
    }
  }, [mouseChannel]);

  // Get the pointer position relative to the canvas
  const getRelativePointerPosition = (node: Konva.Node) => {
    const transform = node.getAbsoluteTransform().copy();
    transform.invert();
    const pos = node.getStage()?.getPointerPosition();
    if (!pos) return { x: 0, y: 0 }; // Return a default position if pos is null
    const relativePos = transform.point(pos);
    return relativePos;
  };

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
    // Handle mouse move events to publish the current user's mouse position
    const handleMouseMove = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const point = getRelativePointerPosition(stage);
      publishMouse(point);
    };

    const stage = stageRef.current;
    if (stage) {
      stage.on('mousemove', handleMouseMove);
      stage.on('touchmove', handleMouseMove);
    }

    return () => {
      if (stage) {
        stage.off('mousemove', handleMouseMove);
        stage.off('touchmove', handleMouseMove);
      }
    };
  }, [stageRef, publishMouse]);

  useEffect(() => {
    // Update the state with the latest mouse positions using requestAnimationFrame
    const updateMousePositions = () => {
      setCollaboratorMousePositions({ ...latestMousePositions.current });
      requestRef.current = requestAnimationFrame(updateMousePositions);
    };
    requestRef.current = requestAnimationFrame(updateMousePositions);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  return (
    <>
      {Object.entries(collaboratorMousePositions).map(([clientId, pos]) => {
        // Transform the cursor position before rendering to ensure it is correctly positioned
        const transformedPos = transformPosition(pos.x, pos.y);
        return (
          <Circle
            key={clientId}
            x={transformedPos.x}
            y={transformedPos.y}
            radius={5}
            fill="red"
          />
        );
      })}
    </>
  );
};

export default React.memo(CollaboratorCursors);