import React, { useMemo } from 'react';
import '../styles/StockProgress.css';

function StockProgress({ stock, capacity, unit }) {
  const percent = useMemo(() => {
    if (!capacity || capacity <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((stock / capacity) * 100)));
  }, [stock, capacity]);

  const tone = useMemo(() => {
    if (stock <= 0) return 'red';
    if (percent <= 15) return 'red';
    if (percent <= 40) return 'orange';
    return 'green';
  }, [stock, percent]);

  return (
    <div className="sl-stock">
      <div className="sl-stock__row">
        <span className="sl-stock__value">
          {stock} <span className="sl-stock__unit">{unit}{stock === 1 ? '' : 's'}</span>
        </span>
      </div>
      <div
        className="sl-stock__track"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Stock level ${percent}%`}
      >
        <div
          className={`sl-stock__fill sl-stock__fill--${tone}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default React.memo(StockProgress);
