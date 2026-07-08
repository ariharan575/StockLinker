// ProductCategories.jsx
import React, { useState, useMemo, useCallback, useEffect } from "react";
import * as FiIcons from "react-icons/fi";
import { 
  FiSearch, FiSliders, FiX, FiChevronRight,
  FiShoppingBag, FiShoppingCart, FiHome, FiBox, FiSun, FiTruck,
  FiActivity, FiHeart, FiDroplet, FiSettings, FiClipboard, FiPackage,
  FiWind, FiTool, FiGrid, FiZap, FiGift, FiBook, FiStar, FiSmartphone,
  FiWifi, FiCoffee, FiFeather, FiAnchor, FiShield
} from "react-icons/fi";

// ============================================================
// DATA
// ============================================================
const GRADIENTS = [
  ["#FF4D6D", "#FF8A3D"], // coral -> amber (brand)
  ["#0B1220", "#334155"], // ink -> slate
  ["#2563EB", "#38BDF8"], // blue -> sky
  ["#7C3AED", "#C026D3"], // violet -> fuchsia
  ["#059669", "#84CC16"], // emerald -> lime
  ["#EA580C", "#FACC15"], // burnt orange -> gold
];

const gradient = (i) => GRADIENTS[i % GRADIENTS.length];

const CATEGORIES = [
  {
    id: "electronics",
    name: "Electronics",
    icon: "FiCpu",
    subcategories: [
      "Televisions", "Home Theater Systems", "Digital Cameras", "Drones & Accessories",
      "Action Cameras", "Bluetooth Speakers", "Wireless Earbuds", "Power Banks",
      "Smart Watches", "VR Headsets", "Set-Top Boxes", "Projectors",
      "Car Electronics", "Surveillance Cameras", "Walkie Talkies", "Extension Cords",
      "Voltage Stabilizers", "Circuit Testers",
    ],
  },
  {
    id: "fashion",
    name: "Fashion & Apparel",
    icon: "FiShoppingBag",
    subcategories: [
      "Men's Clothing", "Women's Clothing", "Kids Wear", "Ethnic Wear",
      "Denim & Jeans", "Activewear", "Winter Wear", "Formal Suits",
      "Sarees & Lehengas", "Sleepwear", "Undergarments", "Belts & Wallets",
      "Sunglasses", "Caps & Hats", "Scarves & Stoles", "Rainwear",
    ],
  },
  {
    id: "grocery",
    name: "Grocery & Gourmet",
    icon: "FiShoppingCart",
    subcategories: [
      "Rice & Grains", "Pulses & Lentils", "Edible Oils", "Spices & Masalas",
      "Tea & Coffee", "Packaged Snacks", "Dry Fruits & Nuts", "Bakery Ingredients",
      "Sauces & Condiments", "Breakfast Cereals", "Dairy & Dairy Alternatives",
      "Frozen Foods", "Organic Foods", "Beverages & Juices", "Sweeteners",
      "Canned & Preserved Foods",
    ],
  },
  {
    id: "home-appliances",
    name: "Home Appliances",
    icon: "FiHome",
    subcategories: [
      "Refrigerators", "Washing Machines", "Air Conditioners", "Microwave Ovens",
      "Water Purifiers", "Vacuum Cleaners", "Air Fryers", "Mixer Grinders",
      "Ceiling Fans", "Room Heaters", "Water Heaters", "Induction Cooktops",
      "Dishwashers", "Air Coolers", "Chimneys & Hoods",
    ],
  },
  {
    id: "furniture",
    name: "Furniture & Decor",
    icon: "FiBox",
    subcategories: [
      "Sofas & Recliners", "Dining Sets", "Office Chairs", "Office Desks",
      "Wardrobes", "Bookshelves", "Bed Frames", "Mattresses",
      "Coffee Tables", "TV Units", "Wall Art & Decor", "Curtains & Blinds",
      "Rugs & Carpets", "Storage Cabinets", "Outdoor Furniture", "Modular Kitchens",
    ],
  },
  {
    id: "agriculture",
    name: "Agriculture",
    icon: "FiSun",
    subcategories: [
      "Seeds & Saplings", "Fertilizers", "Pesticides", "Irrigation Equipment",
      "Tractors & Implements", "Greenhouse Supplies", "Farm Tools", "Poultry Equipment",
      "Animal Feed", "Harvesting Machinery", "Sprayers & Dusters", "Solar Water Pumps",
      "Beekeeping Supplies", "Soil Testing Kits",
    ],
  },
  {
    id: "automobile",
    name: "Automobile & Parts",
    icon: "FiTruck",
    subcategories: [
      "Electric Cars", "Used Cars", "Electric Motorcycles", "Electric Scooters",
      "Car Batteries", "Tyres & Wheels", "Engine Oil & Lubricants", "Car Audio Systems",
      "Brake Systems", "Car Care & Detailing", "Spare Parts", "Car Seat Covers",
      "Dash Cameras", "Roof Racks & Carriers", "Two-Wheeler Accessories",
    ],
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    icon: "FiActivity",
    subcategories: [
      "Gym Equipment", "Yoga Accessories", "Cricket Gear", "Football Gear",
      "Badminton & Racquets", "Cycling Equipment", "Camping & Hiking Gear",
      "Swimming Gear", "Fitness Trackers", "Protein & Supplements",
      "Boxing Equipment", "Sportswear", "Skateboards & Scooters", "Table Tennis Gear",
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare & Medical",
    icon: "FiHeart",
    subcategories: [
      "Diagnostic Equipment", "First Aid Supplies", "Mobility Aids", "Surgical Instruments",
      "Personal Protective Equipment", "Hospital Furniture", "Health Monitors",
      "Orthopedic Supports", "Respiratory Equipment", "Dental Supplies",
      "Ayurvedic Products", "Nutritional Supplements", "Home Care Equipment",
    ],
  },
  {
    id: "beauty",
    name: "Beauty & Personal Care",
    icon: "FiDroplet",
    subcategories: [
      "Skincare", "Haircare", "Makeup & Cosmetics", "Fragrances & Perfumes",
      "Salon Equipment", "Grooming Tools", "Bath & Body", "Nail Care",
      "Men's Grooming", "Organic & Herbal Care", "Beauty Tools & Accessories",
    ],
  },
  {
    id: "industrial",
    name: "Industrial Equipment",
    icon: "FiSettings",
    subcategories: [
      "Compressors", "Generators", "Conveyor Systems", "Hydraulic Equipment",
      "Pumps & Motors", "Industrial Fans", "Material Handling Equipment",
      "Welding Equipment", "Safety & Workwear", "Industrial Storage",
      "Bearings & Seals", "Pneumatic Tools", "Cranes & Hoists",
    ],
  },
  {
    id: "office-supplies",
    name: "Office Supplies",
    icon: "FiClipboard",
    subcategories: [
      "Printers & Scanners", "Office Furniture", "Filing & Storage",
      "Writing Instruments", "Paper Products", "Whiteboards & Displays",
      "Shredders & Laminators", "Projectors & Screens", "Office Electronics",
      "Desk Organizers", "Signage & Labeling",
    ],
  },
  {
    id: "packaging",
    name: "Packaging & Printing",
    icon: "FiPackage",
    subcategories: [
      "Corrugated Boxes", "Packaging Films", "Labels & Stickers", "Printing Machinery",
      "Bubble Wrap & Cushioning", "Packaging Tapes", "Bottles & Containers",
      "Bags & Pouches", "Custom Printing Services", "Pallets & Crates",
    ],
  },
  {
    id: "chemicals",
    name: "Chemicals & Materials",
    icon: "FiWind",
    subcategories: [
      "Industrial Chemicals", "Adhesives & Sealants", "Paints & Coatings",
      "Cleaning Chemicals", "Dyes & Pigments", "Petrochemicals", "Rubber & Plastics",
      "Laboratory Chemicals", "Water Treatment Chemicals", "Textile Chemicals",
    ],
  },
  {
    id: "construction",
    name: "Construction & Building",
    icon: "FiTool",
    subcategories: [
      "Cement & Concrete", "Bricks & Blocks", "Steel & TMT Bars", "Tiles & Sanitaryware",
      "Doors & Windows", "Roofing Materials", "Plywood & Boards", "Waterproofing Solutions",
      "Scaffolding Equipment", "Construction Tools", "Paints & Finishes", "Pipes & Fittings",
    ],
  },
  {
    id: "machinery",
    name: "Machinery & Tools",
    icon: "FiGrid",
    subcategories: [
      "CNC Machines", "Lathe Machines", "Power Tools", "Hand Tools",
      "Cutting Tools", "3D Printers", "Packaging Machinery", "Textile Machinery",
      "Food Processing Machinery", "Woodworking Machinery", "Measuring Instruments",
    ],
  },
  {
    id: "electrical",
    name: "Electrical & Lighting",
    icon: "FiZap",
    subcategories: [
      "LED Lights", "Wires & Cables", "Switches & Sockets", "MCBs & Distribution Boards",
      "Solar Panels", "Inverters & UPS", "Transformers", "Lighting Fixtures",
      "Smart Home Devices", "Industrial Lighting", "Street Lighting",
    ],
  },
  {
    id: "toys",
    name: "Toys & Kids",
    icon: "FiGift",
    subcategories: [
      "Educational Toys", "Remote Control Toys", "Dolls & Action Figures",
      "Baby Gear", "Outdoor Play Equipment", "Puzzles & Games", "Ride-On Toys",
      "Stationery for Kids", "Kids Furniture", "Soft Toys",
    ],
  },
  {
    id: "books",
    name: "Books & Stationery",
    icon: "FiBook",
    subcategories: [
      "Textbooks", "Notebooks & Diaries", "Art & Craft Supplies", "Office Stationery",
      "Children's Books", "Religious & Spiritual Books", "Calendars & Planners",
      "Gift Wrapping Supplies", "Filing Supplies",
    ],
  },
  {
    id: "jewellery",
    name: "Jewellery & Watches",
    icon: "FiStar",
    subcategories: [
      "Gold Jewellery", "Silver Jewellery", "Fashion Jewellery", "Wrist Watches",
      "Jewellery Boxes", "Bridal Jewellery Sets", "Gemstones", "Watch Straps & Parts",
      "Jewellery Making Supplies",
    ],
  },
  {
    id: "mobile-accessories",
    name: "Mobile & Accessories",
    icon: "FiSmartphone",
    subcategories: [
      "Smartphones", "Mobile Cases & Covers", "Screen Protectors", "Chargers & Cables",
      "Power Banks", "Bluetooth Headsets", "Mobile Repair Parts", "Phone Holders & Mounts",
      "Selfie Sticks & Tripods", "SIM Accessories",
    ],
  },
  {
    id: "computers",
    name: "Computers & Networking",
    icon: "FiWifi",
    subcategories: [
      "Laptops", "Desktops", "Monitors", "Printers", "Keyboards & Mice",
      "Routers & Networking", "SSDs & Storage", "RAM & Memory", "Computer Accessories",
      "Servers", "Graphic Cards", "Webcams",
    ],
  },
  {
    id: "kitchenware",
    name: "Kitchenware & Dining",
    icon: "FiCoffee",
    subcategories: [
      "Cookware Sets", "Cutlery & Knives", "Dinnerware", "Storage Containers",
      "Bakeware", "Kitchen Tools & Gadgets", "Glassware & Drinkware",
      "Coffee & Tea Makers", "Kitchen Textiles", "Commercial Kitchen Equipment",
    ],
  },
  {
    id: "footwear",
    name: "Footwear",
    icon: "FiFeather",
    subcategories: [
      "Men's Footwear", "Women's Footwear", "Kids Footwear", "Sports Shoes",
      "Sandals & Slippers", "Formal Shoes", "Safety Footwear", "Boots",
      "Footwear Accessories",
    ],
  },
  {
    id: "pet-supplies",
    name: "Pet Supplies",
    icon: "FiAnchor",
    subcategories: [
      "Pet Food", "Pet Grooming", "Pet Toys", "Pet Beds & Housing",
      "Leashes & Collars", "Aquarium Supplies", "Bird Supplies", "Pet Health Care",
      "Pet Carriers",
    ],
  },
  {
    id: "security",
    name: "Security & Safety",
    icon: "FiShield",
    subcategories: [
      "CCTV Cameras", "Access Control Systems", "Fire Safety Equipment",
      "Alarm Systems", "Metal Detectors", "Safety Signage", "Locks & Padlocks",
      "Biometric Devices", "Personal Safety Gear",
    ],
  },
].map((cat, i) => ({
  ...cat,
  gradient: gradient(i),
  count: cat.subcategories.length,
}));

// ============================================================
// COMPONENTS
// ============================================================

// ----- Scrollbar -----
const Scrollbar = React.forwardRef(function Scrollbar({ className = "", children, ...rest }, ref) {
  return (
    <div
      ref={ref}
      className={`overflow-y-auto overflow-x-hidden
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-[#0B1220]/10
        hover:[&::-webkit-scrollbar-thumb]:bg-[#0B1220]/20
        [scrollbar-width:thin]
        [scrollbar-color:rgba(11,18,32,0.12)_transparent]
        ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
});

// ----- SearchBar -----
function SearchBar({ value, onChange, resultCount, placeholder }) {
  return (
    <div className="w-full max-w-2xl">
      <div
        className="flex items-center gap-3 rounded-2xl border border-[#E6E8EE] bg-white
                   px-4 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.04)]
                   focus-within:border-[#0B1220] focus-within:ring-4 focus-within:ring-[#0B1220]/5
                   transition-all duration-200"
      >
        <FiSearch className="h-5 w-5 shrink-0 text-[#94A3B8]" aria-hidden="true" />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Search categories, subcategories, products..."}
          aria-label="Search categories, subcategories and products"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-[#0B1220] placeholder:text-[#94A3B8]
                     outline-none"
        />

        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="shrink-0 rounded-full p-1 text-[#94A3B8] hover:bg-[#F1F2F5] hover:text-[#0B1220]
                       transition-colors duration-150 focus:outline-none focus-visible:ring-2
                       focus-visible:ring-[#0B1220]/30"
          >
            <FiX className="h-4 w-4" />
          </button>
        ) : null}

        <div className="hidden h-6 w-px bg-[#E6E8EE] sm:block" aria-hidden="true" />

        <button
          type="button"
          aria-label="Open filters"
          className="hidden shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px]
                     font-medium text-[#334155] hover:bg-[#F1F2F5] transition-colors duration-150
                     sm:flex focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1220]/30"
        >
          <FiSliders className="h-4 w-4" />
          Filters
        </button>
      </div>

      {value ? (
        <p className="mt-2 pl-1 text-[13px] text-[#64748B]" role="status" aria-live="polite">
          {resultCount === 0
            ? `No matches for "${value}"`
            : `${resultCount} result${resultCount === 1 ? "" : "s"} for "${value}"`}
        </p>
      ) : null}
    </div>
  );
}

// ----- HeroSection -----
function HeroSection({ searchTerm, onSearchChange, resultCount }) {
  return (
    <header className="px-1 pb-6 flex items-center justify-between  sm:px-5 ">
      <div>
     <h1 className="text-[26px] font-extrabold tracking-tight text-[#0B1220] sm:text-[34px]">
        Product Categories
      </h1>
      <p className="mt-1 max-w-xl text-[15px] text-[#64748B]">
        Browse all wholesale categories and discover suppliers faster.
      </p>
      </div>


      <div className="mt-5">
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          resultCount={resultCount}
          placeholder="Search categories, suppliers, products..."
        />
      </div>
    </header>
  );
}

// ----- CategoryItem -----
function CategoryItem({ category, isActive, onSelect, matchCount, hasSearch }) {
  const Icon = FiIcons[category.icon] || FiIcons.FiGrid;

  return (
    <li role="none">
      <button
        type="button"
        role="tab"
        aria-selected={isActive}
        id={`category-tab-${category.id}`}
        aria-controls={`category-panel-${category.id}`}
        onClick={() => onSelect(category.id)}
        className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left
          transition-all duration-200 ease-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1220]/40
          ${
            isActive
              ? "bg-[#0B1220] text-[#334155] shadow-[0_4px_14px_rgba(11,18,32,0.25)]"
              : "hover:bg-[#F1F2F5]"
          }`}
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors
            duration-200 ${isActive ? "bg-white/10 text-white" : "bg-[#F1F2F5] text-[#334155] group-hover:bg-white"}`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={`block truncate text-[14px] font-medium transition-colors duration-200
              ${isActive ? "text-white" : "text-[#0B1220]"}`}
          >
            {category.name}
          </span>
          {hasSearch ? (
            <span className={`block text-[11px] ${isActive ? "text-white/60" : "text-[#94A3B8]"}`}>
              {matchCount} match{matchCount === 1 ? "" : "es"}
            </span>
          ) : null}
        </span>

        <FiChevronRight
          className={`h-4 w-4 shrink-0 transition-all duration-200
            ${isActive ? "translate-x-0 text-white/70" : "-translate-x-0.5 text-[#CBD2DB] group-hover:translate-x-0 group-hover:text-[#64748B]"}`}
          aria-hidden="true"
        />
      </button>
    </li>
  );
}

// ----- CategorySidebar -----
function CategorySidebar({ categories, activeId, onSelect, searchTerm, matchCounts }) {
  const hasSearch = Boolean(searchTerm);

  return (
    <div className="w-[210px] shrink-0 border-r border-[#EEF0F3] bg-white lg:w-[270px]">
      <Scrollbar className="h-full px-1.5 py-4 mt-[62px]">
        <ul role="tablist" className="space-y-0.5">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              isActive={category.id === activeId}
              onSelect={onSelect}
              matchCount={matchCounts[category.id] || 0}
              hasSearch={hasSearch}
            />
          ))}
        </ul>
      </Scrollbar>
    </div>
  );
}

// ----- CategoryCard -----
function CategoryCard({ name, gradient, onClick }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const [from, to] = gradient;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Browse ${name}`}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-[#EEF0F3] bg-white
        p-4 text-center transition-all duration-300 ease-out
        hover:-translate-y-1 hover:border-[#E6E8EE] hover:shadow-[0_16px_32px_-12px_rgba(11,18,32,0.18)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1220]/40"
    >
      <span className="relative flex h-20 w-20 items-center justify-center">
        <span
          className="absolute inset-[-4px] rounded-full opacity-0 blur-[1px] transition-opacity
            duration-300 ease-out group-hover:opacity-100 group-hover:animate-[spin_3s_linear_infinite]"
          style={{
            background: `conic-gradient(from 0deg, ${from}, ${to}, transparent 60%)`,
          }}
          aria-hidden="true"
        />
        <span
          className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full text-[15px]
            font-bold text-white shadow-[0_6px_16px_-6px_rgba(11,18,32,0.35)]
            transition-transform duration-300 ease-out group-hover:scale-[1.06]"
          style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        >
          {initials}
        </span>
      </span>

      <span
        className="line-clamp-2 text-[13px] font-medium leading-snug text-[#334155]
          transition-colors duration-300 group-hover:text-[#0B1220]"
      >
        {name}
      </span>
    </button>
  );
}

// ----- CategoryGrid -----
function CategoryGrid({ subcategories, gradient, onSelectSubcategory }) {
  if (subcategories.length === 0) {
    return (
      <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-2 text-center">
        <p className="text-[15px] font-medium text-[#334155]">No subcategories found</p>
        <p className="max-w-xs text-[13px] text-[#94A3B8]">
          Try a different search term or pick another category from the left.
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5"
    >
      {subcategories.map((sub) => (
        <CategoryCard
          key={sub}
          name={sub}
          gradient={gradient}
          onClick={() => onSelectSubcategory?.(sub)}
        />
      ))}
    </div>
  );
}

// ----- CategoryContent -----
function CategoryContent({ category, subcategories, searchTerm, onSelectSubcategory }) {
  if (!category) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-[15px] text-[#64748B]">No category selected</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#FAFBFC] ">
      <div className="flex items-center justify-between border-b border-[#EEF0F3] px-6 py-4">
        <div>
          <h2 id={`category-panel-${category.id}`} className="text-[17px] font-bold text-[#0B1220]">
            {category.name}
          </h2>
          <p className="text-[13px] text-[#64748B]">
            {subcategories.length} subcategories
          </p>
        </div>
        {searchTerm && subcategories.length > 0 && (
          <span className="rounded-full bg-[#0B1220]/5 px-3 py-1 text-[12px] font-medium text-[#334155]">
            {subcategories.length} results
          </span>
        )}
      </div>

      <Scrollbar className="flex-1 p-6">
        <CategoryGrid
          subcategories={subcategories}
          gradient={category.gradient}
          onSelectSubcategory={onSelectSubcategory}
        />
      </Scrollbar>
    </div>
  );
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================

/**
 * ProductCategoriesPage
 * ----------------------------------------------------------------------
 * Drop this straight inside your existing <AppLayout>. It does not render
 * a sidebar, header, or any app chrome — only the categories experience
 * itself, sized to fill the space your layout gives it.
 *
 * <AppLayout>
 *   <Sidebar />          // already exists in the app
 *   <Header />           // already exists in the app
 *   <ProductCategoriesPage />
 * </AppLayout>
 *
 * Height: the page assumes it is rendered under your existing header. Pass
 * `headerOffset` (px) if your header + any top padding is taller/shorter
 * than the 72px default, so the categories card fills the remaining
 * viewport exactly, without the page itself scrolling.
 */
function ProductCategoriesPage({ headerOffset = 72 }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(CATEGORIES[0].id);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  // For every category, work out which subcategories match the search term
  // and whether the category itself matches by name. Runs once per keystroke.
  const searchIndex = useMemo(() => {
    if (!normalizedSearch) return null;

    const index = {};
    for (const category of CATEGORIES) {
      const nameMatches = category.name.toLowerCase().includes(normalizedSearch);
      const matchingSubs = category.subcategories.filter((sub) =>
        sub.toLowerCase().includes(normalizedSearch)
      );
      if (nameMatches || matchingSubs.length > 0) {
        index[category.id] = { nameMatches, matchingSubs };
      }
    }
    return index;
  }, [normalizedSearch]);

  // Categories shown in the sidebar: everything, unless searching, in which
  // case only categories that matched (by name or by a subcategory).
  const visibleCategories = useMemo(() => {
    if (!searchIndex) return CATEGORIES;
    return CATEGORIES.filter((c) => searchIndex[c.id]);
  }, [searchIndex]);

  const matchCounts = useMemo(() => {
    if (!searchIndex) return {};
    return Object.fromEntries(
      Object.entries(searchIndex).map(([id, v]) => [
        id,
        v.matchingSubs.length || (v.nameMatches ? 1 : 0),
      ])
    );
  }, [searchIndex]);

  // Total match count surfaced in the hero's "N results" caption.
  const totalResultCount = useMemo(() => {
    if (!searchIndex) return 0;
    return Object.values(matchCounts).reduce((sum, n) => sum + n, 0);
  }, [searchIndex, matchCounts]);

  // Keep the active tab valid: if a search filters the current category
  // out, jump to the first remaining match instead of showing a dead panel.
  useEffect(() => {
    if (visibleCategories.length === 0) return;
    const stillVisible = visibleCategories.some((c) => c.id === activeCategoryId);
    if (!stillVisible) {
      setActiveCategoryId(visibleCategories[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCategories]);

  const activeCategory = useMemo(
    () => visibleCategories.find((c) => c.id === activeCategoryId) ?? null,
    [visibleCategories, activeCategoryId]
  );

  // Subcategories to render on the right: filtered to the search term when
  // there is one, falling back to the full list if only the category name
  // (not any of its subcategories) matched.
  const visibleSubcategories = useMemo(() => {
    if (!activeCategory) return [];
    if (!searchIndex) return activeCategory.subcategories;
    const entry = searchIndex[activeCategory.id];
    if (!entry) return [];
    return entry.matchingSubs.length > 0 ? entry.matchingSubs : activeCategory.subcategories;
  }, [activeCategory, searchIndex]);

  const handleSelectCategory = useCallback((id) => {
    setActiveCategoryId(id);
  }, []);

  const handleSelectSubcategory = useCallback((subName) => {
    // Wire this up to your product listing route, e.g.:
    // navigate(`/categories/${activeCategoryId}/${slugify(subName)}`);
    console.log("Navigate to subcategory:", subName);
  }, []);

  const containerHeightStyle = {
    // calc(100vh - header - hero). Adjust `headerOffset` via prop if your
    // app header is a different height than the 72px default.
    height: `calc(100vh - ${headerOffset}px - 176px)`,
    minHeight: "420px",
  };

  return (
    <div className="flex h-full flex-col bg-[#F6F7F9] ">
      <HeroSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        resultCount={totalResultCount}
      />

      <div
        style={containerHeightStyle}
        className="flex overflow-hidden rounded-3xl border mx-3 border-[#EEF0F3] bg-white
          shadow-[0_1px_2px_rgba(15,23,42,0.03),0_20px_40px_-24px_rgba(15,23,42,0.12)]"
      >


        <CategoryContent
          category={activeCategory}
          subcategories={visibleSubcategories}
          searchTerm={searchTerm}
          onSelectSubcategory={handleSelectSubcategory}
        />

         <CategorySidebar
          categories={visibleCategories}
          activeId={activeCategoryId}
          onSelect={handleSelectCategory}
          searchTerm={normalizedSearch}
          matchCounts={matchCounts}
        />
      </div>

      {/* Breathing room below the card so it doesn't sit flush with the
          layout's own bottom edge. */}
      <div className="h-4 shrink-0 sm:h-6" aria-hidden="true" />
    </div>
  );
}

export default ProductCategoriesPage;