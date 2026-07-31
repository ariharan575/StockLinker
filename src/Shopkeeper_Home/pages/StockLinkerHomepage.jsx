import React from 'react';
import MainLayout from '../../Layout/MainLayout'; // Adjust the import path if necessary
import {
  Hero,
  QuickActions,
  Categories,
  PriceComparison,
  FeaturedComparisons,
  NearbySellers,
  ReorderSection,
  TrustedSuppliers,
  WhyStockLinkers
} from '../sections';
import Footer from '../../Layout/Footer';

export default function StockLinkerHomepage() {
  return (

    <>
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
              * { -webkit-font-smoothing: antialiased; }
              :focus-visible { outline: none }
              @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
              }
            `}</style>
   
    <MainLayout 
      activeNav="home"
      maxWidth={1400}
      contentPadding="px-3 py-3.5"
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Hero />
        <QuickActions />
        <Categories />
        <PriceComparison />
        <FeaturedComparisons />
        <NearbySellers />
        <ReorderSection />
        <TrustedSuppliers />
        <WhyStockLinkers />
        <Footer/>
      </div>
    </MainLayout>

   </> 
  );
}