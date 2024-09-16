import useCanvasPosition from '../useCanvasPosition';
import useLocalStorage from '@/lib/useLocalStorage';
import { renderHook, act } from '@testing-library/react';

jest.mock('@/lib/useLocalStorage', () => jest.fn());

const mockUseLocalStorage = useLocalStorage as jest.Mock;

describe('useCanvasPosition', () => {
  it('should return the default canvas position', () => {
    mockUseLocalStorage.mockReturnValue([{ x: 0, y: 0 }, jest.fn()]);

    const { result } = renderHook(() => useCanvasPosition());

    expect(result.current[0]).toEqual({ x: 0, y: 0 });
  });

  it('should return the stored canvas position', () => {
    mockUseLocalStorage.mockReturnValue([{ x: 10, y: 20 }, jest.fn()]);

    const { result } = renderHook(() => useCanvasPosition());

    expect(result.current[0]).toEqual({ x: 10, y: 20 });
  });

  it('should update the canvas position in local storage', () => {
    const setCanvasPosition = jest.fn();
    mockUseLocalStorage.mockReturnValue([{ x: 10, y: 20 }, setCanvasPosition]);

    const { result } = renderHook(() => useCanvasPosition());

    act(() => {
      result.current[1]({ x: 30, y: 40 });
    });

    expect(setCanvasPosition).toHaveBeenCalledWith({ x: 30, y: 40 });
  });
});
