
import useBrushColor from '../useBrushColor';
import { useTheme } from 'next-themes';
import useLocalStorage from '@/lib/useLocalStorage';
import { renderHook, act } from '@testing-library/react';

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@/lib/useLocalStorage', () => jest.fn());

const mockUseTheme = useTheme as jest.Mock;
const mockUseLocalStorage = useLocalStorage as jest.Mock;

describe('useBrushColor', () => {
  it('should return white color when theme is dark', () => {
    mockUseTheme.mockReturnValue({ theme: 'dark' });
    mockUseLocalStorage.mockReturnValue(['#FFFFFF', jest.fn()]);

    const { result } = renderHook(() => useBrushColor());

    expect(result.current[0]).toBe('#FFFFFF');
  });

  it('should return black color when theme is light', () => {
    mockUseTheme.mockReturnValue({ theme: 'light' });
    mockUseLocalStorage.mockReturnValue(['#000000', jest.fn()]);

    const { result } = renderHook(() => useBrushColor());

    expect(result.current[0]).toBe('#000000');
  });

  it('should update the brush color in local storage', () => {
    (useTheme as jest.Mock).mockReturnValue({ theme: 'light' });
    const setBrushColor = jest.fn();
    mockUseLocalStorage.mockReturnValue(['#000000', setBrushColor]);

    const { result } = renderHook(() => useBrushColor());

    act(() => {
      result.current[1]('#FF0000');
    });

    expect(setBrushColor).toHaveBeenCalledWith('#FF0000');
  });
});
