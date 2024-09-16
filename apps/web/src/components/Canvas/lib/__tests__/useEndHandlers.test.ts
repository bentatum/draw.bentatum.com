import { renderHook, act } from '@testing-library/react';
import useEndHandlers from '../useEndHandlers';
import useCanvasPosition from '../useCanvasPosition';
import useLinesMutation from '../useLinesMutation';
import { MutableRefObject } from 'react';
import Konva from 'konva';
import { LineData } from '@/types';

jest.mock('../useCanvasPosition', () => jest.fn());
jest.mock('../useLinesMutation', () => jest.fn());

const mockUseCanvasPosition = useCanvasPosition as jest.Mock;
const mockUseLinesMutation = useLinesMutation as jest.Mock;

describe('useEndHandlers', () => {
  let isDrawing: MutableRefObject<boolean>;
  let newLines: LineData[];
  let setNewLines: jest.Mock;
  let stageRef: MutableRefObject<Konva.Stage | null>;
  let isPinching: MutableRefObject<boolean>;
  let dragStartPos: MutableRefObject<{ x: number; y: number } | null>;
  let lastPointerPosition: MutableRefObject<{ x: number; y: number } | null>;
  let setPosition: jest.Mock;
  let saveLines: jest.Mock;

  beforeEach(() => {
    isDrawing = { current: false };
    newLines = [];
    setNewLines = jest.fn();
    stageRef = { current: null };
    isPinching = { current: false };
    dragStartPos = { current: null };
    lastPointerPosition = { current: null };
    setPosition = jest.fn();
    saveLines = jest.fn();

    mockUseCanvasPosition.mockReturnValue([{}, setPosition]);
    mockUseLinesMutation.mockReturnValue(saveLines);
  });

  it('should handle mouse up event', () => {
    isDrawing.current = true;
    newLines = [{ id: 1, points: [0, 0, 1, 1] }];
    stageRef.current = { position: jest.fn().mockReturnValue({ x: 100, y: 100 }) } as unknown as Konva.Stage;

    const { result } = renderHook(() =>
      useEndHandlers({
        isDrawing,
        newLines,
        setNewLines,
        stageRef,
        isPinching,
        dragStartPos,
        lastPointerPosition,
      })
    );

    act(() => {
      result.current.handleMouseUp();
    });

    expect(saveLines).toHaveBeenCalledWith(newLines);
    expect(setNewLines).toHaveBeenCalledWith([]);
    expect(isDrawing.current).toBe(false);
    expect(dragStartPos.current).toBe(null);
    expect(lastPointerPosition.current).toBe(null);
    expect(setPosition).toHaveBeenCalledWith({ x: 100, y: 100 });
  });

  it('should handle touch end event', () => {
    isPinching.current = true;
    stageRef.current = {
      attrs: { lastDist: 10, lastCenter: { x: 50, y: 50 }, lastScale: 2 },
      position: jest.fn().mockReturnValue({ x: 100, y: 100 })
    } as unknown as Konva.Stage;

    const { result } = renderHook(() =>
      useEndHandlers({
        isDrawing,
        newLines,
        setNewLines,
        stageRef,
        isPinching,
        dragStartPos,
        lastPointerPosition,
      })
    );

    act(() => {
      result.current.handleTouchEnd();
    });

    expect(isPinching.current).toBe(false);
    expect(stageRef.current?.attrs.lastDist).toBeUndefined();
    expect(stageRef.current?.attrs.lastCenter).toBeUndefined();
    expect(stageRef.current?.attrs.lastScale).toBeUndefined();
  });
});
