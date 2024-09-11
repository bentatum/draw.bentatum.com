import useConnections from '@/lib/useConnections';
import getClientColor from '@/lib/getClientColor';
import Panel from '@/components/Panel';

const ConnectedUsersPanel: React.FC = () => {
  const { connections } = useConnections();

  return (
    <Panel className="h-12 z-10 fixed top-4 right-4 flex flex-row items-center gap-2">
      <span className="text-sm text-gray-500">{connections?.length === 1 ? '1 person online' : `${connections?.length || 0} people online`}</span>
      <div className="flex -space-x-2">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {connections?.map((conn: any) => {
          const { hue } = getClientColor(conn.user_id);
          return (
            <div key={conn.id} className="w-7 h-7 rounded-full relative border-2 border-white" style={{ backgroundColor: `hsl(${hue}, 70%, 60%)` }}>
              {/* {conn.user_id} */}
              <span className={`z-20 absolute bottom-0 right-0 w-2 h-2 rounded-full ${conn.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

export default ConnectedUsersPanel;