"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

import {
  ArrowRight,
  BarChart3,
  Bell,
  Boxes,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Globe2,
  Headphones,
  LayoutDashboard,
  LineChart,
  LucideSparkles,
  MapPinned,
  Menu,
  MessageSquare,
  Moon,
  Package,
  PhoneCall,
  Play,
  Route,
  Search,
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
  SunMedium,
  Truck,
  User,
  Users,
  Mic,
  Warehouse,
  X,
  Zap,
  TrendingUp,
  Filter,
  BadgeCheck,
  TimerReset,
  ScanSearch,
  Layers3,
  HandCoins,
  Activity,
  BoxesIcon,
  Eye,
  Send,
  PanelRightOpen,
  RefreshCcw,
  Wallet,
  ArrowUpRight,
  CircleCheckBig,
  Languages,
  HeartHandshake,
  Sparkles,
} from "lucide-react";

const translations = {
  en: {
    announcement:
      "AI-powered wholesale commerce platform now live across Tamil Nadu",
    nav: {
      product: "Product",
      solutions: "Solutions",
      pricing: "Pricing",
      resources: "Resources",
      login: "Login",
      getStarted: "Get Started",
    },
   
    hero: {
      badge: "Next Generation B2B Commerce Platform",
      title1: "Connect",
      title2: "Connect &",
      title3: "Wholesalers",
      title4: "With Intelligent Supply Chains",
      subtitle:
        "StockLinker transforms traditional wholesale operations with AI-powered product discovery, real-time price comparison, smart route optimization, multilingual ordering, and enterprise-grade delivery infrastructure.",
      primary: "Start Free",
      secondary: "Watch Demo",
      trusted: "Trusted by modern distributors and retailers",
    },
    stats: {
      one: "Active Retailers",
      two: "Wholesalers",
      three: "Orders Processed",
      four: "Delivery Accuracy",
    },
    trusted: "Trusted by fast-growing commerce teams",
    featuresTitle: "Everything Required To Run Modern Wholesale Commerce",
    featuresSubtitle:
      "Built for distributors, wholesalers, retailers, delivery operations, and enterprise supply chain teams.",
    searchTitle: "Smart Product Discovery",
    compareTitle: "Wholesale Price Intelligence",
    routeTitle: "AI Route Optimization",
    shopkeeper: "Built For Shopkeepers",
    wholesaler: "Built For Wholesalers",
    order: "Live Order Lifecycle",
    calendar: "Smart Delivery Calendar",
    chat: "Real-Time Communication",
    reviews: "Customer Trust & Reliability",
    pricing: "Flexible Pricing",
    faq: "Frequently Asked Questions",
    final: "Transform Your Wholesale Operations Today",
    footer:
      "Modern infrastructure for the future of wholesale commerce and intelligent supply chain management.",
  },

  ta: {
    announcement:
      "தமிழ்நாடு முழுவதும் AI ஆதரவு மொத்த வணிக தளம் செயல்பாட்டில் உள்ளது",
    nav: {
      product: "தயாரிப்பு",
      solutions: "தீர்வுகள்",
      pricing: "விலை",
      resources: "வளங்கள்",
      login: "உள்நுழை",
      getStarted: "தொடங்கு",
    },
    hero: {
      badge: "அடுத்த தலைமுறை B2B வணிக தளம்",
      title1: "கடைதாரர்கள் மற்றும்",
      title2: "மொத்த விற்பனையாளர்களை",
      title3: "இணைக்கும்",
      title4: "செயற்கை நுண்ணறிவு தளம்",
      subtitle:
        "AI ஆதரவு தயாரிப்பு தேடல், விலை ஒப்பீடு, வழித்தட விநியோகம், பலமொழி ஆர்டர் மற்றும் விநியோக மேலாண்மை வசதிகளுடன் மொத்த வணிகத்தை மேம்படுத்துங்கள்.",
      primary: "இலவசமாக தொடங்கு",
      secondary: "டெமோ பார்க்க",
      trusted: "நவீன விற்பனையாளர்கள் நம்பும் தளம்",
    },
    stats: {
      one: "செயலில் உள்ள கடைகள்",
      two: "மொத்த விற்பனையாளர்கள்",
      three: "செயல்பட்ட ஆர்டர்கள்",
      four: "விநியோக துல்லியம்",
    },
    trusted: "வேகமாக வளர்ந்து வரும் வணிக குழுக்கள் நம்புகின்றன",
    featuresTitle: "நவீன மொத்த வணிகத்திற்கு தேவையான அனைத்தும்",
    featuresSubtitle:
      "விநியோகஸ்தர்கள், மொத்த விற்பனையாளர்கள் மற்றும் கடைதாரர்களுக்காக உருவாக்கப்பட்டது.",
    searchTitle: "செயற்கை நுண்ணறிவு தேடல்",
    compareTitle: "விலை ஒப்பீட்டு இயந்திரம்",
    routeTitle: "AI வழித்தட மேலாண்மை",
    shopkeeper: "கடைதாரர்களுக்காக உருவாக்கப்பட்டது",
    wholesaler: "மொத்த விற்பனையாளர்களுக்காக",
    order: "நேரடி ஆர்டர் கண்காணிப்பு",
    calendar: "டெலிவரி காலண்டர்",
    chat: "நேரடி தொடர்பு",
    reviews: "நம்பிக்கை மற்றும் மதிப்பீடு",
    pricing: "விலை திட்டங்கள்",
    faq: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    final: "இன்றே உங்கள் வணிகத்தை மேம்படுத்துங்கள்",
    footer:
      "மொத்த வணிகத்தின் எதிர்காலத்திற்கு உருவாக்கப்பட்ட நவீன தளம்.",
  },
};

const stats = [
  { value: "12K+", labelKey: "one" },
  { value: "1.8K+", labelKey: "two" },
  { value: "9.2M+", labelKey: "three" },
  { value: "99.3%", labelKey: "four" },
];

