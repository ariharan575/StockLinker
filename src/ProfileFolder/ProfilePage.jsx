import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ArrowRight, Play, Check, Star, TrendingUp, 
  Truck, Package, Users, MapPin, CreditCard, BarChart3,
  Search, ShoppingCart, Zap, Globe, Shield, Clock, Mail,
  ChevronDown, Phone, MessageCircle, Bell, Eye, Settings
} from 'lucide-react';

import { FaFacebook,FaInstagram, FaTwitter, FaLinkedin ,FaYoutube} from "react-icons/fa";

// Custom hook for mouse position
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);
  return mousePosition;
};

// Scroll reveal hook
const useScrollReveal = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  return { ref, isInView };
};

// Animated Counter
const AnimatedCounter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useScrollReveal();
  
  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value.toString().replace(/[^0-9]/g, ''));
      if (isNaN(end)) return;
      const incrementTime = (duration * 1000) / end;
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);
  
  return <span ref={ref}>{count}{typeof value === 'string' ? value.replace(/[0-9]/g, '') : ''}</span>;
};

// Navbar Component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navLinks = ['Features', 'Solutions', 'Marketplace', 'Pricing', 'Resources'];
  
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      }`}
      style={{ height: '88px' }}
    >
      <div className="container mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          StockLinker
        </motion.div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link}
              href={`#${link.toLowerCase()}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ color: '#60A5FA' }}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              {link}
            </motion.a>
          ))}
        </div>
        
        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Login
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            className="px-5 py-2 rounded-xl border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 transition-all"
          >
            Book Demo
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/25"
          >
            Start Free Trial
          </motion.button>
        </div>
        
        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
              {navLinks.map(link => (
                <a key={link} href={`#${link.toLowerCase()}`} className="text-gray-300 hover:text-white py-2" onClick={() => setIsOpen(false)}>
                  {link}
                </a>
              ))}
              <div className="flex flex-col space-y-3 pt-4">
                <button className="text-gray-300 hover:text-white py-2">Login</button>
                <button className="px-5 py-2 rounded-xl border border-blue-500/50 text-blue-400">Book Demo</button>
                <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">Start Free Trial</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// Hero Section
