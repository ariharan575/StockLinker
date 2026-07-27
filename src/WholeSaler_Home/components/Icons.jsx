// components/Icons.jsx
// A small, dependency-free icon set. Kept local so this dashboard body
// doesn't require adding an icon library to the host app. Swap for
// lucide-react / heroicons freely if the host project already has one.

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const BoxIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M21 8l-9-5-9 5 9 5 9-5Z" />
    <path d="M3 8v8l9 5 9-5V8" />
    <path d="M12 13v8" />
  </svg>
);

export const MessageIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
  </svg>
);

export const PackageIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M16.5 9.4 7.5 4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.27 6.96 8.73 5.05 8.73-5.05" />
    <path d="M12 22.08V12" />
  </svg>
);

export const TrendUpIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

export const CameraIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2Z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export const PlusIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const EditIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);

export const TrashIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </svg>
);

export const ArrowRightIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export const ChevronLeftIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const ChevronRightIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export const StarIcon = (props) => (
  <svg viewBox="0 0 24 24" {...{ ...base, fill: "currentColor", stroke: "none" }} {...props}>
    <path d="M12 2.5 15.1 8.8 22 9.8l-5 4.9 1.2 6.9-6.2-3.3L5.8 21.6 7 14.7l-5-4.9 6.9-1Z" />
  </svg>
);

export const MapPinIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const InboxIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
  </svg>
);

export const EyeIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
