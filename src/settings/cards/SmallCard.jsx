import React from "react";
import { motion } from "framer-motion";

export function SmallCard({ title, value, icon: Icon }) {
  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.01,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
      }}
      className={`
        rounded-[28px]
        border
        border-zinc-200
        bg-white
        p-4
        shadow-xl
        shadow-zinc-200/60
        transition-all
        duration-300
        cursor-pointer
        hover:border-pink-400
        hover:bg-pink-50/80
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`
              text-xs
              font-semibold
              uppercase
              tracking-[0.12em]
              text-zinc-500
            `}
          >
            {title}
          </p>

          <h3
            className={`
              mt-3
              text-xl
              font-black
              text-zinc-900
            `}
          >
            {value}
          </h3>
        </div>

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-2xl
            bg-sky-500/10
            text-sky-400
          "
        >
          <Icon size={19} />
        </div>
      </div>
    </motion.div>
  );
}