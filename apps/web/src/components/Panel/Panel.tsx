import { forwardRef, ComponentPropsWithRef } from 'react';
import clsx from 'clsx';

const Panel = forwardRef<HTMLDivElement, ComponentPropsWithRef<'div'>>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx("bg-white p-3 rounded-lg border border-gray-100", className)}
      {...props} />
  );
});

Panel.displayName = 'Panel';

export default Panel;
