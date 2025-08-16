import { useState, useCallback, useRef } from 'react';

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface UseMapInfiniteScrollOptions {
  onBoundsChange?: (bounds: MapBounds) => void;
  debounceMs?: number;
}

export const useMapInfiniteScroll = (options: UseMapInfiniteScrollOptions = {}) => {
  const { onBoundsChange, debounceMs = 300 } = options;
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleBoundsChange = useCallback((newBounds: MapBounds) => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce bounds changes to avoid too many API calls
    debounceTimeoutRef.current = setTimeout(() => {
      setBounds(newBounds);
      onBoundsChange?.(newBounds);
    }, debounceMs);
  }, [onBoundsChange, debounceMs]);

  const resetBounds = useCallback(() => {
    setBounds(null);
  }, []);

  return {
    bounds,
    handleBoundsChange,
    resetBounds,
  };
}; 