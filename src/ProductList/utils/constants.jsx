export const typographyStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@400;600;700;800&display=swap');
  
  .font-sora { font-family: 'Sora', sans-serif; }
  .font-inter { font-family: 'Inter', sans-serif; }
  
  body { 
    background-color: #F8FAFC; 
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }

  .table-header-shadow {
    box-shadow: 0 4px 20px -10px rgba(15,23,42,0.05);
  }
`;

export const DEFAULT_FILTERS = { 
  category: 'all', 
  brand: 'all', 
  availability: 'all', 
  sortPrice: 'none', 
  sortStock: 'none' 
};