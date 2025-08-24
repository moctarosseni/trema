import { useState, useCallback, useRef } from 'react';

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface BoundsChangeData {
  bounds: MapBounds;
  zoom: number;
}

interface UseMapInfiniteScrollOptions {
  onBoundsChange?: (data: BoundsChangeData) => void;
  debounceMs?: number;
}

export const useMapInfiniteScroll = (options: UseMapInfiniteScrollOptions = {}) => {
  const { onBoundsChange, debounceMs = 300 } = options;
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleBoundsChange = useCallback((data: BoundsChangeData) => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce bounds changes to avoid too many API calls
    debounceTimeoutRef.current = setTimeout(() => {
      setBounds(data.bounds);
      onBoundsChange?.(data);
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