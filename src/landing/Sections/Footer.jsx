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
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Updated to use specific section routes matching the documentation
const links = {
  platform: [
    { label: "Product Discovery", href: "/documentation?section=product-discovery" },
    { label: "Price Comparison", href: "/documentation?section=compare-prices" },
    { label: "Order Management", href: "/documentation?section=creating-order" },
    { label: "Route Tracking", href: "/documentation?section=order-tracking" },
    { label: "Communication", href: "/documentation?section=buyer-supplier-communication" },
  ],
  roles: [
    { label: "Shopkeeper", href: "/documentation?section=shopkeeper-dashboard" },
    { label: "Wholesaler", href: "/documentation?section=wholesaler-dashboard" },
    { label: "Admin", href: "/documentation?section=rbac" },
    { label: "Guest Mode", href: "/documentation?section=guest-access" },
  ],
  resources: [
    { label: "Documentation", href: "/documentation" },
    { label: "FAQs", href: "/documentation?section=getting-started" },
    { label: "Support", href: "/documentation?section=enquiries" },
    { label: "Contact", href: "#" },
  ],
  technology: [
    { label: "React", href: "/documentation?section=frontend" },
    { label: "Spring Boot", href: "/documentation?section=backend" },
    { label: "PostgreSQL", href: "/documentation?section=database" },
    { label: "Platform Architecture", href: "/documentation?section=architecture" },
  ],
};

// Premium Apple-style Easing Curve
const easePremium = [0.16, 1, 0.3, 1];

// Added SPA navigation using useNavigate to prevent hard reloads
function FooterLink({ children, href }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    // Intercept internal routing to use React Router
    if (href && href.startsWith("/")) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <motion.a
      href={href}
      onClick={handleClick}
      whileHover={{ x: 8 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      className="group flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-white cursor-pointer will-change-transform translate-z-0"
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

// Updated mapping to handle the object structure
function FooterColumn({ title, items }) {
  return (
    <div>
      <h4 className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-white/35">
        {title}
      </h4>

      <div className="space-y-4">
        {items.map((item) => (
          <FooterLink key={item.label} href={item.href}>
            {item.label}
          </FooterLink>
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

  // Optimized spring for scroll tracking
  const y = useSpring(
    useTransform(
      scrollYProgress,
      [0, 1],
      [60, 0]
    ),
    {
      stiffness: 100,
      damping: 30,
      restDelta: 0.001,
    }
  );

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden bg-[#020202] text-white"
    >
      {/* Background Effects (Hardware Accelerated) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,0.08) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,0.08) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-15, 15, -15],
              opacity: [0.1, 0.8, 0.1],
            }}
            transition={{
              duration: 6 + (i % 5),
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute h-1 w-1 rounded-full bg-white/30 will-change-transform translate-z-0"
            style={{
              left: `${(i * 7) % 100}%`,
              top: `${(i * 13) % 100}%`,
            }}
          />
        ))}

        {/* Ambient Background Light Glow */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute left-1/2 top-1/3 h-[700px] w-[700px] -translate-x-1/2 rounded-full will-change-transform translate-z-0"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Main Content Wrapper */}
      <motion.div
        style={{ y }}
        className="relative z-10 mx-auto max-w-7xl px-6 pt-16 md:px-10 will-change-transform transform-gpu"
      >
        <div className="grid gap-16 lg:grid-cols-[1.2fr_2fr]">
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

            {/* Social & Contact Links */}
            <div className="mt-10 flex items-center gap-4">
              {/* GitHub */}
              <motion.a
                href={import.meta.env.VITE_GITHUB_URI} // Fetched from env
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit GitHub profile"
                title="GitHub"
                whileHover={{
                  scale: 1.1,
                  rotate: 8,
                  y: -3,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] transition-all hover:bg-white/90 hover:text-black will-change-transform translate-z-0"
              >
                <FaGithub size={20} />
              </motion.a>

              {/* LinkedIn */}
              <motion.a
                href={import.meta.env.VITE_LINKEDIN_URI} // Fetched from env
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit LinkedIn profile"
                title="LinkedIn"
                whileHover={{
                  scale: 1.1,
                  rotate: 8,
                  y: -3,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] transition-all hover:bg-white/90 hover:text-black will-change-transform translate-z-0"
              >
                <FaLinkedin size={20} />
              </motion.a>

              {/* Instagram */}
              <motion.a
                href={import.meta.env.VITE_INSTA_URI} // Fetched from env
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Instagram profile"
                title="Instagram"
                whileHover={{
                  scale: 1.1,
                  rotate: 8,
                  y: -3,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] transition-all hover:bg-white/90 hover:text-black will-change-transform translate-z-0"
              >
                <FaInstagram size={20} />
              </motion.a>

              {/* Email - Tooltip Only / No Navigation */}
              <div className="group relative">
                <motion.button
                  type="button"
                  aria-label="Show email address"
                  whileHover={{
                    scale: 1.1,
                    rotate: 8,
                    y: -3,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition-all duration-200 hover:bg-white/90 hover:text-black will-change-transform translate-z-0"
                >
                  <Mail
                    size={20}
                    className="transition-colors duration-200"
                  />
                </motion.button>

                {/* Email Tooltip */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    bottom-full
                    left-1/2
                    z-[100]
                    mb-3
                    -translate-x-1/2
                    translate-y-2
                    whitespace-nowrap
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-2.5
                    text-xs
                    font-semibold
                    text-slate-800
                    shadow-[0_10px_30px_rgba(0,0,0,0.25)]
                    opacity-0
                    scale-95
                    invisible
                    transition-all
                    duration-200
                    ease-out
                    group-hover:visible
                    group-hover:translate-y-0
                    group-hover:scale-100
                    group-hover:opacity-100
                  "
                >
                  {import.meta.env.VITE_EMAIL} {/* Fetched from env */}

                  {/* Tooltip Arrow */}
                  <span
                    className="
                      absolute
                      left-1/2
                      top-full
                      h-2.5
                      w-2.5
                      -translate-x-1/2
                      -translate-y-1/2
                      rotate-45
                      border-r
                      border-b
                      border-slate-200
                      bg-white
                    "
                  />
                </div>
              </div>
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
    </footer>
  );
}