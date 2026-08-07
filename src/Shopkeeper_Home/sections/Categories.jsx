import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, PackageSearch } from 'lucide-react';
import { useQuery } from '@tanstack/react-query'; 
import { SectionHead } from '../../Layout/common';
import { categoryApi } from '../Services/api';

const localImages = import.meta.glob(
  "../../assets/categories/*", 
  { eager: true, import: "default" }
);

const getImageUrl = (imageName) => {
  if (!imageName) return null;
  if (imageName.startsWith('http')) return imageName;
  return localImages[`../../assets/categories/${imageName}`] || null;
};

// ============================================================
// ✅ PREMIUM SKELETON LOADER
// ============================================================
const CategorySkeleton = () => (
  <div className="w-[120px] xs:w-[130px] md:w-auto animate-pulse rounded-[16px] md:rounded-[24px] bg-white border border-slate-100 p-2 sm:p-2.5 shadow-sm">
    <div className="w-full h-[60px] md:h-[78px] rounded-[12px] md:rounded-[18px] bg-slate-200/80 mb-2 md:mb-3" />
    <div className="h-2.5 md:h-3 w-3/4 bg-slate-200/80 rounded-full mb-1.5 md:mb-2 mx-auto" />
    <div className="h-3.5 md:h-4 w-1/2 bg-emerald-50 rounded-full mx-auto mt-1 md:mt-2" />
  </div>
);

export default function Categories({ onError }) {
  const navigate = useNavigate();

  const { 
    data: categories = [], 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['homeCategoriesList'],
    queryFn: async () => {
      return await categoryApi.getAllCategories();
    },
    staleTime: 10 * 60 * 1000, // Keep fresh for 10 minutes
  });

  useEffect(() => {
    if (isError && onError) {
      onError();
    }
  }, [isError, onError]);

  const handleCategoryClick = (categoryId) => {
    navigate('/category', { state: { selectedCategoryId: categoryId } });
  };

  return (
    <section className="my-8 w-full overflow-hidden md:overflow-visible px-1 md:px-0">
      <SectionHead
        title="Product Categories"
        sub="Browse wholesale products by category"
        action="View All"
        actionPath="/category"
      />

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-rows-2 grid-flow-col overflow-x-auto no-scrollbar md:grid-rows-none md:grid-flow-row md:grid-cols-4 lg:grid-cols-6 gap-3 pb-4 md:pb-0 pt-1 md:pt-0"
          >
            {[...Array(12)].map((_, i) => <CategorySkeleton key={i} />)}
          </motion.div>
        )}

        {!isLoading && categories.length === 0 && !isError && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-12 rounded-[24px] bg-gradient-to-b from-white to-slate-50 border border-slate-200 shadow-sm relative overflow-hidden text-center"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 opacity-20" />
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-5 relative">
              <div className="absolute inset-0 bg-slate-100/50 rounded-2xl animate-pulse" />
              <LayoutGrid className="w-8 h-8 text-slate-300 relative z-10" />
            </div>
            <h3 className="text-[18px] font-sora font-extrabold text-slate-800 mb-2 tracking-tight">No Categories Found</h3>
            <p className="text-[14px] font-inter text-slate-500 max-w-sm leading-relaxed">
              We are currently updating our inventory mapping. Check back soon for new wholesale categories!
            </p>
          </motion.div>
        )}

        {!isLoading && categories.length > 0 && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
                className="group relative overflow-hidden rounded-[16px] md:rounded-[24px] bg-white border border-slate-200/80 p-2 md:p-2.5 shadow-[0_8px_25px_rgba(15,23,42,.06)] hover:border-pink-200 hover:shadow-[0_22px_55px_rgba(236,72,153,.16)] transition-all duration-200 focus:outline-none w-[120px] xs:w-[130px] md:w-full flex flex-col items-center"
              >
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
                  
                  <p className="w-full text-center text-[11px] md:text-xs font-sora font-bold text-slate-800 tracking-tight truncate px-1 group-hover:text-pink-600 transition-colors">
                    {cat.name}
                  </p>
                  
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