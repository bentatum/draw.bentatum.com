import { useState, useCallback, useEffect } from 'react';
import { RealtimeChannel } from 'ably';
import getClientColor from './getClientColor';

interface ClientInfo {
  id: string;
  hue: number;
}

interface Options {
  filterConnectionId?: string;
}

export function useAblyClients(channel: RealtimeChannel | null, options: Options = {}) {
  const [clients, setClients] = useState<ClientInfo[]>([]);

  const fetchClients = useCallback(async () => {
    try {
      const members = await channel?.presence.get();
      const newClients = members?.map(member => {
        const { hue } = getClientColor(member.connectionId);
        return { id: member.connectionId, hue };
      }).filter(client => client.id !== options.filterConnectionId) || [];
      setClients(newClients);
    } catch (err) {
      console.error('Error fetching presence members:', err);
      setClients([]);
    }
  }, [channel, options.filterConnectionId]);

  useEffect(() => {
    if (channel) {
      fetchClients();

      const handleEnter = async () => {
        fetchClients();
      };

      const handleLeave = async () => {
        fetchClients();
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
  }, [channel, fetchClients]);

  return clients;
}