const features = [
  {
    icon: Search,
    title: "AI Product Discovery",
    description:
      "Find products instantly with multilingual search, predictive recommendations, and intelligent matching.",
  },

  {
    icon: Route,
    title: "Smart Delivery Routing",
    description:
      "Optimize routes with live traffic prediction, delivery batching, and automated stop sequencing.",
  },

  {
    icon: CircleDollarSign,
    title: "Wholesale Comparison",
    description:
      "Compare real-time pricing, availability, margins, and supplier trust scores instantly.",
  },

  {
    icon: MessageSquare,
    title: "Live Communication",
    description:
      "Chat, negotiate pricing, confirm orders, and manage relationships from one workspace.",
  },

  {
    icon: Warehouse,
    title: "Inventory Sync",
    description:
      "Real-time inventory visibility across warehouses, retailers, and delivery operations.",
  },

  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description:
      "Role-based access, secure payments, encrypted communication, and enterprise-grade reliability.",
  },
];

const testimonials = [
  {
    name: "Arun Traders",
    role: "Wholesale Distributor",
    review:
      "StockLinker completely transformed our delivery operations and retailer communication workflows.",
  },

  {
    name: "Vignesh Super Store",
    role: "Retail Shopkeeper",
    review:
      "The Tamil search and wholesale comparison saved us hours every day while improving profit margins.",
  },

  {
    name: "Delta Supply Network",
    role: "Regional Distributor",
    review:
      "Our route planning efficiency improved dramatically after switching to StockLinker.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "₹0",
    desc: "Perfect for small retailers",
    features: [
      "50 Orders / month",
      "AI Product Search",
      "Tamil & English Support",
      "Basic Delivery Tracking",
      "Mobile Dashboard",
    ],
  },

  {
    name: "Growth",
    price: "₹4,999",
    desc: "Advanced tools for growing wholesalers",
    popular: true,
    features: [
      "Unlimited Orders",
      "Smart Route Optimization",
      "Advanced Analytics",
      "Live Chat",
      "Wholesale Comparison",
      "Priority Support",
    ],
  },

  {
    name: "Enterprise",
    price: "Custom",
    desc: "For large-scale distribution networks",
    features: [
      "Dedicated Infrastructure",
      "ERP Integrations",
      "Custom Roles",
      "API Access",
      "AI Automation",
      "Enterprise SLA",
    ],
  },
];

const faqData = [
  {
    q: "Can retailers search products in Tamil?",
    a: "Yes. StockLinker supports intelligent multilingual search in Tamil and English with voice support.",
  },

  {
    q: "Does StockLinker support live order tracking?",
    a: "Yes. Orders can be tracked from placement to delivery with live delivery updates and notifications.",
  },

  {
    q: "Can wholesalers manage delivery routes?",
    a: "Absolutely. Route optimization and delivery scheduling are core platform capabilities.",
  },

  {
    q: "Is there a mobile experience?",
    a: "Yes. StockLinker is fully responsive and optimized for mobile, tablet, and desktop devices.",
  },
];

const logos = [
  "ApexTrade",
  "NovaMart",
  "DeltaSupply",
  "PrimeWholesale",
  "MetroRetail",
  "UrbanFoods",
];

const orderStages = [
  "Order Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered",
];

const deliveryStops = [
  {
    name: "Warehouse",
    icon: Warehouse,
  },

  {
    name: "Pattukkottai",
    icon: Route,
  },

  {
    name: "Customer A",
    icon: Store,
  },

  {
    name: "Customer B",
    icon: Store,
  },

  {
    name: "Thanjavur",
    icon: MapPinned,
  },

  {
    name: "Remaining Stops",
    icon: Truck,
  },
];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: "blur(12px)",
  },

  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.08,
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const Counter = ({ value }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-black tracking-tight"
    >
      {value}
    </motion.div>
  );
};

