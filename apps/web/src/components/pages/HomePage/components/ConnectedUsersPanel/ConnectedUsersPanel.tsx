import useConnections from '@/lib/useConnections';

const ConnectedUsersPanel: React.FC = () => {
  const { connections} = useConnections();

  return (
    <div className="z-10 h-7 fixed top-4 right-4 flex flex-row items-center gap-2">
      <span className="text-sm text-gray-500">{connections?.length === 1 ? '1 person online' : `${connections?.length || 0} people online`}</span>
      <div className="flex -space-x-2">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {connections?.map((conn: any) => (
          <div key={conn.id} className="w-5 h-5 rounded-full relative overflow-hidden border border-white" style={{ backgroundColor: 'hsl(200, 70%, 60%)' }}>
            {conn.user_id}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectedUsersPanel;