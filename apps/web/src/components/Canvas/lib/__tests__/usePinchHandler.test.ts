
import Konva from 'konva';
import usePinchHandler from '../usePinchHandler';
import { renderHook, act } from '@testing-library/react';

describe('usePinchHandler', () => {
  let stageRef: React.RefObject<Konva.Stage>;

  beforeEach(() => {
    stageRef = { current: new Konva.Stage({ container: document.createElement('div') }) };
  });

  it('should handle pinch zoom correctly', () => {
    const { result } = renderHook(() => usePinchHandler(stageRef));

    const touchEvent = {
      evt: {
        preventDefault: jest.fn(),
        touches: [
          { clientX: 0, clientY: 0 },
          { clientX: 100, clientY: 100 }
        ]
      }
    };

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result.current.handlePinch(touchEvent as any);
    });

    expect(result.current.isPinching.current).toBe(true);
    expect(stageRef.current?.attrs.lastDist).toBeCloseTo(141.42, 2);
    expect(stageRef.current?.attrs.lastCenter).toEqual({ x: 50, y: 50 });
    expect(stageRef.current?.attrs.lastScale).toBe(stageRef.current?.scaleX());
  });

  it('should not handle pinch if less than two touches', () => {
    const { result } = renderHook(() => usePinchHandler(stageRef));

    const touchEvent = {
      evt: {
        preventDefault: jest.fn(),
        touches: [
          { clientX: 0, clientY: 0 }
        ]
      }
    };

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result.current.handlePinch(touchEvent as any);
    });

    expect(result.current.isPinching.current).toBe(false);
  });
});
