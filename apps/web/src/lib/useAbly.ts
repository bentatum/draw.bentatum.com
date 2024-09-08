import { useState, useEffect, useRef } from 'react';
import Ably, { Message, RealtimeChannel } from 'ably';
import useAblyTokenQuery from './useAblyTokenQuery';

const useAbly = (onMessage: (message: Message) => void) => {
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const { data: token } = useAblyTokenQuery();
  const connectionIdRef = useRef<string | null>(null);

  useEffect(() => {
    const initializeAbly = async () => {
      try {
        const ably = new Ably.Realtime({
          token: token,
          authUrl: '/api/auth',
        });
        const drawingChannel = ably.channels.get('drawing');
        setChannel(drawingChannel);

        ably.connection.on('connected', () => {
          const id = ably.connection.id;
          setConnectionId(id || null);
          connectionIdRef.current = id || null;
        });

        drawingChannel.subscribe('drawing', (message: Message) => {
          if (message.connectionId !== connectionIdRef.current) {
            onMessage(message.data);
          }
        });

        return () => {
          drawingChannel.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing Ably:', error);
      }
    };

    if (token) {
      initializeAbly();
    }
  }, [token, onMessage]);

  return { connectionId, channel };
};

export default useAbly;

