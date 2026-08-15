import React, { useState } from 'react';
import { getSubcategoryImageUrl } from '../utils/imageUtils';

export function ProductCard({ subcategory, gradient, onClick }) {
  const { name, imageName } = subcategory;
  const [imgError, setImgError] = useState(false);
  const initials = name ? name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() : "CT";
  const [from, to] = gradient;
  const imageUrl = getSubcategoryImageUrl(imageName);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-2.5 lg:gap-4 lg:rounded-[20px] lg:border lg:border-gray-300/60 lg:bg-white lg:p-4 text-center transition-all duration-300 ease-out lg:hover:-translate-y-1 lg:hover:border-pink-200 lg:hover:shadow-[0_12px_24px_-8px_rgba(236,72,153,0.12)] focus:outline-none"
    >
      <span className="relative flex h-[85px] w-[100px] sm:h-20 sm:w-20 lg:h-24 lg:w-24 items-center justify-center">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            onError={() => setImgError(true)}
            className="h-full w-full rounded-[16px] lg:rounded-2xl object-cover shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] lg:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out group-hover:scale-[1.05] bg-gray-50 border border-gray-100"
            alt={name}
          />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center rounded-[16px] lg:rounded-2xl text-[15px] lg:text-xl font-bold text-white shadow-sm transition-transform duration-300 ease-out group-hover:scale-[1.05]"
            style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
          >
            {initials}
          </span>
        )}
      </span>
      <span className="line-clamp-2 text-[12px] sm:text-[13px] lg:text-[14px] font-semibold leading-snug tracking-tight text-gray-800 lg:text-gray-900 transition-colors duration-200 group-hover:text-pink-600 px-1">
        {name}
      </span>
    </button>
  );
}