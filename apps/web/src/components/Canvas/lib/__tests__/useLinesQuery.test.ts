import { renderHook } from '@testing-library/react';
import useLinesQuery from '../useLinesQuery';
import fetcher from '@/lib/fetcher';
import useSWR from 'swr';

jest.mock('swr');
jest.mock('@/lib/fetcher');

const mockUseSWR = useSWR as jest.Mock;
const mockFetcher = fetcher as jest.Mock;

describe('useLinesQuery', () => {
  it('should return lines data when fetch is successful', () => {
    const lines = [{ id: 1, points: [0, 0, 1, 1] }];
    mockUseSWR.mockReturnValue({ data: lines, error: null });

    const { result } = renderHook(() => useLinesQuery());

    expect(result.current.lines).toEqual(lines);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(null);
  });

  it('should return isLoading as true when data is not yet available', () => {
    mockUseSWR.mockReturnValue({ data: null, error: null });

    const { result } = renderHook(() => useLinesQuery());

    expect(result.current.lines).toBeNull(); // Changed from toBeUndefined to toBeNull
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(null);
  });

  it('should return isError when there is an error fetching data', () => {
    const error = new Error('Failed to fetch');
    mockUseSWR.mockReturnValue({ data: null, error });

    const { result } = renderHook(() => useLinesQuery());

    expect(result.current.lines).toBeNull(); // Changed from toBeUndefined to toBeNull
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(error);
  });

  it('should call fetcher with the correct arguments', () => {
    renderHook(() => useLinesQuery());

    expect(mockUseSWR).toHaveBeenCalledWith('/lines', mockFetcher, {
      dedupingInterval: 60000,
      refreshInterval: 60000,
    });
  });
});
