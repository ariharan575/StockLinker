import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  Search, Package, Boxes, Edit, Trash2, 
  RefreshCw, Download, ArrowUp, ArrowDown, 
  PlusCircle, AlertCircle
} from 'lucide-react';
import './ProductListPage.css';

// ============================================================================
// MOCK DATA GENERATOR (For demonstration)
// ============================================================================
const generateMockProducts = (count) => {
  const statuses = ['Available', 'Low Stock', 'Out of Stock'];
  const categories = ['Grains', 'Spices', 'Beverages', 'Packaging'];
  
  return Array.from({ length: count }, (_, i) => {
    const stock = Math.floor(Math.random() * 500);
    let status = 'Available';
    if (stock === 0) status = 'Out of Stock';
    else if (stock < 50) status = 'Low Stock';

    return {
      id: `PROD-${1000 + i}`,
      name: `Premium Wholesale Product ${i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      minQty: Math.floor(Math.random() * 40) + 10,
      price: Math.floor(Math.random() * 5000) + 150,
      stock: stock,
      maxStock: 500,
      status: status,
      lastUpdated: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
      image: `https://via.placeholder.com/150/F1F5F9/64748B?text=Img+${i+1}`
    };
  });
};

// ============================================================================
// REUSABLE SUB-COMPONENTS
// ============================================================================

const HeroSection = React.memo(({ totalProducts }) => (
  <div className="sl-hero">
    <div className="sl-hero-content">
      <h1>Manage Your Products</h1>
      <p>Manage your wholesale inventory, pricing, stock levels, and availability from one centralized workspace.</p>
    </div>
    <div className="sl-stat-card">
      <div className="sl-stat-icon">
        <Boxes size={32} />
      </div>
      <div className="sl-stat-info">
        <span className="sl-stat-number">{totalProducts.toLocaleString()}</span>
        <span className="sl-stat-label">Products Available</span>
      </div>
    </div>
  </div>
));

const StatusBadge = React.memo(({ status }) => {
  const getStyleClass = () => {
    switch(status) {
      case 'Available': return 'available';
      case 'Low Stock': return 'low';
      case 'Out of Stock': return 'out';
      default: return '';
    }
  };
  return <span className={`sl-status-badge ${getStyleClass()}`}>{status}</span>;
});

const StockIndicator = React.memo(({ stock, max }) => {
  const percentage = Math.min((stock / max) * 100, 100);
  const getLevelClass = () => {
    if (percentage > 50) return 'high';
    if (percentage > 10) return 'medium';
    return 'low';
  };

  return (
    <div className="sl-stock-container">
      <span className="sl-stock-text">{stock} Units</span>
      <div className="sl-progress-bg">
        <div 
          className={`sl-progress-fill ${getLevelClass()}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

const ActionButton = React.memo(({ icon: Icon, type, onClick, title }) => (
  <button 
    className={`sl-icon-btn ${type}`} 
    onClick={onClick} 
    title={title}
    aria-label={title}
  >
    <Icon size={18} />
  </button>
));

const SkeletonLoader = () => (
  <>
    {Array.from({ length: 5 }).map((_, idx) => (
      <div key={`skel-${idx}`} className="sl-row">
        <div className="col-img"><div className="sl-skeleton skel-img" /></div>
        <div className="col-name">
          <div className="sl-skeleton skel-text" />
          <div className="sl-skeleton skel-text-sm" />
        </div>
        <div className="col-qty"><div className="sl-skeleton skel-badge" /></div>
        <div className="col-price"><div className="sl-skeleton skel-text" /></div>
        <div className="col-stock"><div className="sl-skeleton skel-text" /></div>
        <div className="col-status"><div className="sl-skeleton skel-badge" /></div>
        <div className="col-date"><div className="sl-skeleton skel-text-sm" /></div>
        <div className="col-actions" />
      </div>
    ))}
  </>
);

const EmptyState = () => (
  <div className="sl-empty-state">
    <Package size={64} className="sl-empty-icon" />
    <h3>No Products Found</h3>
    <p>Start adding your wholesale products to build your inventory or adjust your search filters.</p>
    <button className="sl-btn-pill primary">
      <PlusCircle size={18} /> Add New Product
    </button>
  </div>
);

// ============================================================================
// MAIN ROW COMPONENT
// ============================================================================
const ProductRow = React.memo(({ product, onEdit, onDelete }) => (
  <div className="sl-row">
    <div className="col-img">
      <img src={product.image} alt={product.name} className="sl-product-img" loading="lazy" />
    </div>
    <div className="col-name">
      <div className="sl-product-name" title={product.name}>{product.name}</div>
      <div className="sl-product-category">{product.category}</div>
    </div>
    <div className="col-qty">
      <span className="sl-badge-min">Min {product.minQty}</span>
    </div>
    <div className="col-price">
      <span className="sl-price">₹{product.price.toLocaleString()}</span>
    </div>
    <div className="col-stock">
      <StockIndicator stock={product.stock} max={product.maxStock} />
    </div>
    <div className="col-status">
      <StatusBadge status={product.status} />
    </div>
    <div className="col-date">
      {product.lastUpdated}
    </div>
    <div className="col-actions">
      <ActionButton icon={Edit} type="edit" title="Edit Product" onClick={() => onEdit(product.id)} />
      <ActionButton icon={Trash2} type="delete" title="Delete Product" onClick={() => onDelete(product.id)} />
    </div>
  </div>
));

// ============================================================================
// PAGE ARCHITECTURE (ROOT)
// ============================================================================
const ProductListPage = () => {
  // State
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Simulate API fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(generateMockProducts(45));
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Handlers
  const handleSearch = useCallback((e) => setSearchTerm(e.target.value), []);
  const handleFilterStatus = useCallback((e) => setFilterStatus(e.target.value), []);
  
  const handleEdit = useCallback((id) => {
    console.log(`Editing product ${id}`);
  }, []);

  const handleDelete = useCallback((id) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Memoized Filtering
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || product.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, filterStatus]);

  return (
    <div className="sl-page-container">
      <HeroSection totalProducts={products.length} />

      <div className="sl-controls-container">
        {/* Search Bar */}
        <div className="sl-search-bar">
          <Search className="sl-search-icon" size={20} />
          <input 
            type="text" 
            className="sl-search-input" 
            placeholder="Search product by name, SKU, or category..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Filter Bar */}
        <div className="sl-filter-bar">
          <select className="sl-select" value={filterStatus} onChange={handleFilterStatus}>
            <option value="All">All Availability</option>
            <option value="Available">Available</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          
          <button className="sl-btn-pill">
            Sort: Price <ArrowUp size={16} />
          </button>
          
          <button className="sl-btn-pill">
            Sort: Stock <ArrowDown size={16} />
          </button>

          <div className="sl-spacer"></div>

          <button className="sl-btn-pill" onClick={handleRefresh}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="sl-btn-pill primary">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* List Header */}
      {!isLoading && filteredProducts.length > 0 && (
        <div className="sl-list-header">
          <div className="col-img">Image</div>
          <div className="col-name">Product Name</div>
          <div className="col-qty">Min. Qty</div>
          <div className="col-price">Selling Price</div>
          <div className="col-stock">Available Stock</div>
          <div className="col-status">Status</div>
          <div className="col-date">Last Updated</div>
          <div className="col-actions">Actions</div>
        </div>
      )}

      {/* Main List Area */}
      <div className="sl-list-body">
        {isLoading ? (
          <SkeletonLoader />
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductRow 
              key={product.id} 
              product={product} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default ProductListPage;