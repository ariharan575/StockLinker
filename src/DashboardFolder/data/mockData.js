export const WHOLESALE_DEALS_M = [
  { id: 1, name: "India Gate Basmati Rice", pack: "25kg", price: "₹1,250", oldPrice: "₹1,450", save: "₹200", supplier: "Sri Murugan Traders", rating: "4.8", stock: 45 },
  { id: 2, name: "Sunlite Sunflower Oil", pack: "15L", price: "₹1,840", oldPrice: "₹1,990", save: "₹150", supplier: "Kamar Wholesaler", rating: "4.6", stock: 12 },
  { id: 3, name: "Parle-G Gold Biscuits", pack: "1kg x 12", price: "₹720", oldPrice: "₹840", save: "₹120", supplier: "ABC Distributors", rating: "4.9", stock: 88 }
];

export const RECENT_ORDERS_M = [
  { id: "SL-3225", items: "Aashirvaad Atta 10kg x 5", status: "Out for Delivery", eta: "Today, 4:30 PM", cost: "₹2,450" },
  { id: "SL-3224", items: "Sunlite Oil 15L x 2", status: "Delivered", eta: "Delivered 11 May", cost: "₹3,680" }
];

export const LOW_STOCK_ITEMS_M = [
  { id: "LS-1", name: "Maggi Noodles 70g", stock: 12, predictedExhaustion: "2 Days", margin: "+14%" },
  { id: "LS-2", name: "Tata Tea Premium 1kg", stock: 3, predictedExhaustion: "1 Day", margin: "+18%" }
];

export const categories = [
  { name: 'Cooking Oil', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=150&auto=format&fit=crop&q=60', count: 'Top Picks' },
  { name: 'Rice Bags', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150&auto=format&fit=crop&q=60', count: 'High Demand' },
  { name: 'Soft Drinks', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150&auto=format&fit=crop&q=60', count: 'Trending' },
  { name: 'Biscuits', image: 'https://images.unsplash.com/photo-1558961317-1fdddf930107?w=150&auto=format&fit=crop&q=60', count: 'Best Sellers' },
  { name: 'Detergent', image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=150&auto=format&fit=crop&q=60', count: 'Top Brands' },
];

export const bestDeals = [
  {
    id: 1, title: 'Aashirvaad Atta', weight: '10 kg', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=60',
    suppliers: [
      { name: 'Sri Murugan Traders', price: 520 },
      { name: 'Kumar Wholesale', price: 510 },
      { name: 'ABC Distributors', price: 495, best: true }
    ],
    savings: 25
  },
  {
    id: 2, title: 'India Gate Basmati Rice', weight: '20 kg', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&auto=format&fit=crop&q=60',
    suppliers: [
      { name: 'Sri Murugan Traders', price: 1650 },
      { name: 'Kumar Wholesale', price: 1620 },
      { name: 'ABC Distributors', price: 1550, best: true }
    ],
    savings: 70
  },
  {
    id: 3, title: 'Fortune Sunflower Oil', weight: '15 L', image: 'https://images.unsplash.com/photo-1622484211148-7163014aa0c8?w=200&auto=format&fit=crop&q=60',
    suppliers: [
      { name: 'Sri Murugan Traders', price: 1750 },
      { name: 'Kumar Wholesale', price: 1720 },
      { name: 'ABC Distributors', price: 1690, best: true }
    ],
    savings: 60
  }
];

export const wholesalers = [
  { name: 'ABC Distributors', distance: '1.2 km away', rating: 4.8, type: 'Delivery Available', color: 'bg-blue-500' },
  { name: 'Sri Murugan Traders', distance: '2.5 km away', rating: 4.7, type: 'Delivery Available', color: 'bg-purple-500' },
  { name: 'Kumar Wholesale', distance: '3.1 km away', rating: 4.6, type: 'Delivery Available', color: 'bg-amber-500' },
];

export const trending = [
  { name: 'Soft Drinks', change: '+22%', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100&auto=format&fit=crop&q=60' },
  { name: 'Chips & Snacks', change: '+18%', image: 'https://images.unsplash.com/photo-1566478431344-7da1e1e05f3a?w=100&auto=format&fit=crop&q=60' },
  { name: 'Instant Noodles', change: '+14%', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&auto=format&fit=crop&q=60' },
  { name: 'Tea Powder', change: '+10%', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=100&auto=format&fit=crop&q=60' },
];

export const runningLow = [
  { name: 'Coke Crate', left: '2 remaining', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100&auto=format&fit=crop&q=60' },
  { name: 'Aashirvaad Atta', left: '3 remaining', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop&q=60' },
  { name: 'Sunflower Oil', left: '1 remaining', image: 'https://images.unsplash.com/photo-1622484211148-7163014aa0c8?w=100&auto=format&fit=crop&q=60' },
  { name: 'Surf Excel 2kg', left: '4 remaining', image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=100&auto=format&fit=crop&q=60' },
];

export const recentOrders_D = [
  { id: '#SL1025', item: 'Rice 25kg x 5', supplier: 'ABC Distributors', status: 'Out for Delivery', eta: 'Today, 4:00 PM', statusColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: '#SL1024', item: 'Sunflower Oil 15L x 2', supplier: 'Kumar Wholesale', status: 'Delivered', eta: 'May 10, 2:30 PM', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: '#SL1023', item: 'Aashirvaad Atta 10kg x 10', supplier: 'Sri Murugan Traders', status: 'Delivered', eta: 'May 09, 11:45 AM', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];