import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import '../styles/variables.css';
import HeroSection from './HeroSection';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import ProductRow from './ProductRow';
import SkeletonLoader from './SkeletonLoader';
import EmptyState from './EmptyState';
import SectionHeader from './SectionHeader';
import { getStockStatus } from './StatusBadge';
import mockProducts from '../data/mockProducts';
import '../styles/ProductListPage.css';

const DEFAULT_FILTERS = {
  category: 'all',
  brand: 'all',
  availability: 'all',
  sortPrice: 'none',
  sortStock: 'none',
};

const LIST_COLUMNS = [
  { label: 'Product', className: 'sl-list-head__name' },
  { label: 'Brand', className: 'sl-list-head__brand' },
  { label: 'MOQ', className: 'sl-list-head__moq' },
  { label: 'Unit', className: 'sl-list-head__unit' },
  { label: 'Price', className: 'sl-list-head__price' },
  { label: 'Stock', className: 'sl-list-head__stock' },
  { label: 'Status', className: 'sl-list-head__status' },
  { label: 'Updated', className: 'sl-list-head__updated' },
  { label: 'Actions', className: 'sl-list-head__actions' },
];

function ProductListPage() {
  const [products] = useState(mockProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Initial load simulation (skeleton -> content)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products]
  );

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchTerm('');
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 700);
  }, []);

  const handleExport = useCallback(() => {
    // In production: trigger CSV/XLSX export of the filtered product list.
    console.log('Exporting product list...');
  }, []);

  const handleAddProduct = useCallback(() => {
    // In production: open the "Add Product" drawer/modal.
    console.log('Open add product flow...');
  }, []);

  const handleEditProduct = useCallback((product) => {
    console.log('Edit product', product.id);
  }, []);

  const handleDeleteProduct = useCallback((product) => {
    console.log('Delete product', product.id);
  }, []);

  const isFiltered =
    searchTerm.trim() !== '' ||
    filters.category !== 'all' ||
    filters.brand !== 'all' ||
    filters.availability !== 'all';

  const visibleProducts = useMemo(() => {
    let result = products;

    const term = searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
    }

    if (filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.brand !== 'all') {
      result = result.filter((p) => p.brand === filters.brand);
    }

    if (filters.availability !== 'all') {
      result = result.filter(
        (p) => getStockStatus(p.stock, p.capacity) === filters.availability
      );
    }

    if (filters.sortPrice !== 'none') {
      result = [...result].sort((a, b) =>
        filters.sortPrice === 'asc' ? a.price - b.price : b.price - a.price
      );
    } else if (filters.sortStock !== 'none') {
      result = [...result].sort((a, b) =>
        filters.sortStock === 'asc' ? a.stock - b.stock : b.stock - a.stock
      );
    }

    return result;
  }, [products, searchTerm, filters]);

  return (
    <div className="stocklinker-root">
      <div className="sl-page">
        <HeroSection totalProducts={products.length} />

        <div className="sl-page__search">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>

        <FilterBar
          categories={categories}
          brands={brands}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          onRefresh={handleRefresh}
          onExport={handleExport}
          isRefreshing={isRefreshing}
        />

        <div className="sl-page__list">
          <SectionHeader
            eyebrow="Catalog"
            title={`${visibleProducts.length} Product${visibleProducts.length === 1 ? '' : 's'}`}
            description="Every SKU in your wholesale catalog, updated in real time."
            right={
              <button type="button" className="sl-btn sl-btn--cta" onClick={handleAddProduct}>
                <Plus size={15} strokeWidth={2.5} />
                Add Product
              </button>
            }
          />

          {isLoading ? (
            <SkeletonLoader rows={6} />
          ) : visibleProducts.length === 0 ? (
            <EmptyState
              isFiltered={isFiltered}
              onAddProduct={handleAddProduct}
              onReset={handleReset}
            />
          ) : (
            <div className="sl-table-scroll">
              <div className="sl-list-head" role="row">
                {LIST_COLUMNS.map((col) => (
                  <span key={col.label} className={`sl-list-head__cell ${col.className}`}>
                    {col.label}
                  </span>
                ))}
              </div>

              <div className="sl-list" role="table" aria-label="Product inventory">
                {visibleProducts.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductListPage;
