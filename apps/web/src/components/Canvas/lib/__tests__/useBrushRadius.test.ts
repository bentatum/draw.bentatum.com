import useBrushRadius from '../useBrushRadius';
import useLocalStorage from '@/lib/useLocalStorage';
import { renderHook, act } from '@testing-library/react';

jest.mock('@/lib/useLocalStorage', () => jest.fn());

const mockUseLocalStorage = useLocalStorage as jest.Mock;

describe('useBrushRadius', () => {
  it('should return the default radius value', () => {
    mockUseLocalStorage.mockReturnValue([4, jest.fn()]);

    const { result } = renderHook(() => useBrushRadius());

    expect(result.current[0]).toBe(4);
  });

  it('should return the stored radius value', () => {
    mockUseLocalStorage.mockReturnValue([10, jest.fn()]);

    const { result } = renderHook(() => useBrushRadius());

    expect(result.current[0]).toBe(10);
  });

  it('should update the brush radius in local storage', () => {
    const setBrushRadius = jest.fn();
    mockUseLocalStorage.mockReturnValue([10, setBrushRadius]);

    const { result } = renderHook(() => useBrushRadius());

    act(() => {
      result.current[1](15);
    });

    expect(setBrushRadius).toHaveBeenCalledWith(15);
  });
});
