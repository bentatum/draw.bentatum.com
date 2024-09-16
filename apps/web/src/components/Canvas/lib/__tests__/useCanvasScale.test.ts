import useCanvasScale from '../useCanvasScale';
import useLocalStorage from '@/lib/useLocalStorage';
import { renderHook, act } from '@testing-library/react';

jest.mock('@/lib/useLocalStorage', () => jest.fn());

const mockUseLocalStorage = useLocalStorage as jest.Mock;

describe('useCanvasScale', () => {
  it('should return the default scale value', () => {
    mockUseLocalStorage.mockReturnValue([1, jest.fn()]);

    const { result } = renderHook(() => useCanvasScale());

    expect(result.current[0]).toBe(1);
  });

  it('should return the stored scale value', () => {
    mockUseLocalStorage.mockReturnValue([2, jest.fn()]);

    const { result } = renderHook(() => useCanvasScale());

    expect(result.current[0]).toBe(2);
  });

  it('should update the canvas scale in local storage', () => {
    const setCanvasScale = jest.fn();
    mockUseLocalStorage.mockReturnValue([2, setCanvasScale]);

    const { result } = renderHook(() => useCanvasScale());

    act(() => {
      result.current[1](3);
    });

    expect(setCanvasScale).toHaveBeenCalledWith(3);
  });
});
