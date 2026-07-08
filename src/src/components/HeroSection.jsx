import React from 'react';
import { Package } from 'lucide-react';
import '../styles/HeroSection.css';

function HeroSection({ totalProducts }) {
  return (
    <section className="sl-hero">
      <div className="sl-hero__glow" aria-hidden="true" />

      <div className="sl-hero__left">
        <span className="sl-hero__eyebrow">Inventory Workspace</span>
        <h1 className="sl-hero__title">Product Inventory</h1>
        <p className="sl-hero__description">
          Manage your wholesale products, inventory, pricing, and stock levels
          from one centralized workspace.
        </p>
      </div>

      <div className="sl-hero__right">
        <div className="sl-hero__stat-card">
          <div className="sl-hero__stat-icon">
            <Package size={20} strokeWidth={2.25} />
          </div>
          <div className="sl-hero__stat-text">
            <span className="sl-hero__stat-number">
              {totalProducts.toLocaleString('en-IN')}
            </span>
            <span className="sl-hero__stat-label">Products</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default React.memo(HeroSection);
