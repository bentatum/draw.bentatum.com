import { forwardRef, ComponentPropsWithRef } from 'react';
import clsx from 'clsx';

const Panel = forwardRef<HTMLDivElement, ComponentPropsWithRef<'div'>>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx("bg-white p-3 rounded-lg shadow border border-gray-50", className)}
      {...props} />
  );
});

Panel.displayName = 'Panel';

export default Panel;
