import useSWR from 'swr';
import fetcher from './fetcher';

const useLines = () => {
  const { data, error, mutate } = useSWR(`/lines`, fetcher, {
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