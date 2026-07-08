import React from 'react';
import { PackageSearch, Plus } from 'lucide-react';
import '../styles/EmptyState.css';

function EmptyState({ onAddProduct, isFiltered, onReset }) {
  return (
    <div className="sl-empty">
      <div className="sl-empty__illustration" aria-hidden="true">
        <div className="sl-empty__ring sl-empty__ring--outer" />
        <div className="sl-empty__ring sl-empty__ring--inner" />
        <div className="sl-empty__icon">
          <PackageSearch size={30} strokeWidth={1.75} />
        </div>
      </div>

      <h3 className="sl-empty__title">No Products Found</h3>
      <p className="sl-empty__subtitle">
        {isFiltered
          ? 'No products match your current filters. Try adjusting or resetting them.'
          : 'Start adding products to build your wholesale inventory.'}
      </p>

      {isFiltered ? (
        <button type="button" className="sl-btn sl-btn--ghost" onClick={onReset}>
          Reset filters
        </button>
      ) : (
        <button type="button" className="sl-btn sl-btn--cta sl-empty__cta" onClick={onAddProduct}>
          <Plus size={16} strokeWidth={2.5} />
          Add Product
        </button>
      )}
    </div>
  );
}

export default EmptyState;
