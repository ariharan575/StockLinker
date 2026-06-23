import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import {
  Mail,
  ArrowUpRight,
  Network,
} from "lucide-react";
import { FaGithub, FaLinkedin , FaInstagram} from "react-icons/fa";

const links = {
  platform: [
    "Product Discovery",
    "Price Comparison",
    "Order Management",
    "Route Tracking",
    "Communication",
  ],
  roles: ["Shopkeeper", "Wholesaler", "Admin", "Guest Mode"],
  resources: ["Documentation", "FAQs", "Support", "Contact"],
  technology: ["React", "Spring Boot", "MySQL", "Open Source"],
};

function FooterLink({ children }) {
  return (
    <motion.a
      href="#"
      whileHover={{ x: 8 }}
      className="group flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-white"
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
      </span>

      <ArrowUpRight
        size={12}
        className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
      />
    </motion.a>
  );
}

function FooterColumn({ title, items }) {
  return (
    <div>
      <h4 className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-white/35">
        {title}
      </h4>

      <div className="space-y-4">
        {items.map((item) => (
          <FooterLink key={item}>{item}</FooterLink>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [60, 0]), // Reduced translation range from 120 to 60 for smoother alignment
    {
      stiffness: 120,
      damping: 30,
    }
  );

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden bg-[#020202] text-white"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
            backgroundSize: "80px 80px",
          }}
        />

        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 6 + (i % 5),
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute h-1 w-1 rounded-full bg-white/30"
            style={{
              left: `${(i * 7) % 100}%`,
              top: `${(i * 13) % 100}%`,
            }}
          />
        ))}

        <svg className="absolute inset-0 h-full w-full opacity-[0.06]">
          {[...Array(12)].map((_, i) => (
            <motion.line
              key={i}
              x1={`${(i * 10) % 100}%`}
              y1="0%"
              x2={`${100 - ((i * 8) % 100)}%`}
              y2="100%"
              stroke="white"
              strokeWidth="1"
              animate={{
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
              }}
            />
          ))}
        </svg>
      </div>

      {/* Main Content Wrapper */}
      <motion.div
        style={{ y }}
        className="relative z-10 mx-auto max-w-7xl px-6 pt-16 md:px-10" // Reduced pt-32 to pt-16
      >
        <div className="grid gap-16 lg:grid-cols-[1.2fr_2fr]"> {/* Removed mt-28 entirely */}
          {/* Left Brand Column */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <Network size={22} />
              </div>

              <div>
                <div className="text-xl font-semibold">
                  StockLinker
                </div>
                <div className="text-xs text-white/40">
                  Wholesale Commerce OS
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/50">
              Connecting businesses through smarter product discovery,
              supplier intelligence, order orchestration, route tracking,
              communication, and invoicing.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              {["Tamil", "English", "Voice Search Support"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/70"
                  >
                    {item}
                  </div>
                )
              )}
            </div>

            <div className="mt-10 flex items-center gap-4">
              {[FaGithub, FaLinkedin, Mail].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{
                    scale: 1.1,
                    rotate: 8,
                    y: -3,
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] transition-all hover:border-white/20"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right Links Navigation Column */}
          <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-4">
            <FooterColumn
              title="Platform"
              items={links.platform}
            />

            <FooterColumn
              title="Roles"
              items={links.roles}
            />

            <FooterColumn
              title="Resources"
              items={links.resources}
            />

            <FooterColumn
              title="Technology"
              items={links.technology}
            />
          </div>
        </div>

        {/* Bottom Bar Section */}
        <div className="mt-24 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="flex flex-col items-center justify-between gap-6 py-8 text-center text-xs text-white/40 md:flex-row">
          <div>
            © {new Date().getFullYear()} StockLinker
          </div>

          <div>
            Built for Shopkeepers and Wholesalers
          </div>

          <div>
            Made with Open Source Technologies
          </div>
        </div>
      </motion.div>

      {/* Ambient background light glow */}
      <motion.div
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="pointer-events-none absolute left-1/2 top-1/3 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-white/[0.03] blur-[140px]"
      />
    </footer>
  );
}