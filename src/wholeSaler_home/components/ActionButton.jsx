import React from "react";

const VARIANTS = {
  primary: "bg-black text-white hover:bg-gray-900 active:scale-[0.98]",
  secondary: "bg-white text-gray-900 ring-1 ring-inset ring-gray-200 hover:border-rose-300 hover:ring-rose-300 active:scale-[0.98]",
  ghost: "text-gray-600 hover:text-black hover:bg-gray-100 active:bg-gray-200",
  icon: "text-gray-400 hover:text-black hover:bg-gray-50",
  danger: "text-gray-600 hover:text-red-600 hover:bg-red-50",
};

const SIZES = {
  sm: "px-3 py-1.5 text-[11px] sm:text-xs",
  md: "px-4 py-2 text-xs sm:text-sm",
  lg: "px-5 py-2.5 text-sm",
  icon: "p-2",
};

function ActionButton({
  children,
  variant = "primary",
  size = "md",
  icon,
  type = "button",
  className = "",
  ...rest
}) {
  return (
    <button
      type={type}
      className={`font-inter inline-flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

export default React.memo(ActionButton);