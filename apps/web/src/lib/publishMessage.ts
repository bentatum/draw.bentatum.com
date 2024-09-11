
import { CHANNEL_NAME } from '@/config';
import { RealtimeChannel } from 'ably';

export const publishMessage = async (
  channel: RealtimeChannel | null,
  data: unknown
): Promise<void> => {
  if (!channel) {
    console.warn('Channel not available for publishing');
    return;
  }

  try {
    await channel.publish(CHANNEL_NAME, data);
  } catch (error) {
    console.error('Error publishing message:', error);
    // You can add additional error handling here, such as:
    // - Retrying the publish
    // - Updating a global error state
    // - Showing a notification to the user
    // throw error; // Re-throw the error if you want calling code to handle it
  }
};