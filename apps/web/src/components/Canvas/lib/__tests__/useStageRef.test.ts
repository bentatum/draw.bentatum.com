import { renderHook, act } from '@testing-library/react';
import useStageRef from '../useStageRef';
import Konva from 'konva';

describe('useStageRef', () => {
  it('should return the initial ref as null', () => {
    const { result } = renderHook(() => useStageRef());
    expect(result.current.ref.current).toBe(null);
  });

  it('should return isStageReady as false initially', () => {
    const { result } = renderHook(() => useStageRef());
    expect(result.current.ready).toBe(false);
  });

  it('should set the stage ref and update isStageReady to true', () => {
    const { result } = renderHook(() => useStageRef());
    const stage = new Konva.Stage({ container: document.createElement('div') });

    act(() => {
      result.current.setRef(stage);
    });

    expect(result.current.ref.current).toBe(stage);
    expect(result.current.ready).toBe(true);
  });

  it('should update the stage position when isStageReady and position are set', () => {
    const { result } = renderHook(() => useStageRef());
    const stage = new Konva.Stage({ container: document.createElement('div') });

    act(() => {
      result.current.setRef(stage);
    });

    act(() => {
      result.current.ref.current?.position({ x: 100, y: 100 });
    });

    expect(result.current.ref.current?.position()).toEqual({ x: 100, y: 100 });
  });
});
