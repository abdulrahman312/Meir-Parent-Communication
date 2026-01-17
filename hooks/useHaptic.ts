import { useCallback } from 'react';

export const useHaptic = () => {
  const triggerHaptic = useCallback((pattern: number | number[] = 10) => {
    // Check if navigator and vibrate are available
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Fail silently if vibration is blocked or not supported
      }
    }
  }, []);

  return { triggerHaptic };
};