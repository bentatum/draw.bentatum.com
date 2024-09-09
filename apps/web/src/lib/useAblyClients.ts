import { useState, useCallback, useEffect } from 'react';
import { RealtimeChannel } from 'ably';
import useSWR from 'swr';

export function useAblyClients(channel: RealtimeChannel) {
  const [clients, setClients] = useState<string[]>([]);

  const fetchClients = useCallback(async () => {
    try {
      const members = await channel.presence.get();
      return members.map(member => member.connectionId);
    } catch (err) {
      console.error('Error fetching presence members:', err);
      return [];
    }
  }, [channel]);

  const { data: swrClients } = useSWR('ablyClients', fetchClients, {
    refreshInterval: 5000, // Refresh every 5 seconds
  });

  useEffect(() => {
    if (swrClients) {
      setClients(swrClients);
    }
  }, [swrClients]);

  useEffect(() => {
    if (channel) {
      const handleEnter = (member) => {
        setClients((prevClients) => [...prevClients, member.connectionId]);
      };

      const handleLeave = (member) => {
        setClients((prevClients) => prevClients.filter(id => id !== member.connectionId));
      };

      channel.presence.subscribe('enter', handleEnter);
      channel.presence.subscribe('leave', handleLeave);

      channel.presence.enter();

      return () => {
        channel.presence.leave();
        channel.presence.unsubscribe('enter', handleEnter);
        channel.presence.unsubscribe('leave', handleLeave);
      };
    }
  }, [channel]);

  return clients;
}
