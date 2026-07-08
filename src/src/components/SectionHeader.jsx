import React from 'react';
import '../styles/SectionHeader.css';

function SectionHeader({ eyebrow, title, description, right }) {
  return (
    <div className="sl-section-header">
      <div className="sl-section-header__text">
        {eyebrow && <span className="sl-section-header__eyebrow">{eyebrow}</span>}
        <h2 className="sl-section-header__title">{title}</h2>
      </div>
      {right && <div className="sl-section-header__right py-2">{right}</div>}
    </div>
  );
}

export default React.memo(SectionHeader);
