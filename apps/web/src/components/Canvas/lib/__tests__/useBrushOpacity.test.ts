import useBrushOpacity from '../useBrushOpacity';
import useLocalStorage from '@/lib/useLocalStorage';
import { renderHook, act } from '@testing-library/react';

jest.mock('@/lib/useLocalStorage', () => jest.fn());

const mockUseLocalStorage = useLocalStorage as jest.Mock;

describe('useBrushOpacity', () => {
  it('should return the default opacity value', () => {
    mockUseLocalStorage.mockReturnValue([1, jest.fn()]);

    const { result } = renderHook(() => useBrushOpacity());

    expect(result.current[0]).toBe(1);
  });

  it('should return the stored opacity value', () => {
    mockUseLocalStorage.mockReturnValue([0.5, jest.fn()]);

    const { result } = renderHook(() => useBrushOpacity());

    expect(result.current[0]).toBe(0.5);
  });

  it('should update the brush opacity in local storage', () => {
    const setBrushOpacity = jest.fn();
    mockUseLocalStorage.mockReturnValue([0.5, setBrushOpacity]);

    const { result } = renderHook(() => useBrushOpacity());

    act(() => {
      result.current[1](0.8);
    });

    expect(setBrushOpacity).toHaveBeenCalledWith(0.8);
  });
});
