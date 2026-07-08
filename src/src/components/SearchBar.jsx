import React, { useCallback } from 'react';
import { Search, X } from 'lucide-react';
import '../styles/SearchBar.css';

function SearchBar({ value, onChange }) {
  const handleChange = useCallback(
    (e) => onChange(e.target.value),
    [onChange]
  );

  const handleClear = useCallback(() => onChange(''), [onChange]);

  return (
    <div className="sl-search">
      <Search className="sl-search__icon" size={18} strokeWidth={2} aria-hidden="true" />
      <input
        type="text"
        className="sl-search__input"
        placeholder="Search products..."
        value={value}
        onChange={handleChange}
        aria-label="Search products"
      />
      {value && (
        <button
          type="button"
          className="sl-search__clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={15} strokeWidth={2.25} />
        </button>
      )}
    </div>
  );
}

export default React.memo(SearchBar);
