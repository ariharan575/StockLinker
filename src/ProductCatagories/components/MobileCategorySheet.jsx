import React from 'react';
import * as FiIcons from "react-icons/fi";
import { FiX, FiChevronRight } from "react-icons/fi";
import { Scrollbar } from './Scrollbar';

export function MobileCategorySheet({ isOpen, onClose, categories, activeId, onSelect, matchCounts, hasSearch }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full h-[70vh] bg-white rounded-t-[24px] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out translate-y-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-[16px] font-bold text-gray-900">All Categories</h3>
          <button onClick={onClose} className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100">
            <FiX className="h-5 w-5" />
          </button>
        </div>
        
        <Scrollbar className="flex-1 px-4 py-3">
          <ul className="flex flex-col space-y-1 pb-10">
            {categories.map(category => {
              const Icon = FiIcons[category.icon] || FiIcons.FiGrid;
              const isActive = category.id === activeId;
              const matchCount = matchCounts[category.id] || 0;
              
              return (
                <li key={category.id}>
                  <button
                    onClick={() => {
                      onSelect(category.id);
                      onClose();
                    }}
                    className={`flex w-full items-center gap-4 rounded-xl p-3 text-left transition-colors ${isActive ? 'bg-pink-50' : 'active:bg-gray-50'}`}
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isActive ? 'bg-pink-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="flex-1">
                      <span className={`block text-[15px] ${isActive ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                        {category.name}
                      </span>
                      {hasSearch && (
                        <span className="block text-[12px] font-medium text-pink-600 mt-0.5">
                          {matchCount} match{matchCount === 1 ? "" : "es"}
                        </span>
                      )}
                    </span>
                    {isActive && <FiChevronRight className="h-5 w-5 text-pink-500" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </Scrollbar>
      </div>
    </div>
  );
}