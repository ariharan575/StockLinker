import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, AlertCircle } from 'lucide-react';
import { SectionHead } from '../../Layout/common';
import { categoryApi } from '../Services/api';

// Dynamically import local images as a fallback if you are using local assets
const localImages = import.meta.glob(
  "../../assets/categories/*", 
  { eager: true, import: "default" }
);

const getImageUrl = (imageName) => {
  if (!imageName) return null;
  if (imageName.startsWith('http')) return imageName;
  // Make sure this path exactly matches the glob pattern above
  return localImages[`../../assets/categories/${imageName}`] || null;
};

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await categoryApi.getAllCategories();
        if (isMounted) {
          setCategories(data);
        }
      } catch (err) {
        if (isMounted) setError("Failed to load categories");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategoryClick = (categoryId) => {
    // ⬇️ THIS IS THE FIX: Passes the ID silently in memory. URL stays exactly '/category'
    navigate('/category', { state: { selectedCategoryId: categoryId } });
  };

  return (
    <section className="my-8 w-full overflow-hidden md:overflow-visible px-1 md:px-0">
      <SectionHead
        title="Product Categories"
        sub="Browse wholesale products by category"
        action="View All"
      />

      <AnimatePresence mode="wait">
        {/* LOADING STATE (SKELETONS) */}
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // Mobile: 2-row horizontal scroll | Desktop: Standard wrapping grid
            className="grid grid-rows-2 grid-flow-col overflow-x-auto no-scrollbar md:grid-rows-none md:grid-flow-row md:grid-cols-4 lg:grid-cols-6 gap-3 pb-4 md:pb-0 pt-1 md:pt-0"
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-[120px] xs:w-[130px] md:w-auto animate-pulse rounded-[16px] md:rounded-[24px] bg-white border border-slate-100 p-2 sm:p-2.5 shadow-sm"
              >
                <div className="w-full h-[60px] md:h-[78px] rounded-[12px] md:rounded-[18px] bg-slate-200 mb-2 md:mb-3" />
                <div className="h-2.5 md:h-3 w-3/4 bg-slate-200 rounded-full mb-1.5 md:mb-2 mx-auto" />
                <div className="h-3.5 md:h-4 w-1/2 bg-emerald-50 rounded-full mx-auto mt-1 md:mt-2" />
              </div>
            ))}
          </motion.div>
        )}

        {/* ERROR STATE */}
        {!isLoading && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-8 rounded-[24px] border border-rose-100 bg-rose-50/50"
          >
            <AlertCircle className="w-8 h-8 text-rose-400 mb-3" />
            <p className="text-sm font-sora font-semibold text-rose-600 mb-1">Oops! Something went wrong.</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-xs font-inter text-rose-500 hover:text-rose-700 underline underline-offset-2 transition-colors"
            >
              Try refreshing the page
            </button>
          </motion.div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !error && categories.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-12 rounded-[24px] border-2 border-dashed border-slate-200 bg-white"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
              <LayoutGrid className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-base font-sora font-bold text-slate-800 mb-1">No Categories Found</h3>
            <p className="text-sm font-inter text-slate-500 text-center max-w-sm">
              We are currently updating our inventory. Check back soon for new wholesale categories!
            </p>
          </motion.div>
        )}

        {/* SUCCESS DATA RENDERING */}
        {!isLoading && !error && categories.length > 0 && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            // Mobile: 2-row horizontal scroll | Desktop: Standard wrapping grid exactly as your original
            className="grid grid-rows-2 grid-flow-col overflow-x-auto no-scrollbar md:grid-rows-none md:grid-flow-row md:grid-cols-4 lg:grid-cols-6 gap-3 pb-4 md:pb-0 pt-1 md:pt-0"
          >
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -7, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                // Fixed width on mobile, auto fluid width on desktop
                className="group relative overflow-hidden rounded-[16px] md:rounded-[24px] bg-white border border-slate-200/80 p-2 md:p-2.5 shadow-[0_8px_25px_rgba(15,23,42,.06)] hover:border-pink-200 hover:shadow-[0_22px_55px_rgba(236,72,153,.16)] transition-all duration-200 focus:outline-none w-[120px] xs:w-[130px] md:w-full flex flex-col items-center"
              >
                {/* Premium Hover Background Gradient */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-pink-50/80 via-transparent to-rose-50/70 transition-opacity duration-200" />
                
                <div className="relative z-10 w-full flex flex-col items-center">
                  <div className="w-full h-[60px] md:h-[78px] rounded-[12px] md:rounded-[18px] overflow-hidden bg-slate-100 border border-slate-100 mb-2 md:mb-3 shadow-sm flex items-center justify-center">
                    {getImageUrl(cat.imageName) ? (
                      <img
                        src={getImageUrl(cat.imageName)}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <LayoutGrid className="w-6 h-6 md:w-8 md:h-8 text-slate-300" />
                    )}
                    <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/20 to-transparent mix-blend-overlay" />
                  </div>
                  
                  {/* Category Name with Premium SaaS Font */}
                  <p className="w-full text-center text-[11px] md:text-xs font-sora font-bold text-slate-800 tracking-tight truncate px-1 group-hover:text-pink-600 transition-colors">
                    {cat.name}
                  </p>
                  
                  {/* Supplier Count Badge */}
                  <span className="inline-flex mt-1 md:mt-2 rounded-full px-2 md:px-2.5 py-[2px] md:py-[3px] text-[9px] md:text-[10px] font-inter font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:bg-emerald-100 transition-colors whitespace-nowrap">
                    {cat.sellerCount || 0} suppliers
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
}