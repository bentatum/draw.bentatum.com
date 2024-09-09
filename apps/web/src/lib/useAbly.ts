import { useState, useEffect } from 'react';
import Ably, { Message, RealtimeChannel } from 'ably';
import useAblyTokenQuery from './useAblyTokenQuery';

const useAbly = (onMessage: (message: Message) => void) => {
  const [clientId, setClientId] = useState<string | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const { data: token } = useAblyTokenQuery();

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
          // Use clientId if provided by the server, otherwise fall back to connectionId
          const id = ably.auth.clientId || ably.connection.id;
          setClientId(id);
        });

        drawingChannel.subscribe('drawing', (message: Message) => {
          if (message.connectionId !== ably.connection.id) {
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

  return { clientId, channel };
};

export default useAbly;

