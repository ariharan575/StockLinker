export const STEPS = [
  "Business",
  "Address",
  "Marketplace",
  "Complete",
];

export const WHOLESALER_CATEGORIES = [
  "Groceries",
  "Beverages",
  "Vegetables",
  "Electronics",
  "Pharmacy",
  "Stationery",
  "Snacks",
  "Dairy",
];

export const SHOPKEEPER_CATEGORIES = [
  "Groceries",
  "Daily Essentials",
  "Cleaning Items",
  "Snacks",
  "Beverages",
  "Stationery",
  "Personal Care",
  "Frozen Foods",
  "Electronics",
  "HardWare",
];

export const STORE_TYPES = [
  "Small Shop",
  "Mini Market",
  "Supermarket",
  "Wholesale Retail",
];

export const DELIVERY_OPTIONS = [
  "Yes, We Deliver",
  "No Delivery",
];

export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.55,
      ease: "easeOut",
    },
  }),
};