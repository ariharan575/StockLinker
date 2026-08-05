import React from "react";
import { Inbox, Plus } from "lucide-react";

export default function EmptyState({ 
  title = "No active records", 
  description = "New data will appear here once available. Get started by creating your first entry.", 
  icon,
  actionLabel = "Create New Record",
  onAction
}) {
  return (
    <div className="group relative w-full overflow-hidden rounded-3xl border border-gray-100 bg-white p-10 sm:p-16 shadow-[0_8px_40px_rgb(0,0,0,0.03)] transition-all hover:shadow-[0_16px_60px_rgb(0,0,0,0.06)]">
      
      {/* Subtle Premium Background Mesh matching the Pink/Gray theme */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-50/50 via-white to-white opacity-80"></div>
      
      {/* Decorative background grid to match the dashboard aesthetic */}
      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNlNWE3ZWIiLz48L3N2Zz4=')] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] opacity-30"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* High-Contrast Icon Treatment (Black & Pink) */}
        <div className="relative mb-8">
          {/* Animated Pink Glow Behind Icon */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-pink-500 to-gray-800 opacity-20 blur-xl transition duration-700 group-hover:opacity-40 group-hover:duration-200"></div>
          
          {/* Dark Icon Container (Ties into your dark sidebar) */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.25rem] bg-gray-900 shadow-2xl ring-1 ring-white/10 sm:h-24 sm:w-24">
            {icon || <Inbox className="h-10 w-10 text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.4)] transition-transform duration-500 ease-out group-hover:scale-110" strokeWidth={1.5} />}
          </div>
        </div>

        {/* Crisp Typography */}
        <h3 className="font-sora mb-3 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
          {title}
        </h3>
        
        <p className="max-w-md text-sm leading-relaxed text-gray-500 sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}