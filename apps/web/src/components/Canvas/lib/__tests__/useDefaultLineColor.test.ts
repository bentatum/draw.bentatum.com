import { renderHook } from '@testing-library/react';
import { useTheme } from 'next-themes';
import { useDefaultLineColor } from '../useDefaultLineColor';

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

const mockUseTheme = useTheme as jest.Mock;

describe('useDefaultLineColor', () => {
  it('should return white when the theme is dark and the line color is black', () => {
    mockUseTheme.mockReturnValue({ resolvedTheme: 'dark' });

    const { result } = renderHook(() => useDefaultLineColor());

    expect(result.current('#000000')).toBe('#FFFFFF');
  });

  it('should return black when the theme is light and the line color is white', () => {
    mockUseTheme.mockReturnValue({ resolvedTheme: 'light' });

    const { result } = renderHook(() => useDefaultLineColor());

    expect(result.current('#FFFFFF')).toBe('#000000');
  });

  it('should return the original color when it is neither black nor white', () => {
    mockUseTheme.mockReturnValue({ resolvedTheme: 'dark' });

    const { result } = renderHook(() => useDefaultLineColor());

    expect(result.current('#FF5733')).toBe('#FF5733');
  });

  it('should return the original color when the theme is light and the color is neither black nor white', () => {
    mockUseTheme.mockReturnValue({ resolvedTheme: 'light' });

    const { result } = renderHook(() => useDefaultLineColor());

    expect(result.current('#FF5733')).toBe('#FF5733');
  });
});
