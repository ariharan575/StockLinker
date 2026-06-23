import React, { useState, useEffect, useMemo } from "react";
import {
  Loader2,
  Sparkles
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";


export const Loading = () => {

  const [loading, setLoading] = useState(true);


    if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">

        <motion.div
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
          }}
          className="text-center"
        >

          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            }}
            className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-r from-pink-500 via-red-500 to-sky-500 flex items-center justify-center"
          >
            <Sparkles className="text-white" size={34} />
          </motion.div>

          <h1 className="mt-8 text-white text-4xl font-black">
            StockLinker
          </h1>

          <div className="mt-6 flex justify-center">
            <Loader2
              className="animate-spin text-pink-400"
              size={28}
            />
          </div>

        </motion.div>
      </div>
    );
  }

  return (
    <div>Loading</div>
  )
}