const GlassCard = ({ children, className = "" }) => {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.01,
      }}
      transition={{
        duration: 0.3,
      }}
      className={`relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_10px_80px_rgba(0,0,0,0.25)] ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
};

const MagneticButton = ({
  children,
  className = "",
  primary = false,
}) => {
  return (
    <motion.button
      whileHover={{
        scale: 1.03,
        y: -3,
      }}
      whileTap={{
        scale: 0.97,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 12,
      }}
      className={`group relative overflow-hidden rounded-2xl px-6 py-4 font-semibold transition-all duration-500 ${
        primary
          ? "bg-white text-black shadow-2xl"
          : "border border-white/15 bg-white/[0.06] text-white backdrop-blur-xl"
      } ${className}`}
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-fuchsia-500/20" />
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default function StockLinkerLanding() {
  const [mounted, setMounted] = useState(false);

  const [theme, setTheme] = useState("dark");

  const [language, setLanguage] = useState("en");

  const [mobileMenu, setMobileMenu] = useState(false);

  const [faqOpen, setFaqOpen] = useState(0);

  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -180]);

  const y2 = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const t = translations[language];

  useEffect(() => {
    setMounted(true);

    const storedTheme = localStorage.getItem("stocklinker-theme");
    const storedLanguage = localStorage.getItem("stocklinker-language");

    if (storedTheme) {
      setTheme(storedTheme);
    }

    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    document.documentElement.classList.toggle("dark", theme === "dark");

    localStorage.setItem("stocklinker-theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem("stocklinker-language", language);
  }, [language, mounted]);

  const bg =
    theme === "dark"
      ? "bg-[#04040A] text-white"
      : "bg-[#f6f8fb] text-[#0f172a]";

  const surface =
    theme === "dark"
      ? "bg-white/[0.04] border-white/10"
      : "bg-white/70 border-black/10";

  const muted =
    theme === "dark" ? "text-white/60" : "text-slate-600";

  return (
    <div
      ref={containerRef}
      className={`relative min-h-screen overflow-hidden transition-colors duration-700 ${bg}`}
    >
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 right-0 top-0 z-[999] h-[3px] origin-left bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500"
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          className="absolute left-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-cyan-500/20 blur-[120px]"
        />

        <motion.div
          style={{ y: y2 }}
          className="absolute right-[-10%] top-[20%] h-[700px] w-[700px] rounded-full bg-fuchsia-500/20 blur-[140px]"
        />

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="absolute bottom-[-10%] left-[30%] h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[120px]"
        />

        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"60\" height=\"60\" viewBox=\"0 0 60 60\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"1\"%3E%3Ccircle cx=\"7\" cy=\"7\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }}
        />
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-b border-white/10 backdrop-blur-2xl"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-3 text-center text-sm">
            <div className="flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-cyan-300">
              <Sparkles size={14} />
              <span>AI</span>
            </div>

            <p className={muted}>{t.announcement}</p>
          </div>
        </motion.div>

        <header className="sticky top-0 z-50 backdrop-blur-3xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <motion.div
                animate={floatingAnimation}
                className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 shadow-[0_20px_80px_rgba(59,130,246,0.45)]"
              >
                <Boxes className="text-white" />
              </motion.div>

              <div>
                <h1 className="text-2xl font-black tracking-tight">
                  StockLinker
                </h1>

                <p className={`text-xs ${muted}`}>
                  Enterprise Commerce Infrastructure
                </p>
              </div>
            </motion.div>

            <nav className="hidden items-center gap-8 lg:flex">
              {[
                t.nav.product,
                t.nav.solutions,
                t.nav.pricing,
                t.nav.resources,
              ].map((item, index) => (
                <motion.button
                  key={item}
                  custom={index}
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  whileHover={{ y: -2 }}
                  className={`group relative text-sm font-medium ${muted}`}
                >
                  <span className="transition-colors duration-300 group-hover:text-white">
                    {item}
                  </span>

                  <span className="absolute -bottom-2 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-500 group-hover:w-full" />
                </motion.button>
              ))}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setLanguage(language === "en" ? "ta" : "en")
                }
                className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm backdrop-blur-xl transition-all duration-500 ${surface}`}
              >
                <Languages size={16} />
                {language === "en" ? "தமிழ்" : "English"}
              </motion.button>

              <motion.button
                whileHover={{ rotate: 12, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setTheme(theme === "dark" ? "light" : "dark")
                }
                className={`rounded-2xl border p-3 backdrop-blur-xl transition-all duration-500 ${surface}`}
              >
                <AnimatePresence mode="wait">
                  {theme === "dark" ? (
                    <motion.div
                      key="sun"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                    >
                      <SunMedium size={18} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                    >
                      <Moon size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              <button
                className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${muted}`}
              >
                {t.nav.login}
              </button>

              <MagneticButton primary>
                {t.nav.getStarted}
                <ArrowRight size={16} />
              </MagneticButton>
            </div>

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className={`rounded-2xl border p-3 lg:hidden ${surface}`}
            >
              {mobileMenu ? <X /> : <Menu />}
            </button>
          </div>

          <AnimatePresence>
            {mobileMenu && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                className="overflow-hidden border-t border-white/10 lg:hidden"
              >
                <div className="space-y-3 px-4 py-5">
                  {[
                    t.nav.product,
                    t.nav.solutions,
                    t.nav.pricing,
                    t.nav.resources,
                  ].map((item) => (
                    <button
                      key={item}
                      className={`block w-full rounded-2xl border px-4 py-4 text-left ${surface}`}
                    >
                      {item}
                    </button>
                  ))}

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        setLanguage(
                          language === "en" ? "ta" : "en"
                        )
                      }
                      className={`flex-1 rounded-2xl border px-4 py-4 ${surface}`}
                    >
                      {language === "en" ? "தமிழ்" : "English"}
                    </button>

                    <button
                      onClick={() =>
                        setTheme(
                          theme === "dark" ? "light" : "dark"
                        )
                      }
                      className={`rounded-2xl border px-4 py-4 ${surface}`}
                    >
                      {theme === "dark" ? <SunMedium /> : <Moon />}
                    </button>
                  </div>

                  <MagneticButton primary className="w-full justify-center">
                    {t.nav.getStarted}
                  </MagneticButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pb-24 pt-20 md:px-8">
          <div className="grid items-center gap-20 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
              className="relative z-10"
            >
              <motion.div
                variants={fadeUp}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm text-cyan-300 backdrop-blur-xl"
              >
                <LucideSparkles size={16} />
                {t.hero.badge}
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl md:text-7xl lg:text-[92px]"
              >
                <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                  {t.hero.title1}
                </span>

                <br />

                <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                  {t.hero.title2}
                </span>

                <br />

                <span>{t.hero.title3}</span>

                <br />

                <span className={muted}>{t.hero.title4}</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className={`mt-8 max-w-2xl text-lg leading-8 md:text-xl ${muted}`}
              >
                {t.hero.subtitle}
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-10 flex flex-col gap-4 sm:flex-row"
              >
                <MagneticButton primary className="justify-center">
                  {t.hero.primary}
                  <ArrowRight size={18} />
                </MagneticButton>

                <MagneticButton className="justify-center">
                  <Play size={18} />
                  {t.hero.secondary}
                </MagneticButton>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-14 flex flex-wrap items-center gap-8"
              >
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -4 }}
                      className="h-14 w-14 rounded-full border-4 border-[#04040A] bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500"
                    />
                  ))}
                </div>

                <div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={18}
                        fill="currentColor"
                      />
                    ))}
                  </div>

                  <p className={`mt-2 text-sm ${muted}`}>
                    {t.hero.trusted}
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative"
            >
              <motion.div
                animate={floatingAnimation}
                className="absolute -left-8 top-10 z-20 hidden w-64 lg:block"
              >
                <GlassCard className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${muted}`}>
                        Daily Orders
                      </p>

                      <h3 className="mt-2 text-3xl font-black">
                        12,842
                      </h3>
                    </div>

                    <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-400">
                      <TrendingUp />
                    </div>
                  </div>

                  <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "82%" }}
                      transition={{ duration: 1.5 }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
                    />
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -12, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                }}
                className="absolute -right-8 bottom-10 z-20 hidden w-72 lg:block"
              >
                <GlassCard className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${muted}`}>
                        Route Optimization
                      </p>

                      <h3 className="mt-2 text-3xl font-black">
                        98.4%
                      </h3>
                    </div>

                    <div className="rounded-2xl bg-cyan-500/20 p-3 text-cyan-400">
                      <Route />
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                    <span className={`text-sm ${muted}`}>
                      AI Delivery Active
                    </span>
                  </div>
                </GlassCard>
              </motion.div>

              <GlassCard className="relative overflow-hidden p-5 md:p-7">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-fuchsia-500/10" />

                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 p-3">
                        <LayoutDashboard className="text-white" />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold">
                          StockLinker Dashboard
                        </h3>

                        <p className={`text-sm ${muted}`}>
                          Intelligent wholesale management
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-yellow-400" />
                      <div className="h-3 w-3 rounded-full bg-emerald-400" />
                    </div>
                  </div>

                  <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
                    <div className="space-y-5">
                      <GlassCard className="p-5">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold">
                              Live Commerce Metrics
                            </h3>

                            <p className={`mt-1 text-sm ${muted}`}>
                              AI-powered distribution analytics
                            </p>
                          </div>

                          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                            <Activity size={16} />
                            Live
                          </div>
                        </div>

                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                          {[
                            {
                              label: "Revenue",
                              value: "₹24.8L",
                              icon: Wallet,
                            },

                            {
                              label: "Orders",
                              value: "8,942",
                              icon: ShoppingCart,
                            },

                            {
                              label: "Retailers",
                              value: "2,183",
                              icon: Store,
                            },

                            {
                              label: "Growth",
                              value: "+32%",
                              icon: TrendingUp,
                            },
                          ].map((item, i) => (
                            <motion.div
                              key={item.label}
                              custom={i}
                              initial="hidden"
                              whileInView="show"
                              viewport={{ once: true }}
                              variants={fadeUp}
                              whileHover={{
                                scale: 1.03,
                                y: -4,
                              }}
                              className={`rounded-3xl border p-5 backdrop-blur-xl ${surface}`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p
                                    className={`text-sm ${muted}`}
                                  >
                                    {item.label}
                                  </p>

                                  <h4 className="mt-3 text-3xl font-black">
                                    {item.value}
                                  </h4>
                                </div>

                                <div className="rounded-2xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 p-3">
                                  <item.icon />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </GlassCard>

                      <GlassCard className="p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold">
                              Wholesale Activity
                            </h3>

                            <p className={`mt-1 text-sm ${muted}`}>
                              Real-time supply chain activity
                            </p>
                          </div>

                          <button
                            className={`rounded-2xl border px-4 py-2 text-sm ${surface}`}
                          >
                            Weekly
                          </button>
                        </div>

                        <div className="mt-8 flex h-64 items-end justify-between gap-3">
                          {[42, 68, 88, 56, 94, 72, 100].map(
                            (height, index) => (
                              <motion.div
                                key={index}
                                initial={{ height: 0 }}
                                whileInView={{
                                  height: `${height}%`,
                                }}
                                transition={{
                                  duration: 1,
                                  delay: index * 0.08,
                                }}
                                viewport={{ once: true }}
                                className="relative flex-1 rounded-t-[24px] bg-gradient-to-t from-cyan-500 via-indigo-500 to-fuchsia-500"
                              >
                                <div className="absolute inset-0 rounded-t-[24px] bg-white/20" />
                              </motion.div>
                            )
                          )}
                        </div>
                      </GlassCard>
                    </div>

                    <div className="space-y-5">
                      <GlassCard className="p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold">
                              Smart Search
                            </h3>

                            <p className={`mt-1 text-sm ${muted}`}>
                              AI Product Discovery
                            </p>
                          </div>

                          <ScanSearch />
                        </div>

                        <div className={`mt-5 rounded-2xl border p-4 ${surface}`}>
                          <div className="flex items-center gap-3">
                            <Search size={18} />

                            <input
                              readOnly
                              value="Aavin Milk 1L"
                              className="w-full bg-transparent outline-none"
                            />

                            <Mic
                              size={18}
                              className="text-cyan-400"
                            />
                          </div>
                        </div>

                        <div className="mt-5 space-y-3">
                          {[
                            "ஆவின் பால்",
                            "Parle-G",
                            "Coconut Oil",
                          ].map((search) => (
                            <div
                              key={search}
                              className={`flex items-center justify-between rounded-2xl border p-4 ${surface}`}
                            >
                              <div className="flex items-center gap-3">
                                <Search size={16} />

                                <span>{search}</span>
                              </div>

                              <ArrowUpRight size={16} />
                            </div>
                          ))}
                        </div>
                      </GlassCard>

                      <GlassCard className="p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold">
                              Active Deliveries
                            </h3>

                            <p className={`mt-1 text-sm ${muted}`}>
                              Route Intelligence
                            </p>
                          </div>

                          <Truck />
                        </div>

                        <div className="mt-6 space-y-5">
                          {[
                            {
                              city: "Thanjavur",
                              progress: "82%",
                            },

                            {
                              city: "Pattukkottai",
                              progress: "56%",
                            },

                            {
                              city: "Kumbakonam",
                              progress: "94%",
                            },
                          ].map((route) => (
                            <div key={route.city}>
                              <div className="mb-2 flex items-center justify-between">
                                <span>{route.city}</span>

                                <span className={muted}>
                                  {route.progress}
                                </span>
                              </div>

                              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{
                                    width: route.progress,
                                  }}
                                  transition={{ duration: 1.2 }}
                                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className={`text-sm uppercase tracking-[0.3em] ${muted}`}>
              {t.trusted}
            </p>

            <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
              {logos.map((logo, index) => (
                <motion.div
                  key={logo}
                  whileHover={{
                    y: -6,
                    scale: 1.03,
                  }}
                  custom={index}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className={`flex h-24 items-center justify-center rounded-[28px] border text-lg font-bold backdrop-blur-2xl ${surface}`}
                >
                  {logo}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item, index) => (
              <motion.div
                key={item.value}
                custom={index}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <GlassCard className="h-full p-8">
                  <Counter value={item.value} />

                  <p className={`mt-3 text-lg ${muted}`}>
                    {t.stats[item.labelKey]}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-emerald-400">
                    <TrendingUp size={18} />
                    <span className="text-sm">+18.2%</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-28 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm text-cyan-300">
              <Layers3 size={16} />
              Enterprise Features
            </div>

            <h2 className="mt-8 text-4xl font-black tracking-[-0.04em] md:text-6xl">
              {t.featuresTitle}
            </h2>

            <p className={`mt-6 text-lg leading-8 ${muted}`}>
              {t.featuresSubtitle}
            </p>
          </motion.div>

          <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                custom={index}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <GlassCard className="group h-full p-8 transition-all duration-700">
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-fuchsia-500/10" />

                  <motion.div
                    whileHover={{
                      rotate: 8,
                      scale: 1.05,
                    }}
                    className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 shadow-[0_20px_80px_rgba(59,130,246,0.4)]"
                  >
                    <feature.icon className="text-white" />
                  </motion.div>

                  <h3 className="relative mt-8 text-2xl font-bold">
                    {feature.title}
                  </h3>

                  <p
                    className={`relative mt-5 text-base leading-8 ${muted}`}
                  >
                    {feature.description}
                  </p>

                  <button className="relative mt-8 flex items-center gap-2 font-semibold text-cyan-300">
                    Explore Feature
                    <ChevronRight size={18} />
                  </button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-28 md:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-5 py-3 text-sm text-indigo-300">
                <Search size={16} />
                Search Engine
              </div>

              <h2 className="mt-8 text-4xl font-black tracking-[-0.04em] md:text-6xl">
                {t.searchTitle}
              </h2>

              <p className={`mt-6 text-lg leading-8 ${muted}`}>
                AI-powered multilingual search helps retailers instantly
                discover products across multiple wholesalers using Tamil,
                English, barcode scanning, and voice search.
              </p>

              <div className="mt-10 space-y-5">
                {[
                  "Voice Search",
                  "Tamil Product Discovery",
                  "Predictive AI Recommendations",
                  "Smart Category Filtering",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4"
                  >
                    <div className="rounded-2xl bg-emerald-500/20 p-2 text-emerald-400">
                      <Check size={18} />
                    </div>

                    <span className="text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <GlassCard className="overflow-hidden p-7">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold">
                      Smart Search Interface
                    </h3>

                    <p className={`mt-2 text-sm ${muted}`}>
                      AI-powered multilingual discovery
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      className={`rounded-2xl border px-4 py-2 text-sm ${surface}`}
                    >
                      Tamil
                    </button>

                    <button
                      className={`rounded-2xl border px-4 py-2 text-sm ${surface}`}
                    >
                      English
                    </button>
                  </div>
                </div>

                <div
                  className={`mt-8 rounded-[28px] border p-5 backdrop-blur-2xl ${surface}`}
                >
                  <div className="flex items-center gap-4">
                    <Search />

                    <input
                      readOnly
                      value="ஆவின் பால்"
                      className="w-full bg-transparent text-lg outline-none"
                    />

                    <motion.div
                      animate={{
                        scale: [1, 1.15, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="rounded-2xl bg-cyan-500/20 p-3 text-cyan-300"
                    >
                      <Mic />
                    </motion.div>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {[
                    {
                      name: "Aavin Milk 1L",
                      match: "98% Match",
                    },

                    {
                      name: "Parle-G Biscuits",
                      match: "92% Match",
                    },

                    {
                      name: "Coconut Oil",
                      match: "88% Match",
                    },

                    {
                      name: "Rice 25KG",
                      match: "95% Match",
                    },
                  ].map((product, index) => (
                    <motion.div
                      key={product.name}
                      custom={index}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true }}
                      variants={fadeUp}
                      whileHover={{
                        y: -5,
                      }}
                      className={`rounded-3xl border p-5 ${surface}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold">
                            {product.name}
                          </h4>

                          <p
                            className={`mt-2 text-sm ${muted}`}
                          >
                            AI Suggested Product
                          </p>
                        </div>

                        <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
                          {product.match}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-28 md:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <GlassCard className="overflow-hidden p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">
                      Price Comparison Engine
                    </h3>

                    <p className={`mt-2 text-sm ${muted}`}>
                      Compare wholesale pricing instantly
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-300">
                    <CircleDollarSign />
                  </div>
                </div>

                <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10">
                  <div className="grid grid-cols-4 border-b border-white/10 bg-white/[0.03] p-5 font-semibold">
                    <div>Wholesaler</div>
                    <div>Price</div>
                    <div>Stock</div>
                    <div>Savings</div>
                  </div>

                  {[
                    {
                      name: "Delta Supply",
                      price: "₹48",
                      stock: "2.4K",
                      save: "Best",
                    },

                    {
                      name: "Metro Traders",
                      price: "₹52",
                      stock: "5.1K",
                      save: "+8%",
                    },

                    {
                      name: "Nova Wholesale",
                      price: "₹56",
                      stock: "1.2K",
                      save: "+15%",
                    },
                  ].map((row, index) => (
                    <motion.div
                      key={row.name}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="grid grid-cols-4 border-b border-white/10 p-5 transition-all duration-500 hover:bg-white/[0.03]"
                    >
                      <div className="font-semibold">
                        {row.name}
                      </div>

                      <div>{row.price}</div>

                      <div>{row.stock}</div>

                      <div className="text-emerald-300">
                        {row.save}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 rounded-[28px] border border-emerald-500/20 bg-emerald-500/10 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold">
                        Estimated Monthly Savings
                      </h4>

                      <p className={`mt-2 text-sm ${muted}`}>
                        AI optimized purchasing recommendations
                      </p>
                    </div>

                    <div className="text-4xl font-black text-emerald-300">
                      ₹42K
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm text-emerald-300">
                <HandCoins size={16} />
                Pricing Intelligence
              </div>

              <h2 className="mt-8 text-4xl font-black tracking-[-0.04em] md:text-6xl">
                {t.compareTitle}
              </h2>

              <p className={`mt-6 text-lg leading-8 ${muted}`}>
                Instantly compare wholesalers, analyze margin opportunities,
                optimize procurement decisions, and improve profitability
                through real-time AI-driven pricing intelligence.
              </p>

              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {[
                  "Margin Analytics",
                  "Supplier Ranking",
                  "Bulk Cost Analysis",
                  "Inventory Insights",
                ].map((item) => (
                  <GlassCard key={item} className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-cyan-500/20 p-3 text-cyan-300">
                        <BadgeCheck size={18} />
                      </div>

                      <span className="font-semibold">{item}</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-28 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-5 py-3 text-sm text-fuchsia-300">
              <Route size={16} />
              Delivery Infrastructure
            </div>

            <h2 className="mt-8 text-4xl font-black tracking-[-0.04em] md:text-6xl">
              {t.routeTitle}
            </h2>

            <p className={`mt-6 text-lg leading-8 ${muted}`}>
              AI route optimization automatically sequences deliveries,
              minimizes fuel usage, improves timing accuracy, and maximizes
              delivery efficiency.
            </p>
          </motion.div>

          <div className="mt-20">
            <GlassCard className="overflow-hidden p-8">
              <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <h3 className="text-3xl font-black">
                    Route Timeline
                  </h3>

                  <p className={`mt-4 leading-8 ${muted}`}>
                    Live route sequencing optimized using AI delivery
                    prediction and geographic intelligence.
                  </p>

                  <div className="mt-10 space-y-8">
                    {deliveryStops.map((stop, index) => (
                      <motion.div
                        key={stop.name}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        viewport={{ once: true }}
                        className="relative flex items-start gap-5"
                      >
                        {index !== deliveryStops.length - 1 && (
                          <div className="absolute left-[27px] top-14 h-16 w-px bg-gradient-to-b from-cyan-400 to-fuchsia-500" />
                        )}

                        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 shadow-[0_20px_80px_rgba(59,130,246,0.35)]">
                          <stop.icon className="text-white" />
                        </div>

                        <div>
                          <h4 className="text-xl font-bold">
                            {stop.name}
                          </h4>

                          <p className={`mt-2 text-sm ${muted}`}>
                            AI route optimization active
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <GlassCard className="h-full overflow-hidden p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-fuchsia-500/10" />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-2xl font-bold">
                            Smart Delivery Metrics
                          </h4>

                          <p className={`mt-2 text-sm ${muted}`}>
                            Real-time logistics insights
                          </p>
                        </div>

                        <div className="rounded-2xl bg-cyan-500/20 p-3 text-cyan-300">
                          <Truck />
                        </div>
                      </div>

                      <div className="mt-10 grid gap-5 md:grid-cols-2">
                        {[
                          {
                            title: "Fuel Savings",
                            value: "32%",
                          },

                          {
                            title: "On-Time Delivery",
                            value: "98%",
                          },

                          {
                            title: "Route Accuracy",
                            value: "94%",
                          },

                          {
                            title: "Delivery Speed",
                            value: "+44%",
                          },
                        ].map((metric) => (
                          <GlassCard
                            key={metric.title}
                            className="p-6"
                          >
                            <p className={`text-sm ${muted}`}>
                              {metric.title}
                            </p>

                            <h4 className="mt-3 text-4xl font-black">
                              {metric.value}
                            </h4>
                          </GlassCard>
                        ))}
                      </div>

                      <div className="mt-8">
                        <div className="mb-4 flex items-center justify-between">
                          <span>AI Optimization</span>

                          <span className="text-emerald-300">
                            92%
                          </span>
                        </div>

                        <div className="h-4 overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "92%" }}
                            transition={{ duration: 1.4 }}
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500"
                          />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-28 md:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="h-full p-8">
                <div className="flex items-center gap-4">
                  <div className="rounded-3xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 p-4">
                    <Store className="text-white" />
                  </div>

                  <div>
                    <h2 className="text-3xl font-black">
                      {t.shopkeeper}
                    </h2>

                    <p className={`mt-2 ${muted}`}>
                      Modern retailer operating system
                    </p>
                  </div>
                </div>

                <div className="mt-10 space-y-5">
                  {[
                    "AI Product Discovery",
                    "Tamil Voice Search",
                    "Price Comparison",
                    "Order Tracking",
                    "Delivery Notifications",
                    "Live Supplier Communication",
                  ].map((item) => (
                    <motion.div
                      key={item}
                      whileHover={{ x: 6 }}
                      className={`flex items-center justify-between rounded-3xl border p-5 ${surface}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-300">
                          <CircleCheckBig size={18} />
                        </div>

                        <span className="font-semibold">{item}</span>
                      </div>

                      <ChevronRight />
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="h-full p-8">
                <div className="flex items-center gap-4">
                  <div className="rounded-3xl bg-gradient-to-br from-fuchsia-400 via-indigo-500 to-cyan-500 p-4">
                    <Warehouse className="text-white" />
                  </div>

                  <div>
                    <h2 className="text-3xl font-black">
                      {t.wholesaler}
                    </h2>

                    <p className={`mt-2 ${muted}`}>
                      Enterprise distribution command center
                    </p>
                  </div>
                </div>

                <div className="mt-10 space-y-5">
                  {[
                    "Inventory Management",
                    "Bulk Order Operations",
                    "AI Route Planning",
                    "Retailer Analytics",
                    "Sales Dashboard",
                    "Delivery Workforce Coordination",
                  ].map((item) => (
                    <motion.div
                      key={item}
                      whileHover={{ x: 6 }}
                      className={`flex items-center justify-between rounded-3xl border p-5 ${surface}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-cyan-500/20 p-3 text-cyan-300">
                          <CircleCheckBig size={18} />
                        </div>

                        <span className="font-semibold">{item}</span>
                      </div>

                      <ChevronRight />
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-28 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm text-cyan-300">
              <RefreshCcw size={16} />
              Order Intelligence
            </div>

            <h2 className="mt-8 text-4xl font-black tracking-[-0.04em] md:text-6xl">
              {t.order}
            </h2>

            <p className={`mt-6 text-lg leading-8 ${muted}`}>
              Real-time order lifecycle tracking with predictive delivery
              intelligence and operational transparency.
            </p>
          </motion.div>

          <div className="mt-20">
            <GlassCard className="overflow-hidden p-8">
              <div className="grid gap-10 lg:grid-cols-6">
                {orderStages.map((stage, index) => (
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.1,
                    }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    {index !== orderStages.length - 1 && (
                      <div className="absolute left-[50%] top-10 hidden h-[2px] w-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 lg:block" />
                    )}

                    <div className="relative z-10 flex flex-col items-center text-center">
                      <motion.div
                        animate={{
                          scale: [1, 1.08, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: index * 0.2,
                        }}
                        className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 shadow-[0_20px_80px_rgba(59,130,246,0.35)]"
                      >
                        <Package className="text-white" />
                      </motion.div>

                      <h3 className="mt-6 text-lg font-bold">
                        {stage}
                      </h3>

                      <p className={`mt-2 text-sm ${muted}`}>
                        Processing
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-14">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-semibold">
                    Delivery Completion
                  </span>

                  <span className="text-emerald-300">
                    86%
                  </span>
                </div>

                <div className="h-5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "86%" }}
                    transition={{ duration: 1.6 }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500"
                  />
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-28 md:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="h-full p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black">
                      {t.calendar}
                    </h2>

                    <p className={`mt-2 ${muted}`}>
                      AI scheduling and delivery planning
                    </p>
                  </div>

                  <div className="rounded-3xl bg-cyan-500/20 p-4 text-cyan-300">
                    <Calendar />
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-7 gap-3">
                  {Array.from({ length: 35 }).map((_, index) => {
                    const active =
                      [4, 8, 14, 18, 21, 28, 31].includes(index);

                    return (
                      <motion.div
                        key={index}
                        whileHover={{
                          y: -4,
                          scale: 1.04,
                        }}
                        className={`flex aspect-square items-center justify-center rounded-2xl border text-sm font-semibold transition-all duration-500 ${
                          active
                            ? "border-cyan-400/20 bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 text-white"
                            : surface
                        }`}
                      >
                        {index + 1}
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-8 space-y-4">
                  {[
                    "Morning Delivery Route",
                    "Retailer Bulk Shipment",
                    "Warehouse Restock",
                  ].map((event) => (
                    <div
                      key={event}
                      className={`flex items-center justify-between rounded-3xl border p-5 ${surface}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-3 w-3 rounded-full bg-cyan-400" />

                        <span>{event}</span>
                      </div>

                      <Clock3 size={18} />
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="h-full p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black">
                      {t.chat}
                    </h2>

                    <p className={`mt-2 ${muted}`}>
                      Live retailer and wholesaler messaging
                    </p>
                  </div>

                  <div className="rounded-3xl bg-fuchsia-500/20 p-4 text-fuchsia-300">
                    <MessageSquare />
                  </div>
                </div>

                <div className="mt-10 space-y-5">
                  {[
                    {
                      sender: "Delta Wholesale",
                      message:
                        "Your order has been packed and ready for dispatch.",
                    },

                    {
                      sender: "Retailer",
                      message:
                        "Can we increase tomorrow's milk quantity?",
                    },

                    {
                      sender: "Delivery Team",
                      message:
                        "Traffic optimized. ETA updated to 3:20 PM.",
                    },
                  ].map((chat, index) => (
                    <motion.div
                      key={chat.sender}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      className={`rounded-[28px] border p-5 ${surface}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 font-bold text-white">
                            {chat.sender[0]}
                          </div>

                          <div>
                            <h4 className="font-bold">
                              {chat.sender}
                            </h4>

                            <p
                              className={`text-sm ${muted}`}
                            >
                              Online
                            </p>
                          </div>
                        </div>

                        <Bell size={18} />
                      </div>

                      <p className="mt-5 leading-7">
                        {chat.message}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div
                  className={`mt-8 flex items-center gap-3 rounded-[28px] border p-4 ${surface}`}
                >
                  <input
                    placeholder="Send message..."
                    className="w-full bg-transparent outline-none"
                  />

                  <button className="rounded-2xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 p-3 text-white">
                    <Send size={18} />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-28 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-5 py-3 text-sm text-yellow-300">
              <HeartHandshake size={16} />
              Customer Trust
            </div>

            <h2 className="mt-8 text-4xl font-black tracking-[-0.04em] md:text-6xl">
              {t.reviews}
            </h2>

            <p className={`mt-6 text-lg leading-8 ${muted}`}>
              Built with enterprise-grade reliability, retailer trust
              systems, supplier transparency, and secure operational
              workflows.
            </p>
          </motion.div>

          <div className="mt-20 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "4.9/5 Retailer Rating",
                desc: "Thousands of retailers trust StockLinker daily.",
                icon: Star,
              },

              {
                title: "Enterprise Security",
                desc: "Advanced authentication and secure infrastructure.",
                icon: ShieldCheck,
              },

              {
                title: "24/7 Commerce Support",
                desc: "Dedicated operational support for enterprise teams.",
                icon: Headphones,
              },
            ].map((review, index) => (
              <motion.div
                key={review.title}
                custom={index}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <GlassCard className="h-full p-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500">
                    <review.icon className="text-white" />
                  </div>

                  <h3 className="mt-8 text-2xl font-bold">
                    {review.title}
                  </h3>

                  <p className={`mt-5 leading-8 ${muted}`}>
                    {review.desc}
                  </p>

                  <div className="mt-8 flex items-center gap-1 text-yellow-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={18}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl overflow-hidden px-4 py-28 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-5 py-3 text-sm text-indigo-300">
              <Users size={16} />
              Testimonials
            </div>

            <h2 className="mt-8 text-4xl font-black tracking-[-0.04em] md:text-6xl">
              Loved By Modern Commerce Teams
            </h2>

            <p className={`mt-6 text-lg leading-8 ${muted}`}>
              Retailers, wholesalers, and logistics teams use StockLinker
              to modernize operations and accelerate growth.
            </p>
          </motion.div>

          <div className="relative mt-20">
            <motion.div
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex gap-6"
            >
              {[...testimonials, ...testimonials].map(
                (testimonial, index) => (
                  <GlassCard
                    key={`${testimonial.name}-${index}`}
                    className="min-w-[380px] p-8"
                  >
                    <div className="flex items-center gap-1 text-yellow-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={18}
                          fill="currentColor"
                        />
                      ))}
                    </div>

                    <p className="mt-8 text-lg leading-8">
                      “{testimonial.review}”
                    </p>

                    <div className="mt-10 flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 font-black text-white">
                        {testimonial.name[0]}
                      </div>

                      <div>
                        <h4 className="font-bold">
                          {testimonial.name}
                        </h4>

                        <p className={`text-sm ${muted}`}>
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                )
              )}
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-28 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm text-emerald-300">
              <CircleDollarSign size={16} />
              Pricing
            </div>

            <h2 className="mt-8 text-4xl font-black tracking-[-0.04em] md:text-6xl">
              {t.pricing}
            </h2>

            <p className={`mt-6 text-lg leading-8 ${muted}`}>
              Flexible pricing designed for retailers, wholesalers, and
              enterprise distribution operations.
            </p>
          </motion.div>

          <div className="mt-20 grid gap-6 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                custom={index}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 z-20 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-2 text-sm font-semibold text-white shadow-2xl">
                    Most Popular
                  </div>
                )}

                <GlassCard
                  className={`h-full p-8 ${
                    plan.popular
                      ? "border-cyan-400/30"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-3xl font-black">
                        {plan.name}
                      </h3>

                      <p className={`mt-3 ${muted}`}>
                        {plan.desc}
                      </p>
                    </div>

                    <div className="rounded-3xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 p-4">
                      <Wallet className="text-white" />
                    </div>
                  </div>

                  <div className="mt-10 flex items-end gap-2">
                    <span className="text-6xl font-black">
                      {plan.price}
                    </span>

                    {plan.price !== "Custom" && (
                      <span className={`pb-2 ${muted}`}>
                        /month
                      </span>
                    )}
                  </div>

                  <div className="mt-10 space-y-5">
                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-4"
                      >
                        <div className="rounded-2xl bg-emerald-500/20 p-2 text-emerald-300">
                          <Check size={16} />
                        </div>

                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <MagneticButton
                    primary={plan.popular}
                    className="mt-10 w-full justify-center"
                  >
                    Get Started
                    <ArrowRight size={16} />
                  </MagneticButton>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-28 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm text-cyan-300">
              <PanelRightOpen size={16} />
              FAQ
            </div>

            <h2 className="mt-8 text-4xl font-black tracking-[-0.04em] md:text-6xl">
              {t.faq}
            </h2>

            <p className={`mt-6 text-lg leading-8 ${muted}`}>
              Everything you need to know about StockLinker.
            </p>
          </motion.div>

          <div className="mt-20 space-y-5">
            {faqData.map((faq, index) => {
              const open = faqOpen === index;

              return (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <GlassCard className="overflow-hidden">
                    <button
                      onClick={() =>
                        setFaqOpen(open ? -1 : index)
                      }
                      className="flex w-full items-center justify-between p-8 text-left"
                    >
                      <div>
                        <h3 className="text-xl font-bold">
                          {faq.q}
                        </h3>
                      </div>

                      <motion.div
                        animate={{
                          rotate: open ? 180 : 0,
                        }}
                      >
                        <ChevronDown />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {open && (
                        <motion.div
                          initial={{
                            height: 0,
                            opacity: 0,
                          }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                          }}
                          className="overflow-hidden"
                        >
                          <div className="px-8 pb-8">
                            <p
                              className={`leading-8 ${muted}`}
                            >
                              {faq.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-32 md:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <GlassCard className="relative overflow-hidden p-10 md:p-16">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-indigo-500/10 to-fuchsia-500/20" />

              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 24,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10"
              />

              <motion.div
                animate={{
                  rotate: [360, 0],
                }}
                transition={{
                  duration: 26,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full border border-white/10"
              />

              <div className="relative z-10 mx-auto max-w-4xl text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm">
                  <Zap size={16} />
                  Future of Wholesale Commerce
                </div>

                <h2 className="mt-10 text-5xl font-black leading-[1] tracking-[-0.05em] md:text-7xl">
                  {t.final}
                </h2>

                <p className={`mx-auto mt-8 max-w-3xl text-lg leading-8 ${muted}`}>
                  Modernize your wholesale operations with AI-powered
                  commerce infrastructure built for the next generation of
                  retailers, distributors, and enterprise supply chains.
                </p>

                <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <MagneticButton primary className="justify-center">
                    Start Building
                    <ArrowRight size={18} />
                  </MagneticButton>

                  <MagneticButton className="justify-center">
                    Book Enterprise Demo
                  </MagneticButton>
                </div>

                <div className="mt-14 flex flex-wrap items-center justify-center gap-8">
                  {[
                    "AI Powered",
                    "Tamil Ready",
                    "Enterprise Secure",
                    "Realtime Analytics",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3"
                    >
                      <div className="h-3 w-3 rounded-full bg-emerald-400" />

                      <span className={`text-sm ${muted}`}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        <footer className="relative overflow-hidden border-t border-white/10">
          <div className="mx-auto grid max-w-7xl gap-14 px-4 py-20 md:px-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 shadow-[0_20px_80px_rgba(59,130,246,0.35)]">
                  <Boxes className="text-white" />
                </div>

                <div>
                  <h3 className="text-3xl font-black">
                    StockLinker
                  </h3>

                  <p className={`mt-2 text-sm ${muted}`}>
                    Enterprise Commerce Infrastructure
                  </p>
                </div>
              </div>

              <p className={`mt-8 max-w-md leading-8 ${muted}`}>
                {t.footer}
              </p>

              <div className="mt-10 flex gap-4">
                {[
                  Globe2,
                  MessageSquare,
                  PhoneCall,
                  Bell,
                ].map((Icon, index) => (
                  <motion.button
                    key={index}
                    whileHover={{
                      y: -4,
                      scale: 1.06,
                    }}
                    className={`rounded-3xl border p-4 ${surface}`}
                  >
                    <Icon size={18} />
                  </motion.button>
                ))}
              </div>
            </div>

            {[
              {
                title: "Product",
                items: [
                  "AI Search",
                  "Price Comparison",
                  "Delivery Routing",
                  "Analytics",
                ],
              },

              {
                title: "Solutions",
                items: [
                  "Retailers",
                  "Wholesalers",
                  "Distribution",
                  "Enterprise",
                ],
              },

              {
                title: "Resources",
                items: [
                  "Documentation",
                  "API",
                  "Support",
                  "Contact",
                ],
              },
            ].map((column) => (
              <div key={column.title}>
                <h4 className="text-lg font-bold">
                  {column.title}
                </h4>

                <div className="mt-8 space-y-5">
                  {column.items.map((item) => (
                    <motion.button
                      key={item}
                      whileHover={{
                        x: 4,
                      }}
                      className={`block text-left transition-colors duration-300 hover:text-white ${muted}`}
                    >
                      {item}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-8 text-sm md:flex-row md:px-8">
              <p className={muted}>
                © 2026 StockLinker. All rights reserved.
              </p>

              <div className="flex flex-wrap items-center gap-6">
                {[
                  "Privacy Policy",
                  "Terms",
                  "Security",
                  "Compliance",
                ].map((item) => (
                  <button
                    key={item}
                    className={`transition-colors duration-300 hover:text-white ${muted}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}