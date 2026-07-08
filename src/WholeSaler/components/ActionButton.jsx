// components/ActionButton.jsx
import React from "react";

const VARIANTS = {
  primary:
    "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm",
  secondary:
    "bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 hover:-translate-y-0.5 active:translate-y-0",
  ghost: "text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100",
  icon: "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100",
  danger: "text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:bg-rose-100",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
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
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

export default React.memo(ActionButton);
