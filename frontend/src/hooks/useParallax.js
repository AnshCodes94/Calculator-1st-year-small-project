import { useState, useEffect } from 'react';

/**
 * Tracks subtle cursor position for GPU parallax and card spotlighting.
 * Disables automatically when prefers-reduced-motion is enabled.
 */
export const useParallax = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);

    const handleMediaChange = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handleMediaChange);

    const handleMouseMove = (e) => {
      if (prefersReducedMotion) return;
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth) * 2 - 1; // -1 to +1
      const normY = (e.clientY / innerHeight) * 2 - 1; // -1 to +1
      setCoords({
        x: e.clientX,
        y: e.clientY,
        normalizedX: normX,
        normalizedY: normY
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      mq.removeEventListener('change', handleMediaChange);
    };
  }, [prefersReducedMotion]);

  return { ...coords, prefersReducedMotion };
};
