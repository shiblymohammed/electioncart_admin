/**
 * Animation utility functions for the admin panel
 */

/**
 * Count up animation from start to end value
 * @param start - Starting number
 * @param end - Ending number
 * @param duration - Animation duration in milliseconds
 * @param onUpdate - Callback function called on each frame with current value
 */
export const countUp = (
  start: number,
  end: number,
  duration: number,
  onUpdate: (value: number) => void
): (() => void) => {
  const range = end - start;
  const increment = range / (duration / 16); // 60fps
  let current = start;
  let animationFrame: number;

  const animate = () => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      onUpdate(Math.floor(current));
      return;
    }
    onUpdate(Math.floor(current));
    animationFrame = requestAnimationFrame(animate);
  };

  animationFrame = requestAnimationFrame(animate);

  // Return cleanup function
  return () => cancelAnimationFrame(animationFrame);
};

/**
 * Stagger animation delay calculator
 * @param index - Item index in list
 * @param baseDelay - Base delay in milliseconds
 * @returns Delay in milliseconds
 */
export const staggerDelay = (index: number, baseDelay: number = 50): number => {
  return index * baseDelay;
};

/**
 * Easing functions for animations
 */
export const easing = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  linear: 'linear',
};

/**
 * Animation duration constants
 */
export const duration = {
  fast: 150,
  normal: 300,
  slow: 500,
};
