import React from 'react';

export function LoadingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1920px] px-4 flex flex-col gap-4 lg:gap-8 min-h-screen bg-[#FAFAFA] pt-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between w-full mb-2">
        <div className="flex flex-col gap-2 w-full lg:w-1/3">
          <div className="h-8 lg:h-10 bg-gray-200/80 rounded-xl w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200/80 rounded-lg w-1/2 animate-pulse"></div>
        </div>
        <div className="h-12 bg-gray-200/80 rounded-xl w-full lg:w-[320px] animate-pulse"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative items-start pb-12">
        <div className="flex-1 w-full bg-white lg:rounded-[24px] lg:border lg:border-gray-200/80 lg:shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] lg:overflow-hidden lg:p-6">
          <div className="hidden lg:flex justify-between items-center mb-6">
             <div className="h-6 bg-gray-200/80 rounded-lg w-1/4 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="h-[85px] w-[100px] sm:h-20 sm:w-20 lg:h-24 lg:w-24 bg-gray-200/80 rounded-[16px] lg:rounded-2xl animate-pulse"></div>
                <div className="h-3 bg-gray-200/80 rounded-md w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex flex-col w-[300px] xl:w-[320px] shrink-0 bg-white rounded-[24px] border border-gray-200/80 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] p-3">
          <div className="h-5 w-24 bg-gray-200/80 rounded-md mb-4 mx-2 mt-2 animate-pulse"></div>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
              <div className="h-8 w-8 rounded-lg bg-gray-200/80 shrink-0 animate-pulse"></div>
              <div className="h-4 bg-gray-200/80 rounded-md w-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}