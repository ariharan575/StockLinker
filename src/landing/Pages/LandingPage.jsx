import React from 'react'
import Navbar from '../Sections/Navbar'
import Footer from '../Sections/Footer'
import Dashboard from '../Sections/Dashboard'
import GetStarted from '../Sections/GetStarted'
import Hero from '../Sections/Hero'
import Features from '../Sections/Features'
import HowStockLinkerWorks from '../Sections/HowStockLinkerWorks'
import RoleExperience from '../Sections/RoleExperience'

export const LandingPage = () => {

  console.log(`${import.meta.env.VITE_API_URL}`)

  return (
    <>
      <Navbar />
      <main className=''>
        <section id="overview">
          <Hero/>
        </section>
        
        <section id="features">
          <Features/>
        </section>
        
        <section id="how-it-works">
          <HowStockLinkerWorks/>
        </section>
        
        <section id="solutions">
          <RoleExperience/>
        </section>
        
        <section id="dashboard">
          <Dashboard/>
        </section>
        
        <GetStarted/>
        <Footer />
      </main>
    </>
  )
}