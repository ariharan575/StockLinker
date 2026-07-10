import React from 'react'
import Navbar from '../Sections/Navbar'
import Footer from '../Sections/Footer'
import WholesalerWorkFlow from '../Sections/WholesalerWorkFlow'
import ShopkeeperFlow from '../Sections/ShopkeeperFlow'
import ProductShowcase from '../Sections/ProductShowcase'
import WholesaleCommerceCTA from '../Sections/WholesaleCommerceCTA'
import HeroSection from '../Sections/HeroSection'
import FeaturesSection from '../Sections/FeaturesSection'
import HowStockLinkerWorks from '../Sections/HowStockLinkerWorks'
import RoleExperienceSection from '../Sections/RoleExperienceSection'

export const LandingPage = () => {
  return (
    <>
    
      <Navbar />
        <main className=''>
        <HeroSection/>
        <FeaturesSection/>
        <HowStockLinkerWorks/>
        {/* <FeatureCard/> */}
        {/* <ShopkeeperFlow/> */}
        <RoleExperienceSection/>
        <ProductShowcase/>
        {/* <WholesalerWorkFlow/> */}
        <WholesaleCommerceCTA/>
        <Footer />
      </main>
    </>
  )
}
