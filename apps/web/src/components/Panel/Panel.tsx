import { forwardRef, ComponentPropsWithRef } from 'react';
import clsx from 'clsx';

const Panel = forwardRef<HTMLDivElement, ComponentPropsWithRef<'div'>>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx("bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700", className)}
      {...props} />
  );
});

Panel.displayName = 'Panel';

export default Panel;
