"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe2,
  ChevronRight,
  Check,
  Sparkles,
  Building2,
} from "lucide-react";

export default function PremiumLanguageSelector() {
  const [selected, setSelected] = useState("en");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  // KEYBOARD SUPPORT
  useEffect(() => {
    const handleKey = (e) => {
      if (loading) return;

      if (e.key === "ArrowRight") {
        setSelected("en");
      }

      if (e.key === "ArrowLeft") {
        setSelected("ta");
      }

      if (e.key === "Enter") {
        console.log("Selected Language:", selected);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, loading]);

  const languages = [
    {
      id: "ta",
      title: "தமிழ்",
      subtitle: "Tamil Language",
      desc: "Localized wholesale experience",
      iconBg:
        "bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 border border-pink-100",
      iconColor: "text-pink-600",
      activeBorder: "border-pink-500/30",
      activeShadow: "shadow-[0_15px_45px_rgba(236,72,153,0.10)]",
    },
    {
      id: "en",
      title: "English",
      subtitle: "Global Language",
      desc: "Professional enterprise workflow",
      iconBg:
        "bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 border border-pink-100",
      iconColor: "text-pink-600",
      activeBorder: "border-pink-500/30",
      activeShadow: "shadow-[0_15px_45px_rgba(236,72,153,0.10)]",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gray-200 px-4 py-5 sm:px-6 lg:px-8">
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        {/* GRID */}
        <div className="absolute inset-0 opacity-[0.03] bg-[size:46px_46px] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]" />

        {/* TOP LIGHT */}
        <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[760px] h-[360px] bg-pink-500/5 blur-3xl rounded-full" />

        {/* FLOATING LIGHTS */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="absolute top-10 left-0 w-72 h-72 rounded-full bg-pink-400/5 blur-3xl"
        />

        <motion.div
          animate={{
            y: [0, 35, 0],
            x: [0, -18, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
          }}
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-neutral-300/20 blur-3xl"
        />
      </div>

      {/* LOADING */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.08,
              filter: "blur(14px)",
            }}
            transition={{
              duration: 0.8,
            }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#f8f9fb]"
          >
            <div className="relative flex flex-col items-center">
              {/* RINGS */}
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  repeat: Infinity,
                  duration: 14,
                  ease: "linear",
                }}
                className="absolute w-48 h-48 rounded-full border border-pink-500/10"
              />

              <motion.div
                animate={{
                  rotate: -360,
                }}
                transition={{
                  repeat: Infinity,
                  duration: 18,
                  ease: "linear",
                }}
                className="absolute w-64 h-64 rounded-full border border-neutral-300/40"
              />

              {/* GLOW */}
              <motion.div
                animate={{
                  scale: [1, 1.12, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="absolute w-36 h-36 rounded-full bg-pink-500/10 blur-3xl"
              />

              {/* LOGO */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="relative z-10"
              >
                <div className="relative w-24 h-24 rounded-[28px] border border-white bg-white flex items-center justify-center overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-neutral-200/40" />

                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-pink-600" />
                  </div>
                </div>
              </motion.div>

              {/* TEXT */}
              <motion.h1
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.2,
                }}
                className="mt-8 text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent"
              >
                StockLinker
              </motion.h1>

              <p className="mt-2 text-sm tracking-wide text-neutral-500">
                Preparing workspace...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN */}
      {!loading && (
        <motion.div
          initial={{
            opacity: 0,
            y: 35,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10 w-full max-w-4xl"
        >
          <div className="relative overflow-hidden rounded-[30px] border border-neutral-200 bg-white shadow-[10px_50px_100px_rgba(0,0,0,0.12)]">
            {/* LIGHT */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.06),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.9),transparent_20%)]" />

            <div className="relative grid lg:grid-cols-[1fr_400px]">
              {/* LEFT SIDE */}
              <div className="hidden lg:flex flex-col justify-center p-10 xl:p-12">
                {/* BADGE */}
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-700"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  StockLinker
                </motion.div>

                {/* TITLE */}
                <motion.h1
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.2,
                  }}
                  className="mt-6 text-[48px] leading-[1.02] font-black tracking-[-0.04em] text-neutral-900"
                >
                  Select Your
                  <br />

                  <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                    Language
                  </span>
                </motion.h1>

                {/* DESC */}
                <motion.p
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.3,
                  }}
                  className="mt-5 max-w-lg text-sm leading-7 text-neutral-500"
                >
                  Personalize your enterprise workflow with a clean multilingual
                  experience built for speed and productivity.
                </motion.p>
              </div>

              {/* RIGHT SIDE */}
              <div className="relative border-neutral-200 lg:border-l bg-white p-4 sm:p-6 md:p-7 lg:p-8">
                {/* MOBILE TITLE */}
                <div className="lg:hidden my-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-3 py-1.5 text-[11px] font-semibold text-pink-600">
                    <Sparkles className="w-3.5 h-3.5" />
                    StockLinker
                  </div>

                  <h1 className="mt-4 text-[28px] sm:text-[34px] leading-[1.05] font-black tracking-[-0.04em] text-neutral-900">
                    Select Your

                    <span className=" ps-2 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                      Language
                    </span>
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-neutral-500">
                    Choose your preferred workspace language.
                  </p>
                </div>

                {/* LANGUAGES */}
                <div className="space-y-3">
                  {languages.map((lang, index) => {
                    const active = selected === lang.id;

                    return (
                      <motion.div
                        key={lang.id}
                        initial={{
                          opacity: 0,
                          x: 20,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay: index * 0.12,
                        }}
                        whileHover={{
                          y: -3,
                          scale: 1.01,
                        }}
                        whileTap={{
                          scale: 0.985,
                        }}
                        onClick={() => setSelected(lang.id)}
                        className={`group relative overflow-hidden rounded-[24px] border cursor-pointer transition-all duration-500 ${
                          active
                            ? `${lang.activeBorder} bg-white ${lang.activeShadow}`
                            : "border-neutral-200 bg-white"
                        }`}
                      >
                        {/* ACTIVE */}
                        {active && (
                          <motion.div
                            layoutId="activeLanguage"
                            className="absolute inset-0 rounded-[24px] border border-pink-500/20"
                          />
                        )}

                        <div className="relative flex items-center justify-between p-4">
                          {/* LEFT */}
                          <div className="flex items-center gap-3 min-w-0">
                            {/* ICON */}
                            <motion.div
                              whileHover={{
                                rotate: 8,
                                scale: 1.05,
                              }}
                              transition={{
                                duration: 0.3,
                              }}
                              className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${lang.iconBg}`}
                            >
                              <Globe2
                                className={`w-5 h-5 ${lang.iconColor}`}
                              />
                            </motion.div>

                            {/* TEXT */}
                            <div className="min-w-0">
                              <h3 className="text-[15px] sm:text-[17px] font-bold tracking-tight text-neutral-900">
                                {lang.title}
                              </h3>

                              <p className="mt-0.5 text-xs sm:text-sm text-neutral-500">
                                {lang.subtitle}
                              </p>

                              <p className="mt-0.5 text-[11px] text-neutral-400">
                                {lang.desc}
                              </p>
                            </div>
                          </div>

                          {/* CHECK */}
                          <AnimatePresence>
                            {active && (
                              <motion.div
                                initial={{
                                  scale: 0,
                                  rotate: -90,
                                }}
                                animate={{
                                  scale: 1,
                                  rotate: 0,
                                }}
                                exit={{
                                  scale: 0,
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 260,
                                  damping: 18,
                                }}
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg"
                              >
                                <Check className="w-3.5 h-3.5 text-white" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* BUTTON */}
                <motion.button
                  whileHover={{
                    scale: 1.01,
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.985,
                  }}
                  className="group relative mt-5 w-full overflow-hidden rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 px-5 py-3.5 text-white shadow-[0_14px_35px_rgba(236,72,153,0.22)]"
                >
                  {/* SHINE */}
                  <motion.div
                    animate={{
                      x: ["-120%", "220%"],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.8,
                      ease: "linear",
                    }}
                    className="absolute top-0 left-0 h-full w-[130px] skew-x-12 bg-white/20"
                  />

                  {/* HOVER */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 transition duration-300 group-hover:opacity-100" />

                  <div className="relative flex items-center justify-center gap-2.5">
                    <span className="text-sm font-semibold tracking-wide">
                      Continue
                    </span>

                    <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </motion.button>

                {/* FOOTER */}
                <p className="mt-4 text-center text-[11px] sm:text-xs text-neutral-400">
                  Language can be changed anytime from settings
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}