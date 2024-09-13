import useSWR from 'swr';
import fetcher from '@/lib/fetcher';
import { LineData } from '@/types';

const useLines = () => {
  const { data, error, mutate } = useSWR<LineData[]>(`/lines`, fetcher, {
    dedupingInterval: 60000, // 1 minute
    refreshInterval: 60000, // 1 minute
  });

  return {
    lines: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export default useLines;