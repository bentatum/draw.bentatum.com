import { renderHook, act } from '@testing-library/react';
import useMoveHandlers from '../useMoveHandlers';
import useCanvasTool from '../useCanvasTool';
import useCanvasPosition from '../useCanvasPosition';
import useRelativePointerPosition from '../useRelativePointerPosition';
import { MutableRefObject } from 'react';
import Konva from 'konva';

jest.mock('../useCanvasTool', () => jest.fn());
jest.mock('../useCanvasPosition', () => jest.fn());
jest.mock('../useRelativePointerPosition', () => jest.fn());

const mockUseCanvasTool = useCanvasTool as jest.Mock;
const mockUseCanvasPosition = useCanvasPosition as jest.Mock;
const mockUseRelativePointerPosition = useRelativePointerPosition as jest.Mock;

describe('useMoveHandlers', () => {
  let isDrawing: MutableRefObject<boolean>;
  let setLines: jest.Mock;
  let isPinching: MutableRefObject<boolean>;
  let dragStartPos: MutableRefObject<{ x: number; y: number } | null>;
  let lastPointerPosition: MutableRefObject<{ x: number; y: number } | null>;
  let setPosition: jest.Mock;
  let getRelativePointerPosition: jest.Mock;

  beforeEach(() => {
    isDrawing = { current: false };
    setLines = jest.fn();
    isPinching = { current: false };
    dragStartPos = { current: null };
    lastPointerPosition = { current: null };
    setPosition = jest.fn();
    getRelativePointerPosition = jest.fn();

    mockUseCanvasTool.mockReturnValue(['pencil']);
    mockUseCanvasPosition.mockReturnValue([{}, setPosition]);
    mockUseRelativePointerPosition.mockReturnValue(getRelativePointerPosition);
  });

  it('should handle mouse move event for drawing', () => {
    isDrawing.current = true;
    const stage = {
      getPointerPosition: jest.fn().mockReturnValue({ x: 100, y: 100 }),
      getStage: jest.fn().mockReturnValue({}),
    } as unknown as Konva.Stage;

    const { result } = renderHook(() =>
      useMoveHandlers({
        isDrawing,
        setLines,
        isPinching,
        dragStartPos,
        lastPointerPosition,
      })
    );

    act(() => {
      result.current.handleMouseMove({ target: stage } as Konva.KonvaEventObject<MouseEvent>);
    });

    expect(setLines).toHaveBeenCalled();
  });

  it('should handle touch move event for drawing', () => {
    isDrawing.current = true;
    const stage = {
      getPointerPosition: jest.fn().mockReturnValue({ x: 100, y: 100 }),
      getStage: jest.fn().mockReturnValue({}),
    } as unknown as Konva.Stage;

    const { result } = renderHook(() =>
      useMoveHandlers({
        isDrawing,
        setLines,
        isPinching,
        dragStartPos,
        lastPointerPosition,
      })
    );

    act(() => {
      result.current.handleTouchMove({ target: stage } as Konva.KonvaEventObject<TouchEvent>);
    });

    expect(setLines).toHaveBeenCalled();
  });

  it.todo('should handle move event for hand tool');

  it('should not handle move event if pinching', () => {
    isPinching.current = true;
    const stage = {
      getPointerPosition: jest.fn().mockReturnValue({ x: 100, y: 100 }),
      getStage: jest.fn().mockReturnValue({}),
    } as unknown as Konva.Stage;

    const { result } = renderHook(() =>
      useMoveHandlers({
        isDrawing,
        setLines,
        isPinching,
        dragStartPos,
        lastPointerPosition,
      })
    );

    act(() => {
      result.current.handleMouseMove({ target: stage } as Konva.KonvaEventObject<MouseEvent>);
    });

    expect(setLines).not.toHaveBeenCalled();
    expect(setPosition).not.toHaveBeenCalled();
  });
});
