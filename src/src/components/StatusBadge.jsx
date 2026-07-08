import React from 'react';
import '../styles/StatusBadge.css';

/**
 * Derives stock status from current stock relative to capacity.
 * Exported so ProductRow / FilterBar can share the same rule.
 */
export function getStockStatus(stock, capacity) {
  if (stock <= 0) return 'out';
  const ratio = capacity > 0 ? stock / capacity : 1;
  if (ratio <= 0.15) return 'low';
  return 'available';
}

const STATUS_CONFIG = {
  available: { label: 'Available' },
  low: { label: 'Low Stock' },
  out: { label: 'Out of Stock' },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.available;

  return (
    <span className={`sl-status-badge sl-status-badge--${status}`}>
      <span className="sl-status-badge__dot" aria-hidden="true" />
      {config.label}
    </span>
  );
}

export default React.memo(StatusBadge);
