import React from 'react'
import Navbar from '../Sections/Navbar'
import Footer from '../Sections/Footer'
import WholesalerWorkFlow from '../Sections/WholesalerWorkFlow'
import ShopkeeperFlow from '../Sections/ShopkeeperFlow'
import ProductShowcase from '../Sections/ProductShowcase'
import WholesaleCommerceCTA from '../Sections/WholesaleCommerceCTA'
import HeroSection from '../Sections/HeroSection'

export const LandingPage = () => {
  return (
    <>
      <Navbar />
        <main>
        <HeroSection/>
        <ShopkeeperFlow/>
        <ProductShowcase/>
        <WholesalerWorkFlow/>
        <WholesaleCommerceCTA/>
        <Footer />
      </main>
    </>
  )
}