const Hero = () => {
  const mousePosition = useMousePosition();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  
  const metrics = [
    { label: 'Retailers', value: '5000+' },
    { label: 'Wholesalers', value: '500+' },
    { label: 'Orders', value: '250K+' },
    { label: 'Reliability', value: '99.9%' }
  ];
  
  const nodes = [
    { name: 'Retailer', icon: <ShoppingCart size={20} />, color: 'from-green-400 to-emerald-500', x: '10%', y: '20%' },
    { name: 'Order', icon: <Package size={20} />, color: 'from-blue-400 to-cyan-500', x: '30%', y: '40%' },
    { name: 'Wholesaler', icon: <Users size={20} />, color: 'from-purple-400 to-pink-500', x: '50%', y: '15%' },
    { name: 'Route', icon: <MapPin size={20} />, color: 'from-orange-400 to-red-500', x: '70%', y: '35%' },
    { name: 'Delivery', icon: <Truck size={20} />, color: 'from-yellow-400 to-amber-500', x: '85%', y: '60%' },
    { name: 'Collection', icon: <CreditCard size={20} />, color: 'from-indigo-400 to-purple-500', x: '60%', y: '75%' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, color: 'from-red-400 to-pink-500', x: '30%', y: '80%' }
  ];
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20" style={{ minHeight: '100vh' }}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      
      {/* Mouse-reactive Glow */}
      <motion.div 
        className="absolute w-[600px] h-[600px] rounded-full bg-blue-500/20 blur-[100px] pointer-events-none"
        animate={{ x: mousePosition.x - 300, y: mousePosition.y - 300 }}
        transition={{ type: 'spring', stiffness: 50, damping: 30 }}
      />
      
      {/* Floating Particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
          initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
          animate={{ y: [null, -20, 20, -20], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 3 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }}
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
        />
      ))}
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
            >
              <Zap size={14} className="text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">#1 Distribution Management Platform</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
                Connect Every Retailer, Wholesaler, Sales Rep And Delivery Route
              </span>
              <span className="text-blue-400"> In One Powerful Network</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Manage orders, inventory, routes, collections, retailers, sales teams, and marketplace discovery from a single platform.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                Start Free Trial <ArrowRight size={18} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl border border-white/20 text-white font-semibold text-lg hover:bg-white/5 transition-all"
              >
                Book Demo
              </motion.button>
            </motion.div>
            
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
              {metrics.map((metric, i) => (
                <motion.div 
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-white"><AnimatedCounter value={metric.value} duration={1.5} /></div>
                  <div className="text-sm text-gray-400">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Right - Animated Ecosystem */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 relative h-[500px] lg:h-[600px]"
            style={{ y }}
          >
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {nodes.map((node, i) => 
                nodes.slice(i+1).map((target, j) => (
                  <motion.line
                    key={`${i}-${j}`}
                    x1={node.x}
                    y1={node.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="rgba(59,130,246,0.2)"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                ))
              )}
            </svg>
            
            {/* Animated Nodes */}
            {nodes.map((node, i) => (
              <motion.div
                key={node.name}
                className={`absolute bg-gradient-to-r ${node.color} rounded-xl p-3 shadow-xl backdrop-blur-sm`}
                style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.1, zIndex: 20 }}
              >
                <div className="flex items-center gap-2">
                  {node.icon}
                  <span className="text-sm font-medium whitespace-nowrap">{node.name}</span>
                </div>
                <motion.div 
                  className="absolute -inset-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
              </motion.div>
            ))}
            
            {/* Data Particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                initial={{ left: '30%', top: '40%', opacity: 1 }}
                animate={{ 
                  left: ['30%', '50%', '70%', '85%', '60%', '30%'],
                  top: ['40%', '15%', '35%', '60%', '75%', '80%'],
                  opacity: [1, 0.5, 1, 0.5, 1, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Problem Section
const ProblemSection = () => {
  const { ref, isInView } = useScrollReveal();
  
  const problems = [
    { title: 'Lost Orders', example: 'Retailer sends order in WhatsApp. Order forgotten. Business loses revenue.', icon: <Package size={32} />, color: 'from-red-500 to-orange-500' },
    { title: 'Route Confusion', example: 'Delivery person doesn\'t know optimal route. Extra fuel. Late deliveries.', icon: <MapPin size={32} />, color: 'from-orange-500 to-yellow-500' },
    { title: 'Collection Delays', example: 'Outstanding balances not tracked. Cash flow issues.', icon: <CreditCard size={32} />, color: 'from-yellow-500 to-amber-500' },
    { title: 'Retailer Visibility', example: 'No idea which retailer is active. Lost opportunities.', icon: <Users size={32} />, color: 'from-amber-500 to-red-500' }
  ];
  
  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Traditional Distribution <span className="text-red-400">Is Broken</span></h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Most wholesalers still rely on calls, WhatsApp, manual collections, paper records, and disconnected systems.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-full">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${problem.color} flex items-center justify-center mb-4`}>
                  {problem.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{problem.title}</h3>
                <p className="text-gray-400">{problem.example}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works (Interactive Timeline)
const HowItWorks = () => {
  const steps = [
    { title: 'Retailer Places Order', desc: 'Retailer orders through mobile app or web portal', icon: <ShoppingCart size={24} /> },
    { title: 'Wholesaler Receives Order', desc: 'Instant notification with order details', icon: <Bell size={24} /> },
    { title: 'Route Assigned', desc: 'AI optimizes delivery route automatically', icon: <MapPin size={24} /> },
    { title: 'Delivery Completed', desc: 'Real-time tracking and proof of delivery', icon: <Check size={24} /> },
    { title: 'Collection Received', desc: 'Automatic payment reconciliation', icon: <CreditCard size={24} /> },
    { title: 'Analytics Updated', desc: 'Live dashboard with business insights', icon: <TrendingUp size={24} /> }
  ];
  
  return (
    <section className="py-24 relative overflow-hidden bg-black/40">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How <span className="text-blue-400">StockLinker</span> Works</h2>
          <p className="text-xl text-gray-400">From order to analytics in one seamless flow</p>
        </motion.div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transform md:-translate-x-1/2" />
          
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative flex items-center mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} hidden md:block`}>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
              
              <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 z-10">
                <motion.div 
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50"
                  whileHover={{ scale: 1.2 }}
                >
                  {step.icon}
                </motion.div>
              </div>
              
              <div className="flex-1 ml-16 md:ml-0">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 md:hidden">
                  <h3 className="font-bold">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Route Management with Animated Map
const RouteManagement = () => {
  const { ref, isInView } = useScrollReveal();
  const [truckPosition, setTruckPosition] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setTruckPosition(prev => (prev + 1) % 100);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isInView]);
  
  const locations = ['Pattukkottai', 'Peravurani', 'Madukkur', 'Thanjavur'];
  const locationPositions = [10, 35, 60, 85];
  
  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Smart Route <span className="text-blue-400">Optimization</span></h2>
          <p className="text-xl text-gray-400">Pattukkottai → Peravurani → Madukkur → Thanjavur delivery route optimized automatically</p>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Animated Map */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-white/10 relative min-h-[400px]"
          >
            <div className="absolute inset-0 opacity-20 rounded-2xl overflow-hidden">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 40%, rgba(59,130,246,0.1) 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
            </div>
            
            {/* Route Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d={`M ${locationPositions[0]}% 60% L ${locationPositions[1]}% 45% L ${locationPositions[2]}% 55% L ${locationPositions[3]}% 40%`}
                stroke="rgba(59,130,246,0.5)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
              />
            </svg>
            
            {/* Locations */}
            {locations.map((loc, i) => (
              <motion.div
                key={loc}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${locationPositions[i]}%`, top: i === 1 ? '45%' : i === 2 ? '55%' : i === 3 ? '40%' : '60%' }}
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: i * 0.2 }}
              >
                <div className="relative">
                  <div className="w-4 h-4 bg-blue-500 rounded-full" />
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm font-medium bg-black/80 px-2 py-1 rounded">
                    {loc}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Moving Truck */}
            <motion.div
              className="absolute"
              style={{ 
                left: `${locationPositions[Math.floor(truckPosition / 25)]}%`, 
                top: truckPosition < 25 ? '60%' : truckPosition < 50 ? '45%' : truckPosition < 75 ? '55%' : '40%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <motion.div
                animate={{ x: [0, 5, -5, 0] }}
                transition={{ duration: 0.3, repeat: Infinity }}
              >
                <Truck size={32} className="text-blue-400" />
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Stats Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-2xl font-bold mb-4">Today's Route</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Retailers</span>
                <span className="text-2xl font-bold">18</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Distance</span>
                <span className="text-2xl font-bold">92km</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-400">Fuel Saved</span>
                <span className="text-2xl font-bold text-green-400">23%</span>
              </div>
            </div>
            <motion.div 
              className="mt-6 h-2 bg-white/10 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={isInView ? { width: '100%' } : {}}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={isInView ? { width: '77%' } : {}}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Order Management Component
const OrderManagement = () => {
  const { ref, isInView } = useScrollReveal();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    setTimeout(() => setOrderPlaced(false), 5000);
  };
  
  return (
    <section ref={ref} className="py-24 relative overflow-hidden bg-black/40">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Seamless <span className="text-blue-400">Order Management</span></h2>
          <p className="text-xl text-gray-400">Retailers place orders instantly, wholesalers receive them in real-time</p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Retailer Order Card */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <ShoppingCart size={20} className="text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Siva Stores</h3>
                  <p className="text-sm text-gray-400">Retailer Order</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                {['Aavin Milk × 20', 'Biscuits × 15', 'Soft Drinks × 10'].map((item, i) => (
                  <motion.div 
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: i * 0.1 }}
                    className="flex justify-between py-2 border-b border-white/10"
                  >
                    <span>{item}</span>
                    <span className="font-medium">₹{item.includes('Milk') ? '1,200' : item.includes('Biscuits') ? '750' : '6,500'}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-white/20">
                <span className="text-lg font-bold">Order Value</span>
                <span className="text-2xl font-bold text-blue-400">₹8,450</span>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold"
              >
                Place Order
              </motion.button>
            </motion.div>
            
            {/* Wholesaler Dashboard */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 relative"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Users size={20} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Wholesaler Dashboard</h3>
                  <p className="text-sm text-gray-400">Live Orders</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Order #SL-2044</span>
                    <span className="text-yellow-400">Processing</span>
                  </div>
                </div>
                <AnimatePresence>
                  {showNotification && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="p-3 bg-green-500/20 rounded-lg border border-green-500/30"
                    >
                      <div className="flex justify-between text-sm">
                        <span>Order #SL-2045</span>
                        <span className="text-green-400">New Order!</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Siva Stores • ₹8,450</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {orderPlaced && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2"
                >
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                  <div className="w-3 h-3 bg-green-500 rounded-full absolute top-0" />
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Delivery Tracking
const DeliveryTracking = () => {
  const { ref, isInView } = useScrollReveal();
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setProgress(prev => (prev + 1) % 101);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isInView]);
  
  const steps = ['Packed', 'Out For Delivery', 'Delivered'];
  const stepProgress = [33, 66, 100];
  
  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Live <span className="text-blue-400">Delivery Tracking</span></h2>
          <p className="text-xl text-gray-400">Order SL-2045 - Real-time status updates</p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          <div className="relative mb-12">
            {/* Progress Line */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Steps */}
            <div className="flex justify-between mt-4">
              {steps.map((step, i) => (
                <motion.div 
                  key={step}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.2 }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    progress >= stepProgress[i] ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-white/20'
                  }`}>
                    {progress >= stepProgress[i] ? <Check size={16} /> : <span className="text-sm">{i + 1}</span>}
                  </div>
                  <span className="text-sm">{step}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Map Pulse Animation */}
          <motion.div 
            className="relative h-[200px] bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl overflow-hidden"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800')] bg-cover bg-center opacity-30" />
            <motion.div 
              className="absolute w-4 h-4 bg-red-500 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Collection Management
const CollectionManagement = () => {
  const { ref, isInView } = useScrollReveal();
  const [collectionProgress, setCollectionProgress] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setCollectionProgress(prev => Math.min(prev + 1, 100));
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isInView]);
  
  return (
    <section ref={ref} className="py-24 relative overflow-hidden bg-black/40">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Smart <span className="text-blue-400">Collection Management</span></h2>
          <p className="text-xl text-gray-400">₹12,500 pending payment automatically tracked and reminded</p>
        </motion.div>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Outstanding Amount</h3>
              <span className="text-3xl font-bold text-yellow-400">₹12,500</span>
            </div>
            
            {/* Collection Progress */}
            <div className="space-y-4 mb-8">
              {['Reminder Sent', 'Collection Scheduled', 'Collected', 'Payment Received'].map((step, i) => (
                <motion.div 
                  key={step}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    collectionProgress >= (i + 1) * 25 ? 'bg-green-500' : 'bg-white/20'
                  }`}>
                    {collectionProgress >= (i + 1) * 25 ? <Check size={14} /> : null}
                  </div>
                  <span className={collectionProgress >= (i + 1) * 25 ? 'text-white' : 'text-gray-400'}>{step}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                style={{ width: `${collectionProgress}%` }}
              />
            </div>
            
            {/* Cash Flow Animation */}
            <motion.div 
              className="mt-8 p-4 bg-green-500/10 rounded-xl border border-green-500/20"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex justify-between items-center">
                <span>Cash Flow Status</span>
                <span className="text-green-400 font-bold">+28% this month</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Retailer Management
const RetailerManagement = () => {
  const { ref, isInView } = useScrollReveal();
  
  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4"><span className="text-blue-400">Retailer</span> Intelligence</h2>
          <p className="text-xl text-gray-400">Siva Stores ordered 48 times this month and has ₹5,200 outstanding</p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Retailer Profile */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold">
                  S
                </div>
                <div>
                  <h3 className="text-xl font-bold">Siva Stores</h3>
                  <p className="text-gray-400">Retailer since 2022</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: 'Monthly Orders', value: '48', trend: '+12%' },
                  { label: 'Revenue', value: '₹1.8L', trend: '+8%' },
                  { label: 'Pending Due', value: '₹5,200', trend: '-15%' },
                  { label: 'Last Visit', value: '2 Days Ago', trend: 'Kumar' }
                ].map((item, i) => (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: i * 0.1 }}
                    className="flex justify-between items-center py-2 border-b border-white/10"
                  >
                    <span className="text-gray-400">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.value}</span>
                      <span className={`text-xs ${item.trend.includes('+') ? 'text-green-400' : item.trend.includes('-') ? 'text-red-400' : 'text-blue-400'}`}>
                        {item.trend}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Health Score */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-bold mb-4">Retailer Health Score</h3>
              <div className="relative w-40 h-40 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                  <motion.circle 
                    cx="80" cy="80" r="70" fill="none" stroke="url(#healthGradient)" strokeWidth="12"
                    strokeDasharray="440"
                    initial={{ strokeDashoffset: 440 }}
                    animate={isInView ? { strokeDashoffset: 440 * (1 - 0.85) } : {}}
                    transition={{ duration: 1.5, delay: 0.3 }}
                  />
                  <defs>
                    <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">85%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-green-400">✓ High Performing Retailer</p>
                <p className="text-sm text-gray-400 mt-2">Assigned Sales Rep: Kumar</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Sales Representative Management
const SalesRepManagement = () => {
  const { ref, isInView } = useScrollReveal();
  const [visitProgress, setVisitProgress] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setVisitProgress(prev => Math.min(prev + 1, 75));
      }, 20);
      return () => clearInterval(interval);
    }
  }, [isInView]);
  
  return (
    <section ref={ref} className="py-24 relative overflow-hidden bg-black/40">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Sales Team <span className="text-blue-400">Performance</span></h2>
          <p className="text-xl text-gray-400">Real-time activity tracking for every sales representative</p>
        </motion.div>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-2xl font-bold">
                K
              </div>
              <div>
                <h3 className="text-2xl font-bold">Kumar</h3>
                <p className="text-gray-400">Senior Sales Representative</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: "Today's Visits", value: "12" },
                { label: "Completed", value: "9", color: "text-green-400" },
                { label: "Pending", value: "3", color: "text-yellow-400" },
                { label: "Revenue", value: "₹48,000", color: "text-blue-400" }
              ].map((item, i) => (
                <motion.div 
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 rounded-xl p-4 text-center"
                >
                  <div className="text-sm text-gray-400">{item.label}</div>
                  <div className={`text-2xl font-bold ${item.color || 'text-white'}`}>
                    {item.label === "Revenue" ? item.value : <AnimatedCounter value={item.value} duration={1.5} />}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Visit Progress</span>
                <span>{Math.round(visitProgress)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                  style={{ width: `${visitProgress}%` }}
                />
              </div>
            </div>
            
            {/* Live Activity Timeline */}
            <div className="mt-6 space-y-2">
              <p className="text-sm text-gray-400 mb-3">Live Activity</p>
              {['10:30 AM - Visited Siva Stores', '11:15 AM - Order collected from Ram Traders', '12:00 PM - Payment received from Krishna General Stores'].map((activity, i) => (
                <motion.div 
                  key={activity}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2 text-sm text-gray-300"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  {activity}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Inventory Management
const InventoryManagement = () => {
  const { ref, isInView } = useScrollReveal();
  
  const products = [
    { name: 'Aavin Milk', stock: 520, minLevel: 100, color: 'from-blue-500 to-cyan-500' },
    { name: 'Biscuits', stock: 850, minLevel: 200, color: 'from-orange-500 to-yellow-500' },
    { name: 'Soft Drinks', stock: 180, minLevel: 150, color: 'from-red-500 to-pink-500' }
  ];
  
  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Smart <span className="text-blue-400">Inventory Management</span></h2>
          <p className="text-xl text-gray-400">Real-time stock levels with automatic low stock alerts</p>
        </motion.div>
        
        <div className="max-w-2xl mx-auto space-y-6">
          {products.map((product, i) => (
            <motion.div 
              key={product.name}
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${product.color} flex items-center justify-center`}>
                    <Package size={16} />
                  </div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold"><AnimatedCounter value={product.stock} duration={1.5} /></div>
                  <div className="text-xs text-gray-400">units</div>
                </div>
              </div>
              
              <div className="relative">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full bg-gradient-to-r ${product.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${(product.stock / 1000) * 100}%` } : {}}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                  />
                </div>
                <div className="absolute -bottom-6 text-xs text-gray-400">
                  Minimum Level: {product.minLevel} units
                </div>
              </div>
              
              {product.stock < product.minLevel * 2 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  className="mt-8 p-2 bg-red-500/20 rounded-lg text-red-400 text-sm text-center"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ⚠️ Low Stock Alert! Only {product.stock} units remaining
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Marketplace Discovery
const MarketplaceDiscovery = () => {
  const { ref, isInView } = useScrollReveal();
  const [searchQuery, setSearchQuery] = useState('');
  const [connected, setConnected] = useState(false);
  
  const results = [
    { name: 'ABC Distributors', distance: '5km', products: 250, rating: 4.9, type: 'supplier' },
    { name: 'City Mart', distance: '8km', products: 180, rating: 4.7, type: 'buyer' }
  ];
  
  return (
    <section ref={ref} className="py-24 relative overflow-hidden bg-black/40">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Discover New <span className="text-blue-400">Suppliers & Buyers</span></h2>
          <p className="text-xl text-gray-400">Find and connect with business partners instantly</p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products or distributors..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-4">
            {results.map((result, i) => (
              <motion.div 
                key={result.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${result.type === 'supplier' ? 'from-blue-500 to-cyan-500' : 'from-green-500 to-emerald-500'} flex items-center justify-center`}>
                      <Users size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{result.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span>📍 {result.distance}</span>
                        <span>📦 {result.products} products</span>
                        <span>⭐ {result.rating}</span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConnected(true)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium"
                  >
                    Connect
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
          
          {connected && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-500/20 rounded-xl border border-green-500/30 text-center"
            >
              <span className="text-green-400">✓ Connection request sent! The distributor will be notified.</span>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

// Business Analytics
const BusinessAnalytics = () => {
  const { ref, isInView } = useScrollReveal();
  
  const metrics = [
    { label: 'Top Retailer', value: 'Siva Stores', subValue: '₹1.8L', icon: <ShoppingCart size={20} /> },
    { label: 'Top Route', value: 'Pattukkottai Route', subValue: '₹4.2L', icon: <Truck size={20} /> },
    { label: 'Top Product', value: 'Aavin Milk', subValue: '520 Units', icon: <Package size={20} /> },
    { label: 'Monthly Growth', value: '+38%', subValue: 'vs last month', icon: <TrendingUp size={20} /> }
  ];
  
  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Business <span className="text-blue-400">Analytics</span></h2>
          <p className="text-xl text-gray-400">Real-time insights that drive growth</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, i) => (
            <motion.div 
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  {metric.icon}
                </div>
                <motion.div 
                  className="text-2xl font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {metric.label === 'Monthly Growth' ? metric.value : null}
                </motion.div>
              </div>
              <h3 className="text-gray-400 text-sm">{metric.label}</h3>
              <div className="text-xl font-bold mt-1">{metric.value}</div>
              <div className="text-sm text-blue-400">{metric.subValue}</div>
            </motion.div>
          ))}
        </div>
        
        {/* Animated Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
        >
          <h3 className="text-lg font-semibold mb-4">Revenue Growth (Last 6 Months)</h3>
          <div className="flex items-end gap-3 h-48">
            {[65, 72, 68, 85, 92, 100].map((height, i) => (
              <motion.div 
                key={i}
                className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg"
                initial={{ height: 0 }}
                animate={isInView ? { height: `${height}%` } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Why StockLinker (Benefits)
const WhyStockLinker = () => {
  const { ref, isInView } = useScrollReveal();
  
  const benefits = [
    { title: 'Faster Orders', desc: 'Reduce order processing time by 80%', icon: <Zap size={28} />, color: 'from-yellow-500 to-orange-500' },
    { title: 'Smarter Routes', desc: 'Save up to 30% on fuel costs', icon: <MapPin size={28} />, color: 'from-green-500 to-emerald-500' },
    { title: 'Faster Collections', desc: 'Reduce payment cycles by 50%', icon: <CreditCard size={28} />, color: 'from-blue-500 to-cyan-500' },
    { title: 'Inventory Visibility', desc: 'Never run out of stock', icon: <Package size={28} />, color: 'from-purple-500 to-pink-500' },
    { title: 'Retailer Growth', desc: 'Increase repeat orders by 65%', icon: <Users size={28} />, color: 'from-red-500 to-rose-500' },
    { title: 'Data Driven Decisions', desc: 'Real-time analytics for growth', icon: <BarChart3 size={28} />, color: 'from-indigo-500 to-purple-500' }
  ];
  
  return (
    <section ref={ref} className="py-24 relative overflow-hidden bg-black/40">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why <span className="text-blue-400">StockLinker</span></h2>
          <p className="text-xl text-gray-400">Everything you need to scale your distribution business</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div 
              key={benefit.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${benefit.color} flex items-center justify-center mx-auto mb-4`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Product Showcase
const ProductShowcase = () => {
  const { ref, isInView } = useScrollReveal();
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  const tabs = ['Dashboard', 'Orders', 'Routes', 'Collections', 'Inventory', 'Marketplace', 'Analytics'];
  
  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">One Platform.<span className="text-blue-400"> Endless Possibilities</span></h2>
          <p className="text-xl text-gray-400">Everything you need in a single, unified dashboard</p>
        </motion.div>
        
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map(tab => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>
        
        {/* Laptop Mockup */}
        <div className="relative max-w-5xl mx-auto">
          <div className="bg-gray-800 rounded-t-2xl p-2">
            <div className="flex gap-1.5 px-3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            whileHover={{ rotateX: 5, rotateY: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-b-2xl p-6 border border-white/10"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Dashboard Preview */}
            <div className="aspect-video bg-black/40 rounded-xl p-4">
              <div className="grid grid-cols-4 gap-4 mb-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-20 bg-white/5 rounded-lg animate-pulse" />
                ))}
              </div>
              <div className="h-32 bg-white/5 rounded-lg mb-4 animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-24 bg-white/5 rounded-lg animate-pulse" />
              </div>
            </div>
          </motion.div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gray-700 rounded-full" />
        </div>
      </div>
    </section>
  );
};

