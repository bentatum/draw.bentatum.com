import { renderHook } from '@testing-library/react';
import Konva from 'konva';
import useZoomHandlers from '../useZoomHandlers';

describe('useZoomHandlers', () => {
  const stageRef = { current: new Konva.Stage({ container: document.createElement('div') }) };

  const setup = () => {
    return renderHook(() => useZoomHandlers(stageRef));
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return handleWheel and handlePinch functions', () => {
    const { result } = setup();
    expect(typeof result.current.handleWheel).toBe('function');
    expect(typeof result.current.handlePinch).toBe('function');
    expect(result.current.isPinching.current).toBe(false);
  });

  it.todo('should handle wheel zoom correctly');

  it.todo('should handle pinch zoom correctly');

  it.todo('should not handle pinch zoom if less than two touches');
});

