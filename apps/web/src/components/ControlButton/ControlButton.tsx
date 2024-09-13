import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";

export interface ControlButtonProps extends ComponentPropsWithoutRef<"button"> {
  onClick?: () => void;
  selected?: boolean;
  children?: React.ReactNode;
  className?: string;
  selectedClassName?: string;
}

const ControlButton: React.FC<ControlButtonProps> = ({ onClick, selected, children, className, selectedClassName, ...props }) => {
  return (
    <button
      className={clsx(
        'rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 dark:border-gray-700 p-1 flex items-center justify-center text-gray-800 dark:text-gray-200',
        {
          "h-9 w-9": !className?.match(/\bh-|\bw-/),
          "ring-1 ring-blue-400": selected,
        },
        className,
        selected && (selectedClassName ?? 'bg-gray-100 dark:bg-gray-900')
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default ControlButton;