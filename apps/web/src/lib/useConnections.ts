import useSWR from 'swr';
import fetcher from './fetcher';
import useClientId from './useClientId';

const useConnections = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const clientId = useClientId()
  const { data: initialConnections, error, mutate } = useSWR(`/connections?status=online`, fetcher);

  return {
    connections: initialConnections,
    isLoading: !error && !initialConnections,
    isError: error,
    mutate,
  };
};

export default useConnections;