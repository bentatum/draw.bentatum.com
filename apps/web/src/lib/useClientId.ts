import { useEffect } from 'react';
import { nanoid } from 'nanoid';
import fetcher from './fetcher';
import { API_URL } from '@/config';
import useLocalStorage from './useLocalStorage';

const CLIENT_ID_KEY = 'client_id';

const useClientId = () => {
  const [clientId, setClientId] = useLocalStorage<string | null>(CLIENT_ID_KEY, null);

  useEffect(() => {
    const initializeClientId = async () => {
      let storedClientId = localStorage.getItem(CLIENT_ID_KEY);
      if (storedClientId) {
        try {
          const response = await fetch(`${API_URL}/connections/${storedClientId}`);
          if (response.ok) {
            return;
          } else {
            localStorage.removeItem(CLIENT_ID_KEY);
          }
        } catch (error) {
          console.error('Error validating connection:', error);
          localStorage.removeItem(CLIENT_ID_KEY);
        }
      }

      storedClientId = nanoid(10);

      try {
        await fetcher('/connections', {
          method: 'POST',
          body: JSON.stringify({ user_id: storedClientId }),
        });
        setClientId(storedClientId);
      } catch (error) {
        console.error('Error creating connection:', error);
      }
    };

    const updateConnectionStatus = async (status: string) => {
      if (clientId) {
        try {
          await fetcher(`/connections/${clientId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
          });
        } catch (error) {
          console.error('Error updating connection status:', error);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateConnectionStatus('idle');
      } else {
        updateConnectionStatus('active');
      }
    };

    const handleBeforeUnload = () => {
      updateConnectionStatus('offline');
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    initializeClientId();

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [clientId]);

  return clientId;
};

export default useClientId;