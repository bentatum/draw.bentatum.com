import { useEffect } from 'react';
import useSWR from 'swr';
import fetcher from './fetcher';
import { LineData } from '@/types';
import { supabase } from '@/clients/supabase';

const useLines = () => {
  const { data, error, mutate } = useSWR<LineData[]>(`/lines`, fetcher, {
    dedupingInterval: 60000, // 1 minute
    refreshInterval: 60000, // 1 minute
  });

  useEffect(() => {
    const subscription = supabase
      .channel('public:lines')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'lines' }, payload => {
        console.log('Received INSERT event:', payload);
        // @ts-ignore
        mutate((lines) => [...(lines || []), payload.new], false);
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [mutate]);

  return {
    lines: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export default useLines;