import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import '../styles/ActionButtons.css';

function ActionButtons({ productName, onEdit, onDelete }) {
  return (
    <div className="sl-actions">
      <button
        type="button"
        className="sl-action-btn sl-action-btn--edit"
        onClick={onEdit}
        aria-label={`Edit ${productName}`}
      >
        <Pencil size={15} strokeWidth={2.25} />
        <span className="sl-action-btn__tooltip">Edit</span>
      </button>
      <button
        type="button"
        className="sl-action-btn sl-action-btn--delete"
        onClick={onDelete}
        aria-label={`Delete ${productName}`}
      >
        <Trash2 size={15} strokeWidth={2.25} />
        <span className="sl-action-btn__tooltip">Delete</span>
      </button>
    </div>
  );
}

export default React.memo(ActionButtons);
