
import { renderHook, act } from '@testing-library/react';
import useLines from '../useLines';
import useLinesQuery from '../useLinesQuery';

jest.mock('../useLinesQuery', () => jest.fn());

const mockUseLinesQuery = useLinesQuery as jest.Mock;

describe('useLines', () => {
  it('should return an empty array initially', () => {
    mockUseLinesQuery.mockReturnValue({ lines: [] });

    const { result } = renderHook(() => useLines());

    expect(result.current[0]).toEqual([]);
  });

  it('should return fetched lines', () => {
    const fetchedLines = [{ id: 1, points: [0, 0, 1, 1] }];
    mockUseLinesQuery.mockReturnValue({ lines: fetchedLines });

    const { result } = renderHook(() => useLines());

    expect(result.current[0]).toEqual(fetchedLines);
  });

  it('should update lines state when fetched lines change', () => {
    const initialLines = [{ id: 1, points: [0, 0, 1, 1] }];
    const updatedLines = [{ id: 2, points: [1, 1, 2, 2] }];
    mockUseLinesQuery
      .mockReturnValueOnce({ lines: initialLines })
      .mockReturnValueOnce({ lines: updatedLines });

    const { result, rerender } = renderHook(() => useLines());

    expect(result.current[0]).toEqual(initialLines);

    // Simulate fetched lines change
    mockUseLinesQuery.mockReturnValue({ lines: updatedLines });
    rerender();

    expect(result.current[0]).toEqual(updatedLines);
  });

  it('should provide a function to update lines state', () => {
    mockUseLinesQuery.mockReturnValue({ lines: [] });

    const { result } = renderHook(() => useLines());

    const newLines = [{ id: 1, points: [0, 0, 1, 1] }];
    act(() => {
      result.current[1](newLines as any);
    });

    expect(result.current[0]).toEqual(newLines);
  });
});
