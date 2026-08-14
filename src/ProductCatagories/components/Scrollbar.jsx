import React from 'react';

export const Scrollbar = React.forwardRef(function Scrollbar({ className = "", children, ...rest }, ref) {
  return (
    <div
      ref={ref}
      className={`overflow-y-auto overflow-x-auto
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar]:h-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-200
        hover:[&::-webkit-scrollbar-thumb]:bg-gray-300
        transition-colors duration-200
        ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
});