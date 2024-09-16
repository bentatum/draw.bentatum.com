import useCanvasTool from '../useCanvasTool';
import useLocalStorage from '@/lib/useLocalStorage';
import { renderHook, act } from '@testing-library/react';

jest.mock('@/lib/useLocalStorage', () => jest.fn());

const mockUseLocalStorage = useLocalStorage as jest.Mock;

describe('useCanvasTool', () => {
  it('should return the default tool value', () => {
    mockUseLocalStorage.mockReturnValue(['pencil', jest.fn()]);

    const { result } = renderHook(() => useCanvasTool());

    expect(result.current[0]).toBe('pencil');
  });

  it('should return the stored tool value', () => {
    mockUseLocalStorage.mockReturnValue(['hand', jest.fn()]);

    const { result } = renderHook(() => useCanvasTool());

    expect(result.current[0]).toBe('hand');
  });

  it('should update the canvas tool in local storage', () => {
    const setCanvasTool = jest.fn();
    mockUseLocalStorage.mockReturnValue(['hand', setCanvasTool]);

    const { result } = renderHook(() => useCanvasTool());

    act(() => {
      result.current[1]('pencil');
    });

    expect(setCanvasTool).toHaveBeenCalledWith('pencil');
  });
});
