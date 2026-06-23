"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import {
  ArrowRight,
  Moon,
  Sun,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Store,
  Truck,
  Warehouse,
  Bell,
  Search,
  Mic,
  Globe,
  Package,
  CheckCircle2,
  Clock3,
  Boxes,
  MapPinned,
  ChartBar,
  TrendingUp,
  Users,
  ScanSearch,
  Layers3,
  MessageSquareText,
  PhoneCall,
  Star,
  ChevronDown,
  Zap,
  BadgeCheck,
  CalendarRange,
  CreditCard,
  Route,
  CircleDollarSign,
  ShoppingCart,
  Building2,
  LayoutDashboard,
  Filter,
  SlidersHorizontal,
  Play,
  Wifi,
  TimerReset,
  Shield,
  Bot,
  Languages,
  ReceiptText,
  Inbox,
  BrainCircuit,
  Send,
  Cpu,
  Database,
  Activity,
  PackageCheck,
  Eye,
  Gauge,
  Rocket,
  BarChart3,
  PieChart,
  ArrowUpRight,
  Circle,
  Map,
  ClipboardCheck,
  LocateFixed,
  Layers,
  FileText,
  Lock,
  Mail,
  Menu,
  X,
  Flame,
  Gem,
} from "lucide-react";

import { FaFacebook,FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const translations = {
  en: {
    banner: "Now powering 12,000+ wholesale supply relationships across Tamil Nadu",
    getStarted: "Get Started",
    login: "Login",
    product: "Product",
    solutions: "Solutions",
    pricing: "Pricing",
    resources: "Resources",
    heroBadge: "AI Powered Wholesale Commerce Platform",
    heroTitle1: "The Intelligent",
    heroTitle2: "Wholesale Network",
    heroTitle3: "For Modern Retail",
    heroDesc:
      "StockLinker connects wholesalers and shopkeepers with intelligent product discovery, real-time pricing, route optimization, delivery tracking, multilingual communication, and enterprise-grade supply chain workflows.",
    heroBtn1: "Start Free",
    heroBtn2: "Watch Demo",
    trusted: "Trusted by modern retailers & distributors",
    featureTitle: "Enterprise-grade infrastructure for local commerce",
    featureDesc:
      "Designed for India's fast-moving wholesale ecosystem with automation, intelligence, and operational visibility.",
    pricingTitle: "Simple pricing for every scale",
    faqTitle: "Frequently asked questions",
    finalTitle: "Transform your wholesale operations today",
    footerText:
      "Built for India's next-generation wholesale ecosystem.",
  },
  ta: {
    banner:
      "தமிழ்நாடு முழுவதும் 12,000+ மொத்த வணிக இணைப்புகளை இயக்குகிறது",
    getStarted: "தொடங்கவும்",
    login: "உள்நுழை",
    product: "தயாரிப்பு",
    solutions: "தீர்வுகள்",
    pricing: "விலை",
    resources: "வளங்கள்",
    heroBadge: "AI இயங்கும் மொத்த வர்த்தக தளம்",
    heroTitle1: "நவீன சில்லறைக்கு",
    heroTitle2: "அறிவார்ந்த மொத்த",
    heroTitle3: "விநியோக வலை",
    heroDesc:
      "StockLinker மொத்த விற்பனையாளர்கள் மற்றும் கடைக்காரர்களை புத்திசாலித்தனமான தயாரிப்பு தேடல், நேரடி விலை ஒப்பீடு, விநியோக வழி மேலாண்மை, ஆர்டர் கண்காணிப்பு மற்றும் பலமொழி தொடர்புகளால் இணைக்கிறது.",
    heroBtn1: "இலவசமாக தொடங்கு",
    heroBtn2: "டெமோ பாருங்கள்",
    trusted: "நவீன வணிகர்களின் நம்பிக்கை",
    featureTitle:
      "உள்ளூர் வணிகத்திற்கான நிறுவன தர அடித்தளம்",
    featureDesc:
      "இந்தியாவின் வேகமான மொத்த வணிக சூழலுக்காக வடிவமைக்கப்பட்டது.",
    pricingTitle: "ஒவ்வொரு அளவிற்கும் எளிய விலை",
    faqTitle: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    finalTitle: "உங்கள் மொத்த வணிகத்தை மாற்றுங்கள்",
    footerText:
      "இந்தியாவின் அடுத்த தலைமுறை மொத்த வணிகத்திற்காக உருவாக்கப்பட்டது.",
  },
};

const navItems = [
  "Product",
  "Solutions",
  "Pricing",
  "Resources",
];

const companyNames = [
  "FreshMart",
  "RetailOne",
  "TamilTrade",
  "MegaWholesale",
  "HyperStore",
  "UrbanCart",
  "BlueSupply",
  "FastChain",
];

const metrics = [
  {
    title: "Orders Processed",
    value: "2.4M+",
    icon: PackageCheck,
  },
  {
    title: "Delivery Accuracy",
    value: "98.9%",
    icon: Route,
  },
  {
    title: "Retailers Connected",
    value: "12K+",
    icon: Store,
  },
  {
    title: "Monthly GMV",
    value: "₹82Cr",
    icon: CircleDollarSign,
  },
];

const features = [
  {
    icon: BrainCircuit,
    title: "AI Product Discovery",
    desc:
      "Smart search understands Tamil and English product terms with intelligent suggestions.",
  },
  {
    icon: Route,
    title: "Route Optimization",
    desc:
      "Automatically plan the most efficient delivery routes across cities and towns.",
  },
  {
    icon: Package,
    title: "Inventory Visibility",
    desc:
      "Live stock sync for wholesalers and retailers with intelligent low-stock alerts.",
  },
  {
    icon: ChartBar,
    title: "Analytics Dashboard",
    desc:
      "Revenue forecasting, purchase trends, margins, and operational intelligence.",
  },
  {
    icon: MessageSquareText,
    title: "Integrated Communication",
    desc:
      "Chat, voice notes, announcements, and multilingual support inside workflows.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    desc:
      "Role-based access, audit trails, and secure business operations.",
  },
];

const testimonials = [
  {
    name: "Karthik Raj",
    role: "Wholesale Distributor",
    company: "KRS Traders",
    text:
      "StockLinker transformed our distribution workflow. We reduced missed deliveries by 72% and improved retailer retention significantly.",
  },
  {
    name: "Praveen Kumar",
    role: "Retail Shop Owner",
    company: "Fresh Corner",
    text:
      "The Tamil search and real-time price comparison save hours every day. Ordering is now effortless.",
  },
  {
    name: "Meena Lakshmi",
    role: "Operations Head",
    company: "South Supply Chain",
    text:
      "The route optimization and analytics tools feel enterprise-grade. The experience is world-class.",
  },
];

const pricing = [
  {
    name: "Starter",
    price: "₹0",
    desc: "For growing shops",
    features: [
      "50 monthly orders",
      "Basic analytics",
      "Tamil search",
      "Delivery tracking",
    ],
  },
  {
    name: "Growth",
    price: "₹4,999",
    desc: "For distributors",
    features: [
      "Unlimited orders",
      "AI insights",
      "Route optimization",
      "Realtime sync",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For large networks",
    features: [
      "Dedicated onboarding",
      "Advanced automation",
      "Custom integrations",
      "Enterprise security",
      "Multi-location management",
    ],
  },
];

const faqs = [
  {
    q: "Does StockLinker support Tamil language search?",
    a:
      "Yes. The platform supports multilingual product discovery including Tamil and English search queries.",
  },
  {
    q: "Can wholesalers manage multiple delivery routes?",
    a:
      "Absolutely. Route optimization supports multiple warehouses, vehicles, and stop prioritization.",
  },
  {
    q: "Is there realtime inventory synchronization?",
    a:
      "Yes. Inventory updates happen instantly between wholesalers and retailers.",
  },
  {
    q: "Can shopkeepers compare prices from multiple suppliers?",
    a:
      "Yes. StockLinker includes a realtime wholesale price comparison engine.",
  },
];

const orderSteps = [
  "Order Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered",
];

const MagneticButton = ({
  children,
  className = "",
  primary = false,
}) => {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct * 16);
    y.set(yPct * 16);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      style={{
        x: springX,
        y: springY,
      }}
      whileTap={{ scale: 0.96 }}
      className={`relative overflow-hidden rounded-2xl px-6 py-4 text-sm font-semibold transition-all duration-500 ${className} ${
        primary
          ? "bg-white text-black shadow-2xl shadow-white/20"
          : "border border-white/15 bg-white/5 text-white backdrop-blur-xl"
      }`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/0 to-white/10"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

const SectionHeading = ({ eyebrow, title, desc, dark }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="mx-auto mb-16 max-w-4xl text-center"
  >
    <div
      className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] ${
        dark
          ? "border-white/10 bg-white/5 text-white/70"
          : "border-black/10 bg-black/5 text-black/60"
      }`}
    >
      <Sparkles className="h-3.5 w-3.5" />
      {eyebrow}
    </div>

    <h2
      className={`mx-auto max-w-5xl text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-5xl lg:text-6xl ${
        dark ? "text-white" : "text-zinc-950"
      }`}
    >
      {title}
    </h2>

    <p
      className={`mx-auto mt-6 max-w-3xl text-base leading-8 sm:text-lg ${
        dark ? "text-white/60" : "text-zinc-600"
      }`}
    >
      {desc}
    </p>
  </motion.div>
);

const FloatingOrb = ({ className }) => (
  <motion.div
    animate={{
      y: [0, -40, 0],
      x: [0, 20, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className={`absolute rounded-full blur-3xl ${className}`}
  />
);

export default function StockLinkerLanding() {
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(0);

  const t = translations[language];

  useEffect(() => {
    const storedTheme = localStorage.getItem("stocklinker-theme");
    const storedLang = localStorage.getItem("stocklinker-lang");

    if (storedTheme) {
      setTheme(storedTheme);
    }

    if (storedLang) {
      setLanguage(storedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("stocklinker-theme", theme);
    localStorage.setItem("stocklinker-lang", language);
  }, [theme, language]);

  const dark = theme === "dark";

  const sectionClass = dark
    ? "bg-[#06070A] text-white"
    : "bg-[#F8FAFC] text-zinc-950";

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-colors duration-700 ${sectionClass}`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <FloatingOrb className="left-[-8rem] top-[-10rem] h-[30rem] w-[30rem] bg-cyan-500/20" />
        <FloatingOrb className="right-[-8rem] top-[10rem] h-[25rem] w-[25rem] bg-fuchsia-500/20" />
        <FloatingOrb className="bottom-[-10rem] left-[25%] h-[35rem] w-[35rem] bg-blue-500/10" />

        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, white 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_30%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.35))]" />
      </div>

      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className={`relative z-50 border-b px-4 py-3 sm:px-8 ${
          dark
            ? "border-white/10 bg-white/[0.03]"
            : "border-black/10 bg-white/50"
        } backdrop-blur-2xl`}
      >
        {/* <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 text-center text-xs font-semibold tracking-[0.15em] sm:text-sm">
          <Flame className="h-4 w-4 text-orange-400" />
          <span className={dark ? "text-white/80" : "text-zinc-700"}>
            {t.banner}
          </span>
        </div> */}
      </motion.div>

      <motion.nav
        initial={{ y: -40, opacity: 0, filter: "blur(8px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="sticky top-0 z-50 px-4 py-5 sm:px-8"
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-[28px] border px-5 py-4 shadow-2xl backdrop-blur-2xl lg:px-8 ${
            dark
              ? "border-white/10 bg-black/30 shadow-black/20"
              : "border-black/10 bg-white/70 shadow-black/5"
          }`}
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 blur-md"
              />

              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                <Layers3 className="h-6 w-6" />
              </div>
            </div>

            <div>
              <h1 className="text-lg font-black tracking-tight">
                StockLinker
              </h1>
              <p
                className={`text-xs ${
                  dark ? "text-white/50" : "text-zinc-500"
                }`}
              >
                Intelligent Wholesale Network
              </p>
            </div>
          </motion.div>

          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item, index) => (
              <motion.a
                key={item}
                href="#"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.08,
                }}
                whileHover={{ y: -2 }}
                className={`text-sm font-medium transition-colors ${
                  dark
                    ? "text-white/70 hover:text-white"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                {t[item.toLowerCase()]}
              </motion.a>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <motion.button
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6 }}
              onClick={() =>
                setTheme(dark ? "light" : "dark")
              }
              className={`rounded-2xl border p-3 ${
                dark
                  ? "border-white/10 bg-white/5"
                  : "border-black/10 bg-black/[0.03]"
              }`}
            >
              {dark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() =>
                setLanguage(language === "en" ? "ta" : "en")
              }
              className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                dark
                  ? "border-white/10 bg-white/5"
                  : "border-black/10 bg-black/[0.03]"
              }`}
            >
              <Languages className="h-4 w-4" />
              {language === "en" ? "தமிழ்" : "English"}
            </motion.button>

            <button
              className={`px-4 py-3 text-sm font-semibold ${
                dark ? "text-white/70" : "text-zinc-700"
              }`}
            >
              {t.login}
            </button>

            <MagneticButton primary>
              {t.getStarted}
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`rounded-2xl border p-3 lg:hidden ${
              dark
                ? "border-white/10 bg-white/5"
                : "border-black/10 bg-white"
            }`}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: -20,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -20,
                scale: 0.96,
              }}
              className={`mx-auto mt-4 max-w-7xl rounded-[28px] border p-6 backdrop-blur-2xl lg:hidden ${
                dark
                  ? "border-white/10 bg-black/40"
                  : "border-black/10 bg-white/80"
              }`}
            >
              <div className="flex flex-col gap-5">
                {navItems.map((item) => (
                  <button
                    key={item}
                    className="flex items-center justify-between text-left text-lg font-semibold"
                  >
                    {item}
                    <ChevronRight className="h-5 w-5" />
                  </button>
                ))}

                <div className="mt-4 flex gap-3">
                  <MagneticButton className="w-full">
                    {t.login}
                  </MagneticButton>

                  <MagneticButton primary className="w-full">
                    {t.getStarted}
                  </MagneticButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <section className="relative px-4 pb-24 pt-10 sm:px-8 lg:pb-32 lg:pt-16">
        <div className="mx-auto grid max-w-7xl items-center gap-20 lg:grid-cols-2">
          <motion.div
            initial={{
              opacity: 0,
              y: 80,
              filter: "blur(18px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 1,
            }}
            className="relative z-10"
          >
            <div
              className={`mb-8 inline-flex items-center gap-3 rounded-full border px-5 py-3 text-sm font-semibold ${
                dark
                  ? "border-white/10 bg-white/[0.04] text-white/80"
                  : "border-black/10 bg-white text-zinc-700"
              }`}
            >
              <Sparkles className="h-4 w-4 text-cyan-400" />
              {t.heroBadge}
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-6xl lg:text-8xl">
              <span
                className={dark ? "text-white" : "text-zinc-950"}
              >
                {t.heroTitle1}
              </span>

              <br />

              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">
                {t.heroTitle2}
              </span>

              <br />

              <span
                className={dark ? "text-white" : "text-zinc-950"}
              >
                {t.heroTitle3}
              </span>
            </h1>

            <p
              className={`mt-8 max-w-2xl text-lg leading-9 sm:text-xl ${
                dark ? "text-white/60" : "text-zinc-600"
              }`}
            >
              {t.heroDesc}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <MagneticButton primary>
                {t.heroBtn1}
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>

              <MagneticButton>
                <Play className="h-4 w-4" />
                {t.heroBtn2}
              </MagneticButton>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6">
              {[
                "Realtime Inventory",
                "Tamil AI Search",
                "Route Intelligence",
              ].map((item) => (
                <motion.div
                  whileHover={{ y: -4 }}
                  key={item}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                    dark
                      ? "border-white/10 bg-white/[0.03]"
                      : "border-black/10 bg-white"
                  }`}
                >
                  <BadgeCheck className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-medium">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              rotate: -3,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            transition={{
              duration: 1.2,
            }}
            className="relative"
          >
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
              }}
              className={`relative overflow-hidden rounded-[40px] border shadow-2xl backdrop-blur-2xl ${
                dark
                  ? "border-white/10 bg-white/[0.04]"
                  : "border-black/10 bg-white"
              }`}
            >
              <div
                className={`flex items-center justify-between border-b px-6 py-5 ${
                  dark
                    ? "border-white/10"
                    : "border-black/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>

                  <div
                    className={`rounded-full px-4 py-2 text-xs font-semibold ${
                      dark
                        ? "bg-white/5 text-white/60"
                        : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    stocklinker.ai/dashboard
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-cyan-400" />
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                </div>
              </div>

              <div className="grid gap-6 p-6">
                <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                  <motion.div
                    whileHover={{ y: -8 }}
                    className={`rounded-[32px] border p-6 ${
                      dark
                        ? "border-white/10 bg-black/20"
                        : "border-black/10 bg-zinc-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`text-sm ${
                            dark
                              ? "text-white/50"
                              : "text-zinc-500"
                          }`}
                        >
                          Revenue Growth
                        </p>

                        <h3 className="mt-2 text-4xl font-black">
                          +248%
                        </h3>
                      </div>

                      <div className="rounded-2xl bg-emerald-500/10 p-4">
                        <TrendingUp className="h-7 w-7 text-emerald-400" />
                      </div>
                    </div>

                    <div className="mt-8 flex h-40 items-end gap-3">
                      {[40, 80, 55, 100, 130, 95, 150].map(
                        (h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: h }}
                            transition={{
                              delay: i * 0.08,
                              duration: 1,
                            }}
                            className="flex-1 rounded-t-3xl bg-gradient-to-t from-cyan-500 to-blue-400"
                          />
                        )
                      )}
                    </div>
                  </motion.div>

                  <div className="grid gap-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`rounded-[32px] border p-6 ${
                        dark
                          ? "border-white/10 bg-black/20"
                          : "border-black/10 bg-zinc-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className={`text-sm ${
                              dark
                                ? "text-white/50"
                                : "text-zinc-500"
                            }`}
                          >
                            Active Deliveries
                          </p>

                          <h4 className="mt-2 text-3xl font-black">
                            1,284
                          </h4>
                        </div>

                        <Truck className="h-10 w-10 text-cyan-400" />
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex justify-between text-xs">
                          <span>Route efficiency</span>
                          <span>92%</span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "92%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5 }}
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                          />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`rounded-[32px] border p-6 ${
                        dark
                          ? "border-white/10 bg-black/20"
                          : "border-black/10 bg-zinc-50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-fuchsia-500/10 p-4">
                          <Bot className="h-8 w-8 text-fuchsia-400" />
                        </div>

                        <div>
                          <h4 className="text-lg font-bold">
                            AI Assistant
                          </h4>
                          <p
                            className={`text-sm ${
                              dark
                                ? "text-white/50"
                                : "text-zinc-500"
                            }`}
                          >
                            Predicting low stock items
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        {[
                          "Cooking Oil",
                          "Basmati Rice",
                          "Soft Drinks",
                        ].map((item) => (
                          <div
                            key={item}
                            className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
                              dark
                                ? "bg-white/5"
                                : "bg-white"
                            }`}
                          >
                            <span className="text-sm font-medium">
                              {item}
                            </span>

                            <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
                              Low
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  {metrics.map((metric, index) => {
                    const Icon = metric.icon;

                    return (
                      <motion.div
                        key={metric.title}
                        initial={{
                          opacity: 0,
                          y: 40,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: index * 0.1,
                        }}
                        whileHover={{
                          y: -6,
                        }}
                        className={`rounded-[28px] border p-5 ${
                          dark
                            ? "border-white/10 bg-white/[0.03]"
                            : "border-black/10 bg-zinc-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p
                              className={`text-sm ${
                                dark
                                  ? "text-white/50"
                                  : "text-zinc-500"
                              }`}
                            >
                              {metric.title}
                            </p>

                            <h4 className="mt-3 text-3xl font-black">
                              {metric.value}
                            </h4>
                          </div>

                          <div className="rounded-2xl bg-cyan-500/10 p-4">
                            <Icon className="h-6 w-6 text-cyan-400" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, -14, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="absolute -left-10 top-20 hidden w-56 rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl xl:block"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-emerald-500/10 p-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </div>

                <div>
                  <p className="text-sm text-white/60">
                    Delivery Success
                  </p>
                  <h4 className="text-3xl font-black">
                    98.9%
                  </h4>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
              }}
              className="absolute -bottom-10 -right-10 hidden w-64 rounded-[32px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl xl:block"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">
                    Live Orders
                  </p>

                  <h4 className="mt-2 text-4xl font-black">
                    8,291
                  </h4>
                </div>

                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 0, 0.4],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="absolute inset-0 rounded-full bg-emerald-400"
                  />

                  <div className="relative h-5 w-5 rounded-full bg-emerald-400" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div
            className={`mb-10 text-center text-sm font-semibold uppercase tracking-[0.3em] ${
              dark ? "text-white/40" : "text-zinc-500"
            }`}
          >
            {t.trusted}
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
            {companyNames.map((company, index) => (
              <motion.div
                key={company}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.05,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  scale: 1.03,
                }}
                className={`flex items-center justify-center rounded-[26px] border px-6 py-5 text-center text-sm font-bold backdrop-blur-xl ${
                  dark
                    ? "border-white/10 bg-white/[0.03] text-white/70"
                    : "border-black/10 bg-white text-zinc-700"
                }`}
              >
                {company}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Statistics"
            title="Scale wholesale operations with realtime intelligence"
            desc="Operational visibility across inventory, logistics, retailer engagement, procurement, and revenue performance."
            dark={dark}
          />

          <div className="grid gap-6 lg:grid-cols-4">
            {[
              {
                title: "Monthly Transactions",
                value: "₹82Cr+",
                growth: "+18%",
                icon: CircleDollarSign,
              },
              {
                title: "Connected Retailers",
                value: "12,450",
                growth: "+9%",
                icon: Users,
              },
              {
                title: "Warehouse Efficiency",
                value: "96%",
                growth: "+21%",
                icon: Warehouse,
              },
              {
                title: "Delivery Accuracy",
                value: "98.9%",
                growth: "+13%",
                icon: Route,
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{
                    opacity: 0,
                    y: 40,
                    filter: "blur(10px)",
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.1,
                  }}
                  whileHover={{
                    y: -10,
                  }}
                  className={`relative overflow-hidden rounded-[34px] border p-7 backdrop-blur-2xl ${
                    dark
                      ? "border-white/10 bg-white/[0.03]"
                      : "border-black/10 bg-white"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="rounded-2xl bg-cyan-500/10 p-4">
                        <Icon className="h-7 w-7 text-cyan-400" />
                      </div>

                      <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                        {item.growth}
                      </div>
                    </div>

                    <h3 className="mt-8 text-5xl font-black tracking-tight">
                      {item.value}
                    </h3>

                    <p
                      className={`mt-4 text-base ${
                        dark
                          ? "text-white/60"
                          : "text-zinc-600"
                      }`}
                    >
                      {item.title}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Features"
            title={t.featureTitle}
            desc={t.featureDesc}
            dark={dark}
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{
                    opacity: 0,
                    y: 50,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -10,
                    rotateX: 2,
                    rotateY: -2,
                  }}
                  className={`group relative overflow-hidden rounded-[36px] border p-8 backdrop-blur-2xl ${
                    dark
                      ? "border-white/10 bg-white/[0.03]"
                      : "border-black/10 bg-white"
                  }`}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle at top right, rgba(0,255,255,0.15), transparent 40%)",
                    }}
                  />

                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
                      <Icon className="h-8 w-8 text-cyan-400" />
                    </div>

                    <h3 className="mt-8 text-2xl font-black tracking-tight">
                      {feature.title}
                    </h3>

                    <p
                      className={`mt-5 text-base leading-8 ${
                        dark
                          ? "text-white/60"
                          : "text-zinc-600"
                      }`}
                    >
                      {feature.desc}
                    </p>

                    <motion.div
                      whileHover={{ x: 6 }}
                      className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400"
                    >
                      Explore feature
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Smart Product Search"
              title="Search products naturally in Tamil & English"
              desc="Intelligent autocomplete understands retailer behavior, regional naming, voice input, and inventory patterns."
              dark={dark}
            />

            <div className="space-y-5">
              {[
                "AI understands colloquial Tamil product names",
                "Realtime suggestions from wholesalers",
                "Voice search with multilingual support",
                "Smart category prediction",
              ].map((item) => (
                <motion.div
                  whileHover={{ x: 6 }}
                  key={item}
                  className={`flex items-center gap-4 rounded-[24px] border p-5 ${
                    dark
                      ? "border-white/10 bg-white/[0.03]"
                      : "border-black/10 bg-white"
                  }`}
                >
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  <span className="font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`overflow-hidden rounded-[40px] border p-6 backdrop-blur-2xl ${
              dark
                ? "border-white/10 bg-white/[0.03]"
                : "border-black/10 bg-white"
            }`}
          >
            <div
              className={`flex items-center gap-4 rounded-[28px] border px-5 py-5 ${
                dark
                  ? "border-white/10 bg-black/20"
                  : "border-black/10 bg-zinc-50"
              }`}
            >
              <Search className="h-6 w-6 text-cyan-400" />

              <div className="flex-1">
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className={`text-lg ${
                    dark
                      ? "text-white/80"
                      : "text-zinc-800"
                  }`}
                >
                  தேங்காய் எண்ணெய் 1 லிட்டர்...
                </motion.div>
              </div>

              <button className="rounded-2xl bg-cyan-500/10 p-3">
                <Mic className="h-5 w-5 text-cyan-400" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {[
                {
                  name: "Coconut Oil 1L",
                  supplier: "AR Traders",
                  stock: "Available",
                },
                {
                  name: "தேங்காய் எண்ணெய்",
                  supplier: "South Wholesale",
                  stock: "Limited",
                },
                {
                  name: "Premium Coconut Oil",
                  supplier: "Fresh Supply",
                  stock: "Available",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -4 }}
                  className={`flex items-center justify-between rounded-[24px] border p-5 ${
                    dark
                      ? "border-white/10 bg-black/20"
                      : "border-black/10 bg-zinc-50"
                  }`}
                >
                  <div>
                    <h4 className="font-bold">{item.name}</h4>
                    <p
                      className={`mt-1 text-sm ${
                        dark
                          ? "text-white/50"
                          : "text-zinc-500"
                      }`}
                    >
                      {item.supplier}
                    </p>
                  </div>

                  <div
                    className={`rounded-full px-4 py-2 text-xs font-bold ${
                      item.stock === "Available"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {item.stock}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Price Intelligence"
            title="Compare wholesale prices instantly"
            desc="Realtime supplier comparison with margin visibility and smart savings recommendations."
            dark={dark}
          />

          <motion.div
            whileHover={{ y: -8 }}
            className={`overflow-hidden rounded-[40px] border backdrop-blur-2xl ${
              dark
                ? "border-white/10 bg-white/[0.03]"
                : "border-black/10 bg-white"
            }`}
          >
            <div
              className={`grid grid-cols-4 border-b px-8 py-6 text-sm font-bold ${
                dark
                  ? "border-white/10 bg-white/[0.03]"
                  : "border-black/10 bg-zinc-50"
              }`}
            >
              <div>Supplier</div>
              <div>Product</div>
              <div>Price</div>
              <div>Savings</div>
            </div>

            {[
              ["AR Traders", "Sunflower Oil 1L", "₹142", "Save ₹18"],
              ["Mega Wholesale", "Sunflower Oil 1L", "₹149", "Save ₹11"],
              ["South Supply", "Sunflower Oil 1L", "₹160", "Best Delivery"],
              ["Retail Hub", "Sunflower Oil 1L", "₹152", "Fastest"],
            ].map((row, index) => (
              <motion.div
                key={index}
                whileHover={{
                  backgroundColor: dark
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.02)",
                }}
                className={`grid grid-cols-4 px-8 py-6 text-sm ${
                  dark
                    ? "border-white/5"
                    : "border-black/5"
                } border-b`}
              >
                <div className="font-semibold">{row[0]}</div>
                <div>{row[1]}</div>
                <div className="font-bold">{row[2]}</div>
                <div className="text-emerald-400">{row[3]}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Delivery Routes"
            title="AI optimized route management"
            desc="Smart route sequencing reduces fuel cost, delivery delays, and operational inefficiencies."
            dark={dark}
          />

          <div
            className={`rounded-[40px] border p-10 backdrop-blur-2xl ${
              dark
                ? "border-white/10 bg-white/[0.03]"
                : "border-black/10 bg-white"
            }`}
          >
            <div className="grid gap-10 lg:grid-cols-[0.4fr_0.6fr]">
              <div>
                <div className="space-y-8">
                  {[
                    "Warehouse",
                    "Pattukkottai",
                    "Customer A",
                    "Customer B",
                    "Thanjavur",
                    "Remaining Stops",
                  ].map((step, index) => (
                    <div
                      key={step}
                      className="relative flex items-center gap-5"
                    >
                      <div className="relative">
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.2,
                          }}
                          className="absolute inset-0 rounded-full bg-cyan-400/30 blur-md"
                        />

                        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 font-black text-black">
                          {index + 1}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-black">
                          {step}
                        </h4>

                        <p
                          className={`mt-1 text-sm ${
                            dark
                              ? "text-white/50"
                              : "text-zinc-500"
                          }`}
                        >
                          Optimized delivery checkpoint
                        </p>
                      </div>

                      {index !== 5 && (
                        <div className="absolute left-7 top-16 h-16 w-[2px] bg-gradient-to-b from-cyan-400 to-transparent" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`relative overflow-hidden rounded-[36px] border p-6 ${
                  dark
                    ? "border-white/10 bg-black/20"
                    : "border-black/10 bg-zinc-50"
                }`}
              >
                <div className="absolute inset-0 opacity-20">
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
                      backgroundSize: "30px 30px",
                    }}
                  />
                </div>

                <div className="relative h-full min-h-[420px]">
                  <motion.div
                    animate={{
                      pathLength: [0, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                    className="absolute left-10 top-16 h-[300px] w-[70%] rounded-[40px] border-2 border-dashed border-cyan-400/50"
                  />

                  {[
                    ["Warehouse", "left-6 top-10"],
                    ["Pattukkottai", "right-16 top-20"],
                    ["Customer A", "left-24 top-48"],
                    ["Customer B", "right-24 top-72"],
                    ["Thanjavur", "left-52 bottom-10"],
                  ].map(([label, pos]) => (
                    <motion.div
                      key={label}
                      animate={{
                        y: [0, -8, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                      }}
                      className={`absolute ${pos}`}
                    >
                      <div className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 text-sm font-bold text-black shadow-2xl">
                        {label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <motion.div
            whileHover={{ y: -8 }}
            className={`rounded-[40px] border p-8 ${
              dark
                ? "border-white/10 bg-white/[0.03]"
                : "border-black/10 bg-white"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="rounded-[24px] bg-cyan-500/10 p-5">
                <Store className="h-8 w-8 text-cyan-400" />
              </div>

              <div>
                <h3 className="text-3xl font-black">
                  Shopkeeper Experience
                </h3>

                <p
                  className={`mt-2 ${
                    dark
                      ? "text-white/60"
                      : "text-zinc-600"
                  }`}
                >
                  Faster ordering with intelligent search.
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-5">
              {[
                "Smart reorder suggestions",
                "Realtime price comparison",
                "Delivery ETA tracking",
                "Tamil voice search",
                "Order history & invoices",
              ].map((item) => (
                <div
                  key={item}
                  className={`flex items-center gap-4 rounded-[24px] border p-5 ${
                    dark
                      ? "border-white/10 bg-black/20"
                      : "border-black/10 bg-zinc-50"
                  }`}
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -8 }}
            className={`rounded-[40px] border p-8 ${
              dark
                ? "border-white/10 bg-white/[0.03]"
                : "border-black/10 bg-white"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="rounded-[24px] bg-fuchsia-500/10 p-5">
                <Warehouse className="h-8 w-8 text-fuchsia-400" />
              </div>

              <div>
                <h3 className="text-3xl font-black">
                  Wholesaler Experience
                </h3>

                <p
                  className={`mt-2 ${
                    dark
                      ? "text-white/60"
                      : "text-zinc-600"
                  }`}
                >
                  Complete operational visibility at scale.
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-5">
              {[
                "Bulk inventory management",
                "AI route planning",
                "Retailer relationship dashboard",
                "Sales forecasting",
                "Realtime warehouse analytics",
              ].map((item) => (
                <div
                  key={item}
                  className={`flex items-center gap-4 rounded-[24px] border p-5 ${
                    dark
                      ? "border-white/10 bg-black/20"
                      : "border-black/10 bg-zinc-50"
                  }`}
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative px-4 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Order Lifecycle"
            title="Track every order in realtime"
            desc="From procurement to doorstep delivery with complete visibility."
            dark={dark}
          />

          <div className="grid gap-4 lg:grid-cols-6">
            {orderSteps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                className="relative"
              >
                <motion.div
                  whileHover={{
                    y: -8,
                  }}
                  className={`relative overflow-hidden rounded-[32px] border p-6 text-center ${
                    dark
                      ? "border-white/10 bg-white/[0.03]"
                      : "border-black/10 bg-white"
                  }`}
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-black">
                    <PackageCheck className="h-8 w-8" />
                  </div>

                  <h4 className="mt-6 text-lg font-black">
                    {step}
                  </h4>

                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{
                      duration: 1.2,
                      delay: index * 0.1,
                    }}
                    className="mt-6 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                  />
                </motion.div>

                {index !== orderSteps.length - 1 && (
                  <div className="absolute left-[100%] top-1/2 hidden h-[2px] w-8 bg-gradient-to-r from-cyan-400 to-transparent lg:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Calendar & Scheduling"
            title="Plan deliveries with intelligent scheduling"
            desc="Optimize dispatch windows and route allocation with predictive logistics planning."
            dark={dark}
          />

          <div
            className={`rounded-[40px] border p-8 ${
              dark
                ? "border-white/10 bg-white/[0.03]"
                : "border-black/10 bg-white"
            }`}
          >
            <div className="grid gap-6 md:grid-cols-7">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day) => (
                  <div
                    key={day}
                    className={`rounded-2xl py-4 text-center text-sm font-bold ${
                      dark
                        ? "bg-white/5"
                        : "bg-zinc-100"
                    }`}
                  >
                    {day}
                  </div>
                )
              )}

              {Array.from({ length: 28 }).map((_, i) => (
                <motion.div
                  key={i}
                  whileHover={{
                    y: -6,
                    scale: 1.03,
                  }}
                  className={`min-h-[120px] rounded-[28px] border p-4 ${
                    dark
                      ? "border-white/10 bg-black/20"
                      : "border-black/10 bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{i + 1}</span>

                    {(i + 1) % 5 === 0 && (
                      <div className="h-3 w-3 rounded-full bg-cyan-400" />
                    )}
                  </div>

                  {(i + 1) % 5 === 0 && (
                    <div className="mt-5 rounded-2xl bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-400">
                      12 Deliveries
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Communication"
              title="Centralized business communication"
              desc="Retailers, distributors, delivery teams, and warehouse operators connected in one realtime platform."
              dark={dark}
            />

            <div className="space-y-5">
              {[
                "Tamil & English chat",
                "Voice notes",
                "Broadcast announcements",
                "Realtime delivery alerts",
              ].map((item) => (
                <motion.div
                  whileHover={{ x: 6 }}
                  key={item}
                  className={`flex items-center gap-4 rounded-[24px] border p-5 ${
                    dark
                      ? "border-white/10 bg-white/[0.03]"
                      : "border-black/10 bg-white"
                  }`}
                >
                  <MessageSquareText className="h-5 w-5 text-cyan-400" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* <motion.div
            whileHover={{ y: -8 }}
            className={`overflow-hidden rounded-[40px] border ${
              dark
                ? "border-white/10 bg-white/[0.03]"
                : "border-black/10 bg-white"
            }`}
          >
            <div
              className={`border-b p-5 ${
                dark
                  ? "border-white/10 bg-white/[0.03]"
                  : "border-black/10 bg-zinc-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />

                <div>
                  <h4 className="font-black">
                    South Supply Network
                  </h4>

                  <p
                    className={`text-sm ${
                      dark
                        ? "text-white/50"
                        : "text-zinc-500"
                    }`}
                  >
                    online
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">
              {[
                {
                  left: true,
                  text:
                    "Your order is packed and ready for dispatch.",
                },
                {
                  left: false,
                  text:
                    "ETA for Pattukkottai route updated to 4:20 PM.",
                },
                {
                  left: true,
                  text:
                    "New sunflower oil inventory available today.",
                },
              ].map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.left
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`max-w-[80%] rounded-[28px] px-5 py-4 text-sm leading-7 ${
                      msg.left
                        ? dark
                          ? "bg-white/8 text-white"
                          : "bg-zinc-100 text-zinc-900"
                        : "bg-gradient-to-r from-cyan-400 to-blue-500 text-black"
                    }`}
                  >
                    {msg.text}
                  </motion.div>
                </div>
              ))}
            </div>

            <div
              className={`border-t p-5 ${
                dark
                  ? "border-white/10"
                  : "border-black/10"
              }`}
            >
              <div
                className={`flex items-center gap-4 rounded-[24px] border px-5 py-4 ${
                  dark
                    ? "border-white/10 bg-black/20"
                    : "border-black/10 bg-zinc-50"
                }`}
              >
                <input
                  className="flex-1 bg-transparent outline-none"
                  placeholder="Type a message..."
                />

                <button className="rounded-2xl bg-cyan-500/10 p-3">
                  <Send className="h-5 w-5 text-cyan-400" />
                </button>
              </div>
            </div>
          </motion.div> */}
        </div>
      </section>

      <section className="relative px-4 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Trust & Reliability"
            title="Built for operational reliability"
            desc="Enterprise-grade performance, compliance, uptime, and security."
            dark={dark}
          />

          <div className="grid gap-6 lg:grid-cols-4">
            {[
              {
                title: "99.99% Uptime",
                icon: Activity,
              },
              {
                title: "Role-based Security",
                icon: Shield,
              },
              {
                title: "Realtime Sync",
                icon: Wifi,
              },
              {
                title: "Audit Logs",
                icon: ClipboardCheck,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  whileHover={{
                    y: -8,
                  }}
                  className={`rounded-[34px] border p-8 ${
                    dark
                      ? "border-white/10 bg-white/[0.03]"
                      : "border-black/10 bg-white"
                  }`}
                >
                  <div className="rounded-[24px] bg-cyan-500/10 p-4 w-fit">
                    <Icon className="h-8 w-8 text-cyan-400" />
                  </div>

                  <h4 className="mt-8 text-2xl font-black">
                    {item.title}
                  </h4>

                  <p
                    className={`mt-4 leading-8 ${
                      dark
                        ? "text-white/60"
                        : "text-zinc-600"
                    }`}
                  >
                    Enterprise-grade infrastructure designed for high-volume commerce operations.
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Testimonials"
            title="Loved by retailers & distributors"
            desc="Trusted across Tamil Nadu's growing wholesale ecosystem."
            dark={dark}
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                }}
                className={`relative overflow-hidden rounded-[38px] border p-8 ${
                  dark
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-black/10 bg-white"
                }`}
              >
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

                <div className="relative">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  <p
                    className={`mt-8 text-lg leading-9 ${
                      dark
                        ? "text-white/70"
                        : "text-zinc-700"
                    }`}
                  >
                    "{testimonial.text}"
                  </p>

                  <div className="mt-10 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />

                    <div>
                      <h4 className="font-black">
                        {testimonial.name}
                      </h4>

                      <p
                        className={`text-sm ${
                          dark
                            ? "text-white/50"
                            : "text-zinc-500"
                        }`}
                      >
                        {testimonial.role} ·{" "}
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Pricing"
            title={t.pricingTitle}
            desc="Flexible plans for every scale of business."
            dark={dark}
          />

          <div className="grid gap-8 lg:grid-cols-3">
            {pricing.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  scale: 1.01,
                }}
                className={`relative overflow-hidden rounded-[40px] border p-8 ${
                  plan.popular
                    ? "border-cyan-400/40 bg-gradient-to-b from-cyan-500/10 to-blue-500/10"
                    : dark
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-black/10 bg-white"
                }`}
              >
                {plan.popular && (
                  <div className="absolute right-5 top-5 rounded-full bg-cyan-400 px-4 py-2 text-xs font-black text-black">
                    Popular
                  </div>
                )}

                <h3 className="text-3xl font-black">
                  {plan.name}
                </h3>

                <p
                  className={`mt-3 ${
                    dark
                      ? "text-white/60"
                      : "text-zinc-600"
                  }`}
                >
                  {plan.desc}
                </p>

                <div className="mt-8 flex items-end gap-2">
                  <span className="text-6xl font-black">
                    {plan.price}
                  </span>

                  {plan.price !== "Custom" && (
                    <span
                      className={`pb-2 ${
                        dark
                          ? "text-white/50"
                          : "text-zinc-500"
                      }`}
                    >
                      /month
                    </span>
                  )}
                </div>

                <div className="mt-10 space-y-4">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-4"
                    >
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />

                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <MagneticButton
                    primary={plan.popular}
                    className="w-full justify-center"
                  >
                    Choose Plan
                  </MagneticButton>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-24 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="FAQ"
            title={t.faqTitle}
            desc="Everything you need to know about StockLinker."
            dark={dark}
          />

          <div className="space-y-5">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.q}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.08,
                }}
                className={`overflow-hidden rounded-[32px] border ${
                  dark
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-black/10 bg-white"
                }`}
              >
                <button
                  onClick={() =>
                    setFaqOpen(
                      faqOpen === index ? -1 : index
                    )
                  }
                  className="flex w-full items-center justify-between px-8 py-7 text-left"
                >
                  <span className="text-lg font-black">
                    {faq.q}
                  </span>

                  <motion.div
                    animate={{
                      rotate:
                        faqOpen === index ? 180 : 0,
                    }}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {faqOpen === index && (
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
                      <div
                        className={`px-8 pb-8 text-base leading-8 ${
                          dark
                            ? "text-white/60"
                            : "text-zinc-600"
                        }`}
                      >
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-24 pt-10 sm:px-8">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="mx-auto max-w-7xl overflow-hidden rounded-[48px] border border-white/10 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-fuchsia-500/20 p-10 shadow-2xl backdrop-blur-3xl lg:p-16"
        >
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white/80 backdrop-blur-xl">
              <Rocket className="h-4 w-4" />
              Enterprise SaaS Infrastructure
            </div>

            <h2 className="mx-auto mt-8 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
              {t.finalTitle}
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-white/70">
              Connect suppliers, retailers, warehouses, and delivery operations in one intelligent commerce platform.
            </p>

            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <MagneticButton primary>
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>

              <MagneticButton>
                Book Enterprise Demo
              </MagneticButton>
            </div>
          </div>

          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10"
          />

          <motion.div
            animate={{
              rotate: [360, 0],
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full border border-cyan-400/20"
          />
        </motion.div>
      </section>

      <footer className="relative px-4 pb-10 pt-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.4fr_0.2fr_0.2fr_0.2fr]">
            <div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 blur-lg" />

                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
                    <Layers3 className="h-7 w-7" />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-black">
                    StockLinker
                  </h3>

                  <p
                    className={`text-sm ${
                      dark
                        ? "text-white/50"
                        : "text-zinc-500"
                    }`}
                  >
                    Intelligent Wholesale Platform
                  </p>
                </div>
              </div>

              <p
                className={`mt-8 max-w-md text-base leading-8 ${
                  dark
                    ? "text-white/60"
                    : "text-zinc-600"
                }`}
              >
                {t.footerText}
              </p>

              <div className="mt-8 flex items-center gap-4">
                {[
                  FaTwitter,
                  FaLinkedin,
                  FaInstagram,
                  FaFacebook,
                ].map((Icon, index) => (
                  <motion.button
                    key={index}
                    whileHover={{
                      y: -5,
                      scale: 1.08,
                    }}
                    className={`rounded-2xl border p-4 ${
                      dark
                        ? "border-white/10 bg-white/[0.03]"
                        : "border-black/10 bg-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.button>
                ))}
              </div>
            </div>

            {[
              {
                title: "Platform",
                items: [
                  "Inventory",
                  "Analytics",
                  "Pricing",
                  "Routing",
                ],
              },
              {
                title: "Solutions",
                items: [
                  "Retailers",
                  "Wholesalers",
                  "Warehouses",
                  "Enterprise",
                ],
              },
              {
                title: "Resources",
                items: [
                  "Documentation",
                  "API",
                  "Support",
                  "Community",
                ],
              },
            ].map((group) => (
              <div key={group.title}>
                <h4 className="text-lg font-black">
                  {group.title}
                </h4>

                <div className="mt-6 space-y-4">
                  {group.items.map((item) => (
                    <motion.a
                      whileHover={{ x: 6 }}
                      key={item}
                      href="#"
                      className={`block text-sm transition-colors ${
                        dark
                          ? "text-white/60 hover:text-white"
                          : "text-zinc-600 hover:text-zinc-950"
                      }`}
                    >
                      {item}
                    </motion.a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            className={`mt-16 flex flex-col items-center justify-between gap-5 border-t pt-8 text-sm sm:flex-row ${
              dark
                ? "border-white/10 text-white/40"
                : "border-black/10 text-zinc-500"
            }`}
          >
            <div>
              © 2026 StockLinker. All rights reserved.
            </div>

            <div className="flex items-center gap-6">
              <button>Privacy</button>
              <button>Terms</button>
              <button>Security</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}