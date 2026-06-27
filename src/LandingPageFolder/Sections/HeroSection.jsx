import React from 'react';
import { motion } from 'framer-motion';

import {
  Search,
  Layers,
  Zap,
  Truck,
  BarChart3,
  MessageSquareText,
  ArrowRight,
  RefreshCw,
  Radio,
  Terminal,
  Shield,
  Sparkles,
  Activity,
  Globe2
} from 'lucide-react';

import Shopkeeper from "../../assets/retailer.png";
import Wholesaler from "../../assets/wholesaler.png";

import FeatureCard from './FeatuesCard';
import { useNavigate } from 'react-router-dom';

export default function HeroScene() {

  const navigate = useNavigate();

  const TRUST_BAR_ITEMS = [
    {
      id: 'search',
      icon: Search,
      title: 'Nearby Supplier Discovery',
      description:
        'Find trusted wholesalers nearby based on product availability, location, and delivery range.'
    },
    {
      id: 'price',
      icon: Layers,
      title: 'Live Price Comparison',
      description:
        'Compare pricing, stock availability, and minimum order quantities across multiple suppliers instantly.'
    },
    {
      id: 'orders',
      icon: Zap,
      title: 'Smart Order Management',
      description:
        'Create, manage, and repeat orders faster with streamlined purchasing workflows.'
    },
    {
      id: 'tracking',
      icon: Truck,
      title: 'Real-Time Delivery Tracking',
      description:
        'Track deliveries, monitor driver routes, and receive live order arrival updates.'
    },
    {
      id: 'insights',
      icon: BarChart3,
      title: 'Business Insights & Analytics',
      description:
        'Analyze sales performance, supplier activity, and product demand from one dashboard.'
    },
    {
      id: 'chat',
      icon: MessageSquareText,
      title: 'Built-in Business Chat',
      description:
        'Communicate instantly with retailers and wholesalers through real-time in-app messaging.'
    }
  ];

  const containerGridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15
      }
    }
  };

  const infrastructureEase = [0.25, 1, 0.5, 1];

  return (
    <section className="relative w-full overflow-hidden bg-[#F4F7FB] text-slate-900 font-sans antialiased select-none">

      {/* BACKGROUND INFRASTRUCTURE */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 mix-blend-multiply opacity-60">

        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:48px_48px]" />

        {/* NETWORK PATHS */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 1800"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M 250 450 Q 450 250, 720 450 T 1190 450"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />

          <motion.path
            d="M 250 450 Q 450 250, 720 450 T 1190 450"
            fill="none"
            stroke="#EC4899"
            strokeWidth="2"
            strokeDasharray="40 180"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -440 }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          <motion.path
            d="M 250 480 C 450 650, 950 250, 1190 480"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1"
            strokeDasharray="4 6"
          />

          <motion.path
            d="M 250 480 C 450 650, 950 250, 1190 480"
            fill="none"
            stroke="#475569"
            strokeWidth="1.5"
            strokeDasharray="20 300"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: 320 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </svg>
      </div>

      {/* PREMIUM GLOW */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">

        <div className="absolute top-[14%] left-1/2 -translate-x-1/2 w-[760px] h-[760px] bg-pink-400/10 blur-[140px] rounded-full" />

        <div className="absolute top-[22%] right-[8%] w-[340px] h-[340px] bg-sky-400/10 blur-[120px] rounded-full" />

        <div className="absolute bottom-[8%] left-[5%] w-[340px] h-[340px] bg-violet-400/10 blur-[120px] rounded-full" />
      </div>

      {/* FLOATING METRICS */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="hidden 2xl:flex absolute top-28 left-14 z-30 bg-white/90 backdrop-blur-xl border border-white rounded-2xl px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
      >
        <div className="flex items-center gap-4">

          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center border border-white">
            <Activity className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-900">
              1,240+ Orders
            </span>

            <span className="text-xs text-slate-500 font-medium">
              processed today
            </span>
          </div>

        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="hidden 2xl:flex absolute bottom-40 right-16 z-30 bg-white/90 backdrop-blur-xl border border-white rounded-2xl px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
      >
        <div className="flex items-center gap-4">

          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-50 flex items-center justify-center border border-white">
            <Globe2 className="w-5 h-5 text-sky-600" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-900">
              Live Supplier Network
            </span>

            <span className="text-xs text-slate-500 font-medium">
              connected across regions
            </span>
          </div>

        </div>
      </motion.div>

      {/* HERO CORE */}
      <div
        className="
        relative z-10 w-full max-w-[1440px] mx-auto
        px-6 sm:px-8
        pt-24 pb-14
        lg:pt-28 lg:pb-10
        xl:py-0
        min-h-[92vh] xl:min-h-screen
        flex flex-col lg:flex-row
        items-center justify-center lg:justify-between
        gap-12 lg:gap-8
      "
        style={{ perspective: 1600 }}
      >

        {/* LEFT CARD */}
        <motion.div
          className="hidden lg:block relative w-[280px] xl:w-[320px] h-[480px] origin-left z-20"
          initial={{
            opacity: 0,
            x: -80,
            rotateY: 25,
            filter: "blur(10px)"
          }}
          animate={{
            opacity: 1,
            x: 0,
            rotateY: 14,
            filter: "blur(0px)",
            y: [0, -10, 0]
          }}
          transition={{
            opacity: {
              duration: 1.4,
              ease: infrastructureEase
            },
            x: {
              duration: 1.4,
              ease: infrastructureEase
            },
            rotateY: {
              duration: 1.4,
              ease: infrastructureEase
            },
            filter: {
              duration: 1.2
            },
            y: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <div className="w-full h-full bg-white/85 p-2.5 rounded-[28px] shadow-[24px_40px_100px_-24px_rgba(15,23,42,0.12)] border border-white/70 relative overflow-hidden group backdrop-blur-2xl">

            <div className="absolute inset-0 border border-slate-200/50 rounded-[26px] pointer-events-none z-30" />

            <div className="w-full h-full rounded-[18px] overflow-hidden bg-slate-50 relative">

              <img
                src={Shopkeeper}
                alt="Retailer Dashboard"
                className="w-full h-full object-cover saturate-[1.15] contrast-[1.02] transition-all duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/10 to-transparent opacity-90" />
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-1 font-mono text-slate-800">

              <span className="text-[10px] tracking-[0.24em] text-slate-400 uppercase">
                Retailer Dashboard
              </span>

              <span className="text-xs font-bold tracking-wide text-slate-900">
                SMART ORDER MANAGEMENT
              </span>

            </div>

          </div>
        </motion.div>

        {/* CENTER CONTENT */}
        <div className="flex flex-col items-center justify-center text-center flex-1 max-w-3xl mx-auto z-30 px-4 w-full">

          {/* TOP LABEL */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              filter: "blur(8px)"
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)"
            }}
            transition={{
              duration: 1,
              ease: infrastructureEase
            }}
            className="mb-8 flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-slate-500 uppercase flex-wrap justify-center"
          >
            <Radio size={12} className="text-pink-500 animate-pulse" />

            <span className="font-bold">
              StockLinker
            </span>

            <span className="text-slate-300">
              |
            </span>

            <span className="flex items-center gap-1 font-semibold">
              <Terminal size={11} />

              CONNECTED COMMERCE INFRASTRUCTURE
            </span>
          </motion.div>

          {/* TITLE */}
          <motion.h1
            initial={{
              opacity: 0,
              y: 60,
              scale: 0.96,
              filter: "blur(12px)"
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)"
            }}
            transition={{
              duration: 1.2,
              ease: infrastructureEase,
              delay: 0.1
            }}
            className="text-[44px] sm:text-[56px] md:text-[68px] xl:text-[82px] font-black tracking-[-0.05em] text-zinc-900 leading-[0.98] uppercase"
          >
            Connect.
            <br />

            Compare.
            <br />

            <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 bg-clip-text text-transparent">
              Scale Faster.
            </span>
          </motion.h1>

          {/* SUBTITLE */}
          <motion.p
            initial={{
              opacity: 0,
              y: 30,
              filter: "blur(8px)"
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)"
            }}
            transition={{
              duration: 1.2,
              ease: infrastructureEase,
              delay: 0.2
            }}
            className="mt-8 text-sm md:text-base text-slate-600 max-w-[580px] leading-[1.8] font-medium tracking-tight"
          >
            StockLinker helps retailers discover nearby wholesalers,
            compare live prices, manage orders, and track deliveries —
            all from one intelligent commerce platform.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
              scale: 0.96
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            transition={{
              duration: 1.2,
              ease: infrastructureEase,
              delay: 0.3
            }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >

            <button className="group h-14 px-8 bg-black font-mono text-xs tracking-[0.2em] uppercase text-white rounded-2xl transition-all duration-300 shadow-[0_12px_40px_rgba(236,72,153,0.22)] flex items-center justify-center gap-3 w-full sm:w-auto hover:scale-[1.02] hover:-translate-y-[2px]">

              <Sparkles
                size={14}
                className="text-pink-300"
              />

              <span onClick={() => navigate('/login')}>
                Get Started
              </span>

              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />

            </button>

            <button className="h-14 px-8 bg-white/80 hover:bg-white font-mono text-xs tracking-[0.2em] uppercase text-slate-700 rounded-2xl transition-all duration-300 border border-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] flex items-center justify-center gap-2 w-full sm:w-auto hover:-translate-y-[2px]">

              <Shield
                size={13}
                className="text-slate-400"
              />

              <span>
                See Platform
              </span>

            </button>

          </motion.div>

          {/* MOBILE CARDS */}
          <div className="w-full mt-12 lg:hidden">

            <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">

              {/* CARD 1 */}
              <div className="bg-white/85 p-2 rounded-[20px] shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-white overflow-hidden group backdrop-blur-xl text-left">

                <div className="rounded-[14px] overflow-hidden bg-slate-50 relative aspect-[4/5]">

                  <img
                    src={Shopkeeper}
                    alt="Retailer Dashboard"
                    className="w-full h-full object-cover saturate-[1.15] contrast-[1.02] transition-all duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-transparent" />
                </div>

                <div className="mt-3 px-1 flex flex-col font-mono text-slate-800">

                  <span className="text-[8px] tracking-[0.22em] text-slate-400 uppercase">
                    Retailer Dashboard
                  </span>

                  <span className="text-[10px] font-bold tracking-wide text-slate-900 truncate">
                    SMART ORDER MANAGEMENT
                  </span>

                </div>

              </div>

              {/* CARD 2 */}
              <div className="bg-white/85 p-2 rounded-[20px] shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-white overflow-hidden group backdrop-blur-xl text-left">

                <div className="rounded-[14px] overflow-hidden bg-slate-50 relative aspect-[4/5]">

                  <img
                    src={Wholesaler}
                    alt="Wholesaler Network"
                    className="w-full h-full object-cover saturate-[1.15] contrast-[1.02] transition-all duration-700 group-hover:scale-105"
                    style={{
                      transform: "scaleX(-1)"
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-transparent" />
                </div>

                <div className="mt-3 px-1 flex flex-col font-mono text-slate-800">

                  <span className="text-[8px] tracking-[0.22em] text-slate-400 uppercase">
                    Wholesaler Network
                  </span>

                  <span className="text-[10px] font-bold tracking-wide text-slate-900 truncate">
                    LIVE SUPPLIER INVENTORY
                  </span>

                </div>

              </div>

            </div>

          </div>
        </div>

        {/* RIGHT CARD */}
        <motion.div
          className="hidden lg:block relative w-[280px] xl:w-[320px] h-[480px] origin-right z-20"
          initial={{
            opacity: 0,
            x: 80,
            rotateY: -25,
            filter: "blur(10px)"
          }}
          animate={{
            opacity: 1,
            x: 0,
            rotateY: -14,
            filter: "blur(0px)",
            y: [0, 10, 0]
          }}
          transition={{
            opacity: {
              duration: 1.4,
              ease: infrastructureEase
            },
            x: {
              duration: 1.4,
              ease: infrastructureEase
            },
            rotateY: {
              duration: 1.4,
              ease: infrastructureEase
            },
            filter: {
              duration: 1.2
            },
            y: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <div className="w-full h-full bg-white/85 p-2.5 rounded-[28px] shadow-[-24px_40px_100px_-24px_rgba(15,23,42,0.12)] border border-white/70 relative overflow-hidden group backdrop-blur-2xl">

            <div className="absolute inset-0 border border-slate-200/50 rounded-[26px] pointer-events-none z-30" />

            <div className="w-full h-full rounded-[18px] overflow-hidden bg-slate-50 relative">

              <img
                src={Wholesaler}
                alt="Wholesaler Network"
                className="w-full h-full object-cover saturate-[1.15] contrast-[1.02] transition-all duration-700 group-hover:scale-105"
                style={{
                  transform: "scaleX(-1)"
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/10 to-transparent opacity-90" />

            </div>

            <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-1 font-mono text-slate-800">

              <span className="text-[10px] tracking-[0.24em] text-slate-400 uppercase">
                Wholesaler Network
              </span>

              <span className="text-xs font-bold tracking-wide text-slate-900">
                LIVE SUPPLIER INVENTORY
              </span>

            </div>

          </div>
        </motion.div>

      </div>

      {/* FEATURES SECTION */}
      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 pb-14 pt-2 lg:pt-8 z-20">

        <div className="w-full bg-white/55 backdrop-blur-2xl rounded-[1rem] border border-white/70 p-5 sm:p-8 lg:p-14 shadow-[0_20px_80px_rgba(15,23,42,0.05)]">

          {/* HEADER */}
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-14 lg:mb-16">

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                filter: "blur(6px)"
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)"
              }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-white shadow-[0_8px_20px_rgba(15,23,42,0.04)] mb-5"
            >

              <span className="text-[10px] font-black tracking-[0.18em] uppercase bg-gradient-to-r from-sky-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
                ⚙️ Platform Features
              </span>

            </motion.div>

            <motion.h2
              initial={{
                opacity: 0,
                y: 20,
                filter: "blur(8px)"
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)"
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                type: 'spring'
              }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.05em] text-[#0F172A] leading-[1.02] mb-5"
            >
              Built for Modern
              <br />

              <span className="bg-gradient-to-r from-sky-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
                Wholesale Commerce
              </span>

            </motion.h2>

            <motion.p
              initial={{
                opacity: 0,
                y: 15,
                filter: "blur(8px)"
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)"
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.1
              }}
              className="text-sm sm:text-base text-[#64748B] font-medium leading-[1.9] max-w-2xl"
            >
              Manage suppliers, pricing, orders, logistics, and retailer communication
              from one intelligent infrastructure platform.
            </motion.p>

          </div>

          {/* TRUST CARDS */}
          <motion.div
            variants={containerGridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: "-100px"
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          >
            {TRUST_BAR_ITEMS.map((item) => (
              <FeatureCard
                key={item.id}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </motion.div>

          {/* STATUS BAR */}
          <div className="mt-10 pt-5 border-t border-slate-200/60 flex items-center justify-end">

            <div className="flex items-center gap-2 text-[11px] font-bold text-sky-600 bg-sky-50 px-4 py-2 rounded-xl border border-sky-100/60 shadow-[0_10px_30px_rgba(14,165,233,0.08)]">

              <RefreshCw className="w-3 h-3 animate-spin" />

              <span>
                Active Network System Feeds Online
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
