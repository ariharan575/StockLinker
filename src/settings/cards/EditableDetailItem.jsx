import React from "react";

export function EditableDetailItem({
  label,
  value,
  isEditing,
  onChange,
  fieldKey,
}) {
  if (isEditing) {
    return (
      <div
        className={`
          rounded-2xl
          border
          border-sky-300
          bg-sky-50
          p-4
          transition-all
          duration-300
        `}
      >
        <p
          className={`
            text-xs
            font-semibold
            uppercase
            tracking-[0.14em]
            text-sky-600
          `}
        >
          {label}
        </p>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          className={`
            mt-3
            w-full
            text-[15px]
            font-bold
            leading-relaxed
            outline-none
            bg-transparent
            border-b
            border-zinc-300
            pb-1
            text-zinc-900
            focus:border-sky-500
          `}
        />
      </div>
    );
  }

  return (
    <div
      className={`
        rounded-2xl
        border
        border-zinc-200
        bg-zinc-50
        p-4
        transition-all
        duration-300
        cursor-pointer
        hover:border-pink-400
        hover:bg-pink-50/60
      `}
    >
      <p
        className={`
          text-xs
          font-semibold
          uppercase
          tracking-[0.14em]
          text-zinc-500
        `}
      >
        {label}
      </p>

      <h3
        className={`
          mt-3
          text-[15px]
          font-bold
          leading-relaxed
          text-zinc-900
        `}
      >
        {value}
      </h3>
    </div>
  );
}