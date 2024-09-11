import { RealtimeChannel } from "ably";
import { useAblyClients } from "@/lib/useAblyClients";
import getClientColor from "@/lib/getClientColor";
import { useState } from "react";

export interface CollaboratorsViewPanelProps {
  channel: RealtimeChannel | null;
}

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full mb-2 w-max p-1 text-xs text-white bg-black rounded">
          {text}
        </div>
      )}
    </div>
  );
};

const CollaboratorsViewPanel: React.FC<CollaboratorsViewPanelProps> = ({ channel }) => {
  const clients = useAblyClients(channel);

  if (!clients.length) return null;

  return (
    <div className="z-10 h-7 fixed top-4 right-4 flex flex-row items-center gap-2">
      <span className="text-sm text-gray-500">{clients.length === 1 ? '1 person online' : `${clients.length} people online`}</span>
      <div className="flex -space-x-2">
        {clients.map((client) => {
          const { hue } = getClientColor(client.id);
          return (
            <Tooltip key={client.id} text={client.id}>
              <div
                className="w-5 h-5 rounded-full relative overflow-hidden border border-white"
                style={{
                  backgroundColor: `hsl(${hue}, 70%, 60%)`,
                }}
              ></div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default CollaboratorsViewPanel;