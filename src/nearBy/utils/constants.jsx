export const CTA_GRAD = 'linear-gradient(to right, #EC4899, #F43F5E, #F97316)';

export const DISTRICT_CENTERS = {
  "Chennai": [13.0827, 80.2707],
  "Salem": [11.6643, 78.1460],
  "Coimbatore": [11.0168, 76.9558],
  "Pudukottai": [10.3797, 78.8205],
  "Thiruvarur": [10.7725, 79.6363]
};

export const fadeUp = (delay = 0) => ({ 
  initial: { opacity: 0, y: 15 }, 
  animate: { opacity: 1, y: 0 }, 
  transition: { duration: 0.3, delay } 
});