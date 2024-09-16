import { renderHook, act } from '@testing-library/react';
import Konva from 'konva';
import useStartHandlers from '../useStartHandlers';
import { LineData } from '@/types';

describe('useStartHandlers', () => {
  const setLines = jest.fn();
  const setNewLines = jest.fn();

  const setup = () => {
    return renderHook(() => useStartHandlers({ setLines, setNewLines }));
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize refs and handlers correctly', () => {
    const { result } = setup();
    expect(result.current.isDrawing.current).toBe(false);
    expect(result.current.dragStartPos.current).toBe(null);
    expect(result.current.lastPointerPosition.current).toBe(null);
    expect(typeof result.current.handleMouseDown).toBe('function');
    expect(typeof result.current.handleTouchStart).toBe('function');
  });

  it('should handle pencil tool start correctly', () => {
    const { result } = setup();
    const stage = new Konva.Stage({ container: document.createElement('div') });
    const mockEvent = {
      target: { getStage: () => stage },
    } as unknown as Konva.KonvaEventObject<MouseEvent>;

    const pos = { x: 50, y: 50 };
    stage.getPointerPosition = jest.fn().mockReturnValue(pos);

    act(() => {
      result.current.handleMouseDown(mockEvent);
    });

    expect(result.current.isDrawing.current).toBe(true);
    expect(setLines).toHaveBeenCalledWith(expect.any(Function));
    expect(setNewLines).toHaveBeenCalledWith(expect.any(Function));
  });

  it.todo('should handle hand tool start correctly');
});
