export const PRODUCT = {
  name: "Samsung Galaxy S25 Ultra 5G",
  recommended: 67499,
};

export const SUPPLIERS = [
  { id: 1, name: 'ABC Wholesale', initials: 'ABC', verified: true, location: 'Chennai, TN', moq: 5, moqUnit: 'Units', moqPrice: 67499, stock: 840, stockUnit: 'Units', bulkDeal: { qty: 100, price: 64500, saving: 2999 }, rating: 4.9, reviews: 245, delivery: '2 Days', score: 96, badge: 'BEST DEAL' },
  { id: 2, name: 'XYZ Traders', initials: 'XYZ', verified: true, location: 'Mumbai, MH', moq: 10, moqUnit: 'Units', moqPrice: 68299, stock: 320, stockUnit: 'Units', bulkDeal: { qty: 50, price: 66800, saving: 1499 }, rating: 4.8, reviews: 198, delivery: '3 Days', score: 92, badge: null },
  { id: 3, name: 'PQR Distributors', initials: 'PQR', verified: false, location: 'Delhi, DL', moq: 20, moqUnit: 'Units', moqPrice: 69250, stock: 1200, stockUnit: 'Units', bulkDeal: { qty: 200, price: 65000, saving: 4250 }, rating: 4.7, reviews: 162, delivery: '2 Days', score: 89, badge: 'FAST DELIVERY' },
  { id: 4, name: 'Global Mobile Hub', initials: 'GM', verified: false, location: 'Bengaluru, KA', moq: 5, moqUnit: 'Units', moqPrice: 70499, stock: 55, stockUnit: 'Units', bulkDeal: { qty: 100, price: 67999, saving: 2500 }, rating: 4.6, reviews: 134, delivery: '4 Days', score: 86, badge: null },
  { id: 5, name: 'Superb Deals', initials: 'SD', verified: true, location: 'Hyderabad, TS', moq: 10, moqUnit: 'Units', moqPrice: 71999, stock: 200, stockUnit: 'Units', bulkDeal: { qty: 50, price: 69999, saving: 2000 }, rating: 4.5, reviews: 111, delivery: '3 Days', score: 82, badge: null },
  { id: 6, name: 'Metro Electronics', initials: 'ME', verified: true, location: 'Pune, MH', moq: 15, moqUnit: 'Units', moqPrice: 68500, stock: 430, stockUnit: 'Units', bulkDeal: { qty: 150, price: 66000, saving: 2500 }, rating: 4.9, reviews: 312, delivery: '2 Days', score: 94, badge: null },
  { id: 7, name: 'Tech Vision', initials: 'TV', verified: true, location: 'Kolkata, WB', moq: 5, moqUnit: 'Units', moqPrice: 67900, stock: 80, stockUnit: 'Units', bulkDeal: { qty: 50, price: 66500, saving: 1400 }, rating: 4.7, reviews: 145, delivery: '4 Days', score: 88, badge: null },
  { id: 8, name: 'Prime Suppliers', initials: 'PS', verified: false, location: 'Surat, GJ', moq: 25, moqUnit: 'Units', moqPrice: 69000, stock: 1500, stockUnit: 'Units', bulkDeal: { qty: 500, price: 64000, saving: 5000 }, rating: 4.6, reviews: 98, delivery: '5 Days', score: 85, badge: null },
  { id: 9, name: 'Alpha Connect', initials: 'AC', verified: true, location: 'Ahmedabad, GJ', moq: 10, moqUnit: 'Units', moqPrice: 68800, stock: 210, stockUnit: 'Units', bulkDeal: { qty: 100, price: 65900, saving: 2900 }, rating: 4.8, reviews: 267, delivery: '3 Days', score: 91, badge: null },
  { id: 10, name: 'Omega Trading', initials: 'OT', verified: true, location: 'Noida, UP', moq: 5, moqUnit: 'Units', moqPrice: 69999, stock: 45, stockUnit: 'Units', bulkDeal: { qty: 50, price: 68000, saving: 1999 }, rating: 4.4, reviews: 76, delivery: '2 Days', score: 80, badge: null },
];

export const SUPPLIER_DETAILS = {
  1: { businessType: 'Wholesaler', experience: '8+ Years', gst: '33ABCDE1234F1Z5', responseRate: '98%', orders: '2,450+', onTime: '96%', terms: 'Advance / COD / Net 15', warranty: '1 Year Brand Warranty', kyc: true, gstVerified: true, bizVerified: true, phone: '+91 98765 43210' },
  2: { businessType: 'Distributor', experience: '6+ Years', gst: '27XYZTR5678G2A1', responseRate: '95%', orders: '1,820+', onTime: '94%', terms: 'Advance / Net 30', warranty: '1 Year Brand Warranty', kyc: true, gstVerified: true, bizVerified: true, phone: '+91 98765 43211' },
};
// Default fallback for others...
for (let i = 3; i <= 10; i++) {
  SUPPLIER_DETAILS[i] = SUPPLIER_DETAILS[1];
}

export const COL_HEADERS = [
  { label: '#', w: 'w-[60px]' },
  { label: 'Supplier', w: 'w-[280px]' },
  { label: 'Location', w: 'w-[150px]' },
  { label: 'MOQ', w: 'w-[160px]' },
  { label: 'Your Quantity', w: 'w-[160px]' },
  { label: 'Bulk Deal', w: 'w-[160px]' },
  { label: 'Rating', w: 'w-[120px]' },
  { label: 'Delivery', w: 'w-[130px]' },
  { label: 'Score', w: 'w-[100px]' },
  { label: 'Available Stock', w: 'w-[140px]' },
  { label: 'Actions', w: 'w-[240px] text-right' },
];

export const FILTER_OPTS = ['Location', 'Seller Type', 'MOQ', 'Delivery', 'Rating', 'Price Range'];
export const SORT_OPTS = ['Lowest Price', 'Best Value', 'Nearest Seller', 'Fast Delivery'];