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
        // @ts-expect-error todo
        mutate((lines) => [...(lines || []), payload.new], false);
      })

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