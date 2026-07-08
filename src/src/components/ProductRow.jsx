import React, { useMemo, useCallback } from 'react';
import StatusBadge, { getStockStatus } from './StatusBadge';
import StockValue from './StockValue';
import ActionButtons from './ActionButtons';
import '../styles/ProductRow.css';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatUpdatedAt(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  if (isToday) return { primary: 'Today', secondary: time };
  const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  return { primary: dateStr, secondary: time };
}

function ProductRow({ product, onEdit, onDelete }) {
  const status = useMemo(
    () => getStockStatus(product.stock, product.capacity),
    [product.stock, product.capacity]
  );

  const updated = useMemo(() => formatUpdatedAt(product.updatedAt), [product.updatedAt]);

  const handleEdit = useCallback(() => onEdit(product), [onEdit, product]);
  const handleDelete = useCallback(() => onDelete(product), [onDelete, product]);

  return (
    <div className="sl-row" data-status={status}>
      <div className="sl-row__cell sl-row__cell--name" data-label="Product">
        <span className="sl-row__product-name">{product.name}</span>
        <span className="sl-row__meta">
          SKU&nbsp;:&nbsp;{product.sku} <span className="sl-row__meta-dot">•</span> {product.category}
        </span>
      </div>

      <div className="sl-row__cell sl-row__cell--brand" data-label="Brand">
        {product.brand}
      </div>

      <div className="sl-row__cell sl-row__cell--moq" data-label="MOQ">
        <span className="sl-badge-moq">
          MOQ {product.moq} {product.moqUnit}
        </span>
      </div>

      <div className="sl-row__cell sl-row__cell--unit" data-label="Unit">
        {product.unit}
      </div>

      <div className="sl-row__cell sl-row__cell--price" data-label="Price">
        <span className="sl-row__price">{formatCurrency(product.price)}</span>
        <span className="sl-row__price-sub">/ {product.unit}</span>
      </div>

      <div className="sl-row__cell sl-row__cell--stock" data-label="Stock">
        <StockValue stock={product.stock} unit={product.unit} status={status} />
      </div>

      <div className="sl-row__cell sl-row__cell--status" data-label="Status">
        <StatusBadge status={status} />
      </div>

      <div className="sl-row__cell sl-row__cell--updated" data-label="Updated">
        <span className="sl-row__updated-primary">{updated.primary}</span>
        <span className="sl-row__updated-secondary">{updated.secondary}</span>
      </div>

      <div className="sl-row__cell sl-row__cell--actions" data-label="Actions">
        <ActionButtons
          productName={product.name}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default React.memo(ProductRow);
