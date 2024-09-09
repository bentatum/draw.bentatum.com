import { useState, useEffect } from 'react';
import Ably, { Message, RealtimeChannel } from 'ably';
import useAblyTokenQuery from './useAblyTokenQuery';

const useAblyChannel = (channelName: string, onMessage: (message: Message) => void) => {
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
        const ablyChannel = ably.channels.get(channelName);
        setChannel(ablyChannel);

        ably.connection.on('connected', () => {
          // Use clientId if provided by the server, otherwise fall back to connectionId
          const id = ably.auth.clientId || ably.connection.id;
          if (id) {
            setClientId(id);
          }
        });

        ablyChannel.subscribe(channelName, (message: Message) => {
          if (message.connectionId !== ably.connection.id) {
            onMessage(message);
          }
        });

        return () => {
          ablyChannel.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing Ably:', error);
      }
    };

    if (token) {
      initializeAbly();
    }
  }, [token, channelName, onMessage]);

  return { clientId, channel };
};

export default useAblyChannel;

