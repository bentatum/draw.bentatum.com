import useConnections from '@/lib/useConnections';
import getClientColor from '@/lib/getClientColor';
import Panel from '@/components/Panel';

const ConnectedUsersPanel: React.FC = () => {
  const { connections } = useConnections();

  return (
    <Panel className="h-12 z-10 fixed top-4 right-[4.5rem] flex flex-row items-center gap-2">
      <span className="text-sm">{connections?.length === 1 ? '1 person online' : `${connections?.length || 0} people online`}</span>
      <div className="flex -space-x-1.5">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {connections?.map((conn: any) => {
          const { hue } = getClientColor(conn.user_id);
          return (
            <div key={conn.id} className="w-5 h-5 rounded-full relative" style={{ backgroundColor: `hsl(${hue}, 70%, 60%)` }}>
              {/* {conn.user_id} */}
              {/* <span className={`z-20 absolute bottom-0 right-0 w-2 h-2 rounded-full ${conn.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></span> */}
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

export default ConnectedUsersPanel;