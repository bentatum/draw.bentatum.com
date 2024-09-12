import { forwardRef, ComponentPropsWithRef } from 'react';
import clsx from 'clsx';

const Panel = forwardRef<HTMLDivElement, ComponentPropsWithRef<'div'>>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx("overflow-hidden bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700", { 'p-3': !className?.match(/p-\d/) }, className)}
      {...props} />
  );
});

Panel.displayName = 'Panel';

export default Panel;
