import { renderHook, act } from '@testing-library/react';
import useLinesMutation from '../useLinesMutation';
import fetcher from '@/lib/fetcher';

jest.mock('@/lib/fetcher', () => jest.fn());

const mockFetcher = fetcher as jest.Mock;

describe('useLinesMutation', () => {
  it('should call fetcher with the correct arguments', async () => {
    const lines = [{ id: 1, points: [0, 0, 1, 1] }];
    const { result } = renderHook(() => useLinesMutation());

    await act(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await result.current(lines as any);
    });

    expect(mockFetcher).toHaveBeenCalledWith('/lines', {
      method: 'POST',
      body: JSON.stringify(lines),
    });
  });

  it('should handle errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Failed to save lines');
    mockFetcher.mockRejectedValueOnce(error);

    const lines = [{ id: 1, points: [0, 0, 1, 1] }];
    const { result } = renderHook(() => useLinesMutation());

    await act(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await result.current(lines as any);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error saving lines:', error);

    consoleErrorSpy.mockRestore();
  });
});
