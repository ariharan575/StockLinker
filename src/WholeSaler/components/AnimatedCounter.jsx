// components/AnimatedCounter.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * Counts up from 0 to `value` using requestAnimationFrame.
 * Pure CSS/Tailwind + React per the "no animation libraries" constraint.
 */
function AnimatedCounter({ value, duration = 900, prefix = "", suffix = "" }) {
  const [display, setDisplay] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out-quad for a natural deceleration
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => frame.current && cancelAnimationFrame(frame.current);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default React.memo(AnimatedCounter);
