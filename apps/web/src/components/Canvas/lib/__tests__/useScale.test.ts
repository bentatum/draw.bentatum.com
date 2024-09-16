import { renderHook, act } from '@testing-library/react';
import useScale from '../useScale';

describe('useScale', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return the default scale value', () => {
    const { result } = renderHook(() => useScale());
    expect(result.current[0]).toBe(1);
  });

  it('should update the scale value in localStorage', () => {
    const { result } = renderHook(() => useScale());
    const [, setScale] = result.current;

    act(() => {
      setScale(2);
    });

    expect(result.current[0]).toBe(2);
    expect(localStorage.getItem('canvasScale')).toBe('2');
  });

  it('should retrieve the scale value from localStorage', () => {
    localStorage.setItem('canvasScale', '3');
    const { result } = renderHook(() => useScale());
    expect(result.current[0]).toBe(3);
  });
});
