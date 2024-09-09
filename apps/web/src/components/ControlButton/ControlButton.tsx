import clsx from "clsx";

interface ControlButtonProps {
    onClick?: () => void;
    selected?: boolean;
    children?: React.ReactNode;
    className?: string;
  }
  
  const ControlButton: React.FC<ControlButtonProps> = ({ onClick, selected, children, className, ...props }) => {
    return (
      <button
        className={clsx(
          'h-7 w-7 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-200 p-1 flex items-center justify-center',
          {
            "bg-gray-100": selected,
          },
          className
        )}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  };

  export default ControlButton;