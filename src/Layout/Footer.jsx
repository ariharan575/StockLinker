import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Mail } from 'lucide-react';
import { SKY_300 } from './common/constants';

const FOOTER_COLS = [
  {
    head: 'Categories',
    links: [
      { label: 'Grocery', href: '#' },
      { label: 'Beverages', href: '#' },
      { label: 'Dairy', href: '#' },
      { label: 'Hardware', href: '#' },
      { label: 'Medical', href: '#' },
      { label: 'Packaging', href: '#' },
    ],
  },
  {
    head: 'For Businesses',
    links: [
      { label: 'Retailers', href: '#' },
      { label: 'Suppliers', href: '#' },
      { label: 'Distributors', href: '#' },
      { label: 'Wholesalers', href: '#' },
    ],
  },
  {
    head: 'Technology',
    links: [
      { label: 'React.js', href: '#' },
      { label: 'Spring Boot', href: '#' },
      { label: 'MySQL', href: '#' },
      { label: 'MongoDB', href: '#' },
      { label: 'REST API', href: '#' },
    ],
  },
  {
    head: 'Resources',
    links: [
      { label: 'Documentation', href: '/documentation' }, // Updated Path
      { label: 'Support', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    href: import.meta.env.VITE_LINKEDIN_URI, // Fetched from env
    Icon: FaLinkedin,
    type: 'link',
  },
  {
    name: 'GitHub',
    href: import.meta.env.VITE_GITHUB_URI, // Fetched from env
    Icon: FaGithub,
    type: 'link',
  },
  {
    name: 'Email',
    value: import.meta.env.VITE_EMAIL, // Fetched from env
    Icon: Mail,
    type: 'email',
  },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#132238] via-[#17304d] to-[#1b1b3a]">
      <div className="px-6 lg:px-10 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  width="32"
                  height="32"
                  rx="8"
                  fill="url(#footerGrad)"
                />

                <defs>
                  <linearGradient
                    id="footerGrad"
                    x1="0"
                    y1="0"
                    x2="32"
                    y2="32"
                  >
                    <stop
                      offset="0%"
                      stopColor="#EC4899"
                    />
                    <stop
                      offset="100%"
                      stopColor="#F97316"
                    />
                  </linearGradient>
                </defs>

                <circle
                  cx="10"
                  cy="16"
                  r="4.5"
                  fill="white"
                  opacity="0.95"
                />

                <circle
                  cx="22"
                  cy="16"
                  r="4.5"
                  fill="white"
                  opacity="0.95"
                />

                <rect
                  x="12"
                  y="14"
                  width="8"
                  height="4"
                  rx="2"
                  fill="white"
                />

                <circle
                  cx="10"
                  cy="16"
                  r="2"
                  fill="#1b1b3a"
                />

                <circle
                  cx="22"
                  cy="16"
                  r="2"
                  fill="#1b1b3a"
                />
              </svg>

              <span className="font-bold text-xl text-white">
                Stock
                <span style={{ color: SKY_300 }}>
                  Linker
                </span>
              </span>
            </div>

            <p
              className="text-sm leading-relaxed mb-5"
              style={{
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              Hyperlocal B2B wholesale marketplace connecting
              retailers with nearby suppliers for smarter,
              faster procurement.
            </p>

            {/* Social / Contact Buttons */}
            <div className="flex gap-2">
              {SOCIAL_LINKS.map(
                ({ name, href, value, Icon, type }) => {
                  if (type === 'email') {
                    return (
                      <div
                        key={name}
                        className="relative group"
                      >
                        {/* Email Button */}
                        <button
                          type="button"
                          aria-label="Show email address"
                          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                          style={{
                            backgroundColor:
                              'rgba(255,255,255,0.07)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              '#FFFFFF';

                            e.currentTarget.style.transform =
                              'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              'rgba(255,255,255,0.07)';

                            e.currentTarget.style.transform =
                              'translateY(0)';
                          }}
                        >
                          <Icon
                            className="transition-colors duration-200"
                            style={{
                              width: 16,
                              height: 16,
                              color: '#94A3B8',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color =
                                '#0F172A';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color =
                                '#94A3B8';
                            }}
                          />
                        </button>

                        {/* Email Tooltip */}
                        <div
                          className="pointer-events-none absolute left-1/2 bottom-full mb-3 -translate-x-1/2 translate-y-1 opacity-0 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-200 whitespace-nowrap z-50"
                        >
                          <div className="relative rounded-lg bg-white px-3 py-2 shadow-lg border border-slate-200">
                            <span className="text-xs font-medium text-slate-800">
                              {value}
                            </span>

                            {/* Tooltip Arrow */}
                            <span
                              className="absolute left-1/2 top-full -translate-x-1/2 w-2 h-2 rotate-45 bg-white border-r border-b border-slate-200"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${name} profile`}
                      title={`Visit ${name}`}
                      className="group w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                      style={{
                        backgroundColor:
                          'rgba(255,255,255,0.07)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          '#FFFFFF';

                        e.currentTarget.style.transform =
                          'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          'rgba(255,255,255,0.07)';

                        e.currentTarget.style.transform =
                          'translateY(0)';
                      }}
                    >
                      <Icon
                        className="transition-colors duration-200"
                        style={{
                          width: 16,
                          height: 16,
                          color: '#94A3B8',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color =
                            '#0F172A';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color =
                            '#94A3B8';
                        }}
                      />
                    </a>
                  );
                }
              )}
            </div>
          </div>

          {/* Footer Columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.head}>
              <h4 className="text-sm font-bold mb-4 text-slate-200">
                {col.head}
              </h4>

              {col.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-sm mb-2.5 cursor-pointer transition-colors duration-200"
                  style={{
                    color: 'rgba(255,255,255,0.55)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color =
                      '#CBD5E1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      'rgba(255,255,255,0.55)';
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div
          className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{
            borderColor: 'rgba(255,255,255,0.10)',
          }}
        >
          <p
            className="text-xs text-center md:text-left"
            style={{
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            © {new Date().getFullYear()} StockLinker. All rights reserved.
            {' '}Made with ❤️ in Chennai, India 🇮🇳
          </p>

          <div className="flex gap-5">
            {['Privacy', 'Terms', 'Cookies'].map(
              (link) => (
                <a
                  key={link}
                  href="#"
                  className="text-xs cursor-pointer transition-colors duration-200"
                  style={{
                    color: '#52525B',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color =
                      '#94A3B8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      '#475569';
                  }}
                >
                  {link}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}