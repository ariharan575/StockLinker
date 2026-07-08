import React from 'react';
import '../styles/SkeletonLoader.css';

function SkeletonRow({ delay }) {
  return (
    <div className="sl-skel-row" style={{ animationDelay: `${delay}ms` }}>
      <div className="sl-skel-row__name">
        <div className="sl-skel sl-skel--title" />
        <div className="sl-skel sl-skel--subtitle" />
      </div>
      <div className="sl-skel sl-skel--block" />
      <div className="sl-skel sl-skel--pill" />
      <div className="sl-skel sl-skel--block" />
      <div className="sl-skel sl-skel--block" />
      <div className="sl-skel sl-skel--block" />
      <div className="sl-skel sl-skel--pill" />
      <div className="sl-skel sl-skel--block" />
      <div className="sl-skel-row__actions">
        <div className="sl-skel sl-skel--circle" />
        <div className="sl-skel sl-skel--circle" />
      </div>
    </div>
  );
}

function SkeletonLoader({ rows = 6 }) {
  return (
    <div className="sl-skel-list" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} delay={i * 60} />
      ))}
    </div>
  );
}

export default SkeletonLoader;
