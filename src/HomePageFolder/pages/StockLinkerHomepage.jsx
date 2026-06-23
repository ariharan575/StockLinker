import React, { useState } from 'react';
import { Header, Sidebar, Footer } from '../layout';
import {
  Hero,
  QuickActions,
  Categories,
  PriceComparison,
  FeaturedComparisons,
  NearbySellers,
  RecentlyViewed,
  ReorderSection,
  TrustedSuppliers,
  WhyStockLinkers
} from '../sections';
import { C, FONT_BODY } from '../common/constants';

export default function StockLinkerHomepage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  return (
    <div style={{ backgroundColor: C.page, minHeight: '100vh', fontFamily: FONT_BODY, color: C.body }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
        * { -webkit-font-smoothing: antialiased; }
        ::selection { background: ${C.bLight}; color: ${C.brand}; }
        :focus-visible { outline: none }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <Header open={sidebarOpen} setOpen={setSidebarOpen} />
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} active={activeNav} setActive={setActiveNav} />

      <div className="pt-16 lg:pl-60">
        <main className="px-4 md:px-6 lg:px-8 py-3.5" style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Hero />
          <QuickActions />
          <Categories />
          <PriceComparison />
          <FeaturedComparisons />
          <NearbySellers />
          <RecentlyViewed />
          <ReorderSection />
          <TrustedSuppliers />
          <WhyStockLinkers />
        </main>
        <Footer />
      </div>
    </div>
  );
}