// Testimonials (Infinite Scroll)
const Testimonials = () => {
  const testimonials = [
    { name: 'Rajesh Kumar', role: 'Wholesaler, Chennai', text: 'StockLinker transformed our distribution. We saved 30% on fuel costs and increased revenue by 45%.', rating: 5 },
    { name: 'Siva Priya', role: 'Retailer, Madurai', text: 'Ordering is now instant. No more WhatsApp confusion. My business has grown 60% since joining.', rating: 5 },
    { name: 'Karthik S.', role: 'Sales Rep, Coimbatore', text: 'I can track all my visits and collections in real-time. Best tool for sales teams.', rating: 5 },
    { name: 'Meena L.', role: 'Distributor, Trichy', text: 'The marketplace helped us find 50+ new retailers. Game changer!', rating: 5 },
    { name: 'Anand V.', role: 'Operations Head', text: 'Route optimization alone paid for the platform in 2 months. Incredible ROI.', rating: 5 }
  ];
  
  return (
    <section className="py-24 relative overflow-hidden bg-black/40">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted by <span className="text-blue-400">Thousands</span></h2>
          <p className="text-xl text-gray-400">What our customers say about StockLinker</p>
        </motion.div>
        
        <div className="relative overflow-hidden">
          <div className="flex gap-6 animate-infinite-scroll">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="min-w-[300px] md:min-w-[400px] bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-300 mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-sm font-bold">{t.name[0]}</span>
                  </div>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-sm text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes infinite-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 30s linear infinite;
          display: flex;
          width: fit-content;
        }
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

// Pricing
const Pricing = () => {
  const { ref, isInView } = useScrollReveal();
  const [billing, setBilling] = useState('monthly');
  
  const plans = [
    { name: 'Starter', price: { monthly: 49, yearly: 39 }, features: ['Up to 100 orders/day', 'Basic route planning', 'Order management', 'Email support'], popular: false },
    { name: 'Growth', price: { monthly: 99, yearly: 79 }, features: ['Up to 500 orders/day', 'Smart route optimization', 'Collection management', 'Sales rep tracking', 'Priority support'], popular: true },
    { name: 'Enterprise', price: { monthly: 249, yearly: 199 }, features: ['Unlimited orders', 'AI route optimization', 'Marketplace access', 'Advanced analytics', '24/7 dedicated support', 'Custom integrations'], popular: false }
  ];
  
  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, <span className="text-blue-400">Transparent Pricing</span></h2>
          <p className="text-xl text-gray-400">Choose the plan that fits your business</p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className={billing === 'monthly' ? 'text-white' : 'text-gray-400'}>Monthly</span>
            <button 
              onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-7 bg-white/20 rounded-full transition-colors"
            >
              <motion.div 
                className="absolute top-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                animate={{ x: billing === 'monthly' ? 4 : 32 }}
              />
            </button>
            <span className={billing === 'yearly' ? 'text-white' : 'text-gray-400'}>Yearly <span className="text-green-400 text-sm">Save 20%</span></span>
          </div>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border ${
                plan.popular ? 'border-blue-500 shadow-xl shadow-blue-500/20' : 'border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-xs font-semibold">
                  POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">${billing === 'monthly' ? plan.price.monthly : plan.price.yearly}</span>
                <span className="text-gray-400">/{billing === 'monthly' ? 'month' : 'month'}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-center gap-2 text-gray-300">
                    <Check size={16} className="text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-xl font-semibold ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'border border-white/20 text-white hover:bg-white/5'
                }`}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// FAQ Section
const FAQ = () => {
  const { ref, isInView } = useScrollReveal();
  const [openIndex, setOpenIndex] = useState(null);
  
  const faqs = [
    { q: 'How does StockLinker integrate with my existing systems?', a: 'StockLinker offers REST APIs and webhooks for seamless integration with your existing ERP, accounting software, and other business tools.' },
    { q: 'Can I use StockLinker on mobile devices?', a: 'Yes! StockLinker offers dedicated mobile apps for retailers, sales representatives, and delivery personnel on both iOS and Android.' },
    { q: 'Is there a setup fee?', a: 'No setup fees. You can start with a free trial and upgrade anytime. Our team provides free onboarding support.' },
    { q: 'How secure is my data?', a: 'We use bank-level encryption, regular security audits, and comply with industry standards. Your data is always safe with us.' },
    { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription anytime. No long-term contracts or hidden fees.' }
  ];
  
  return (
    <section ref={ref} className="py-24 relative overflow-hidden bg-black/40">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked <span className="text-blue-400">Questions</span></h2>
          <p className="text-xl text-gray-400">Everything you need to know about StockLinker</p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-4 flex justify-between items-center text-left"
              >
                <span className="font-semibold">{faq.q}</span>
                <ChevronDown className={`transform transition-transform ${openIndex === i ? 'rotate-180' : ''}`} size={20} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4 text-gray-400"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Final CTA
const FinalCTA = () => {
  const mousePosition = useMousePosition();
  
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
      <motion.div 
        className="absolute w-[600px] h-[600px] rounded-full bg-blue-500/30 blur-[100px] pointer-events-none"
        animate={{ x: mousePosition.x - 300, y: mousePosition.y - 300 }}
        transition={{ type: 'spring', stiffness: 50, damping: 30 }}
      />
      
      <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Everything Your Distribution Business Needs<br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">In One Platform</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          Orders, Routes, Collections, Inventory, Retailers, Marketplace, Analytics
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2"
          >
            Start Free Trial <ArrowRight size={18} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl border border-white/20 text-white font-semibold text-lg hover:bg-white/5 transition-all"
          >
            Book Demo
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  const columns = {
    Product: ['Features', 'Pricing', 'Integrations', 'Roadmap'],
    Solutions: ['Wholesalers', 'Distributors', 'Retailers', 'Sales Teams'],
    Marketplace: ['Suppliers', 'Buyers', 'Categories', 'Partners'],
    Resources: ['Blog', 'Guides', 'Webinars', 'Support'],
    Company: ['About', 'Careers', 'Press', 'Contact'],
    Legal: ['Privacy', 'Terms', 'Security', 'GDPR']
  };
  
  return (
    <footer className="bg-black/80 border-t border-white/10 py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {Object.entries(columns).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 md:mb-0">
            StockLinker
          </div>
          
          <div className="flex gap-6 mb-4 md:mb-0">
            <SocialIcon icon={<FaFacebook size={18} />} />
            <SocialIcon icon={<FaTwitter size={18} />} />
            <SocialIcon icon={<FaLinkedin size={18} />} />
            <SocialIcon icon={<FaInstagram size={18} />} />
            <SocialIcon icon={<FaYoutube size={18} />} />
          </div>
          
          <div className="flex gap-4">
            <input 
              type="email" 
              placeholder="Your email" 
              className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 text-sm"
            />
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-sm font-medium">
              Subscribe
            </button>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-sm mt-8">
          © 2024 StockLinker. All rights reserved. The complete distribution ecosystem.
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }) => (
  <motion.a 
    whileHover={{ scale: 1.1, y: -2 }}
    href="#" 
    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all"
  >
    {icon}
  </motion.a>
);

// Main App Component
const StockLinkerLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-black text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <RouteManagement />
      <OrderManagement />
      <DeliveryTracking />
      <CollectionManagement />
      <RetailerManagement />
      <SalesRepManagement />
      <InventoryManagement />
      <MarketplaceDiscovery />
      <BusinessAnalytics />
      <WhyStockLinker />
      <ProductShowcase />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default StockLinkerLanding;