import useSWR from 'swr';
import { useEffect } from 'react';
import fetcher from './fetcher';
import { supabase } from '@/clients/supabase';
import useClientId from './useClientId';

const useConnections = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const clientId = useClientId()
  const { data: initialConnections, error, mutate } = useSWR(`/connections?status=online`, fetcher);

  useEffect(() => {
    const subscription = supabase
      .channel('public:connections')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'connections' }, payload => {
        // @ts-expect-error todo
        mutate((connections) => [...(connections || []), payload.new], false);
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [mutate]);

  return {
    connections: initialConnections,
    isLoading: !error && !initialConnections,
    isError: error,
    mutate,
  };
};

export default useConnections;