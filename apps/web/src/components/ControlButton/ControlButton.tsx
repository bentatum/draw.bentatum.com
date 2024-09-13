import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";

export interface ControlButtonProps extends ComponentPropsWithoutRef<"button"> {
  onClick?: () => void;
  selected?: boolean;
  children?: React.ReactNode;
  className?: string;
  selectedClassName?: string | null;
}

const ControlButton: React.FC<ControlButtonProps> = ({
  onClick,
  selected,
  children,
  className,
  selectedClassName = 'bg-gray-300 dark:bg-gray-600',
  ...props
}) => {
  return (
    <button
      className={clsx(
        'rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 dark:border-gray-700 p-1 flex items-center justify-center text-gray-800 dark:text-gray-200',
        {
          "h-9 w-9": !className?.match(/\bh-|\bw-/),
          "ring-1 ring-blue-400": selected,
          'bg-gray-100 dark:bg-gray-900': !selected && !className?.match(/bg-/),
          'active:bg-gray-200 dark:active:bg-gray-700 focus:bg-gray-300 dark:focus:bg-gray-600': !className?.match(/bg-/),
        },
        className,
        selected && selectedClassName
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default ControlButton;