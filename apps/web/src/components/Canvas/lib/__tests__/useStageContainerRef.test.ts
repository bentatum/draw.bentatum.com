import { renderHook } from '@testing-library/react';
import useStageContainerRef from '../useStageContainerRef';

describe('useStageContainerRef', () => {
  it('should return the initial ref as null', () => {
    const { result } = renderHook(() => useStageContainerRef());
    expect(result.current.ref.current).toBe(null);
  });

  it('should return dimensionsReady as false initially', () => {
    const { result } = renderHook(() => useStageContainerRef());
    expect(result.current.ready).toBe(false);
  });

  it('should return width and height as 0 initially', () => {
    const { result } = renderHook(() => useStageContainerRef());
    expect(result.current.width).toBe(0);
    expect(result.current.height).toBe(0);
  });

});
