import { useState, useEffect, useRef } from 'react';
import Ably, { Message, RealtimeChannel } from 'ably';
import useAblyTokenQuery from './useAblyTokenQuery';
import { CHANNEL_NAME } from '@/config';

const useAblyChannel = (onMessage?: (message: Message, connectionId: string) => void) => {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const { data: token } = useAblyTokenQuery();
  const ablyRef = useRef<Ably.Realtime | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  useEffect(() => {
    if (!token) return;

    const ably = new Ably.Realtime({
      token: token,
      authUrl: '/api/auth',
    });
    ablyRef.current = ably;

    ably.connection.on('connected', () => {
      setConnectionId(ably.connection.id!);

      const ablyChannel = ably.channels.get(CHANNEL_NAME);
      setChannel(ablyChannel);

      ablyChannel.subscribe(CHANNEL_NAME, (message: Message) => {
        if (message.connectionId !== ably.connection.id) {
          onMessage?.(message, ably.connection.id!);
        }
      });
    });
    return () => {
      ably.connection.off();
      ably.close();
    };
  }, [token, onMessage]);

  return { channel, connectionId };
};

export default useAblyChannel;

