export const C = {
  gradientCTA: "linear-gradient(to right, #EC4899, #F43F5E, #F97316)",
  bg: '#F8FAFC',
  border: 'rgba(15,23,42,0.08)',
  primary: '#0F172A',
  softSurface: '#FDFDFE',
};

export const inr = (n) => n != null ? `₹${Number(n).toLocaleString("en-IN")}` : '₹0';

export const typographyStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@400;600;700;800&display=swap');
  .font-sora { font-family: 'Sora', sans-serif; }
  .font-inter { font-family: 'Inter', sans-serif; }
  body { 
    background-color: ${C.bg}; 
    -webkit-font-smoothing: antialiased;
  }
  .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #CBD5E1 transparent; }
  .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: #F8FAFC; border-radius: 12px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #CBD5E1; border-radius: 12px; border: 2px solid #F8FAFC; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94A3B8; }
  .table-header-shadow { box-shadow: 0 4px 20px -10px rgba(15,23,42,0.1); }
  
  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  input[type=number] { -moz-appearance: textfield; }
`;

export const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};