import React from 'react';
import '../styles/StockValue.css';

function StockValue({ stock, unit, status }) {
  return (
    <span className={`sl-stockval sl-stockval--${status}`}>
      <span className="sl-stockval__number">{stock}</span>{' '}
      <span className="sl-stockval__unit">
        {unit}
        {stock === 1 ? '' : 's'}
      </span>
    </span>
  );
}

export default React.memo(StockValue);
