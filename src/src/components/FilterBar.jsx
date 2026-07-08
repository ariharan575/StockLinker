import React, { useCallback } from 'react';
import { RotateCcw, RefreshCw, Download, ChevronDown } from 'lucide-react';
import '../styles/FilterBar.css';

function Select({ label, value, onChange, options }) {
  return (
    <div className="sl-filter-select">
      <select
        className="sl-filter-select__control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="sl-filter-select__chevron" size={14} strokeWidth={2.25} />
    </div>
  );
}

function FilterBar({
  categories,
  brands,
  filters,
  onFilterChange,
  onReset,
  onRefresh,
  onExport,
  isRefreshing,
}) {
  const handle = useCallback(
    (key) => (value) => onFilterChange(key, value),
    [onFilterChange]
  );

  return (
    <div className="sl-filterbar">
      <div className="sl-filterbar__group">
        <Select
          label="Filter by category"
          value={filters.category}
          onChange={handle('category')}
          options={[{ value: 'all', label: 'All Categories' }, ...categories.map((c) => ({ value: c, label: c }))]}
        />
        <Select
          label="Filter by brand"
          value={filters.brand}
          onChange={handle('brand')}
          options={[{ value: 'all', label: 'All Brands' }, ...brands.map((b) => ({ value: b, label: b }))]}
        />
        <Select
          label="Filter by availability"
          value={filters.availability}
          onChange={handle('availability')}
          options={[
            { value: 'all', label: 'All Availability' },
            { value: 'available', label: 'Available' },
            { value: 'low', label: 'Low Stock' },
            { value: 'out', label: 'Out of Stock' },
          ]}
        />
        <Select
          label="Sort by price"
          value={filters.sortPrice}
          onChange={handle('sortPrice')}
          options={[
            { value: 'none', label: 'Sort: Price' },
            { value: 'asc', label: 'Price: Low to High' },
            { value: 'desc', label: 'Price: High to Low' },
          ]}
        />
        <Select
          label="Sort by stock"
          value={filters.sortStock}
          onChange={handle('sortStock')}
          options={[
            { value: 'none', label: 'Sort: Stock' },
            { value: 'asc', label: 'Stock: Low to High' },
            { value: 'desc', label: 'Stock: High to Low' },
          ]}
        />
      </div>

      <div className="sl-filterbar__actions">
        <button type="button" className="sl-btn sl-btn--ghost" onClick={onReset}>
          <RotateCcw size={15} strokeWidth={2.25} />
          Reset
        </button>
        <button
          type="button"
          className="sl-btn sl-btn--ghost"
          onClick={onRefresh}
          aria-label="Refresh product list"
        >
          <RefreshCw
            size={15}
            strokeWidth={2.25}
            className={isRefreshing ? 'sl-spin' : ''}
          />
          Refresh
        </button>
        <button type="button" className="sl-btn sl-btn--cta" onClick={onExport}>
          <Download size={15} strokeWidth={2.25} />
          Export
        </button>
      </div>
    </div>
  );
}

export default React.memo(FilterBar);
