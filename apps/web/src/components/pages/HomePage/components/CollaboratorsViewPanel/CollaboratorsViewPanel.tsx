import { RealtimeChannel } from "ably";
import { useAblyClients } from "@/lib/useAblyClients";
import { useMemo } from "react";

export interface CollaboratorsViewPanelProps {
  channel: RealtimeChannel | null;
}

const CollaboratorsViewPanel: React.FC<CollaboratorsViewPanelProps> = ({ channel }) => {
  const clients = useAblyClients(channel);

  const generateAvatar = useMemo(() => (client: string) => {
    const hash = client.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const hue = hash % 360;
    const pattern = hash % 4;
    return { hue, pattern };
  }, []);

  return (
    <div className="h-7 fixed top-4 right-4 flex flex-row -space-x-2">
      {clients.map((client) => {
        const { hue, pattern } = generateAvatar(client);
        return (
          <div
            key={client}
            className="w-7 h-7 rounded-full relative overflow-hidden border border-white"
            title={client}
          >
            <div
              className="w-full h-full"
              style={{
                backgroundColor: `hsl(${hue}, 70%, 60%)`,
                backgroundImage: `radial-gradient(circle at ${pattern % 2 ? '25%' : '75%'} ${
                  pattern < 2 ? '25%' : '75%'
                }, transparent 0, transparent 50%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.3) 100%)`,
                backgroundSize: '8px 8px',
              }}
            ></div>
          </div>
        );
      })}
    </div>
  );
};

export default CollaboratorsViewPanel;