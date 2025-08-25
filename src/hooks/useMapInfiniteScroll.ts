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
  minDistanceThreshold?: number; // Distance minimale pour déclencher un nouveau fetch
}

export const useMapInfiniteScroll = (options: UseMapInfiniteScrollOptions = {}) => {
  const { 
    onBoundsChange, 
    debounceMs = 300,
    minDistanceThreshold = 0.01 
  } = options;
  
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastBoundsRef = useRef<MapBounds | null>(null);

  // Fonction pour calculer la distance entre deux bounds
  const calculateBoundsDistance = useCallback((bounds1: MapBounds, bounds2: MapBounds): number => {
    const latDiff = Math.abs(bounds1.north - bounds2.north) + Math.abs(bounds1.south - bounds2.south);
    const lngDiff = Math.abs(bounds1.east - bounds2.east) + Math.abs(bounds1.west - bounds2.west);
    return latDiff + lngDiff;
  }, []);


  const getMovementThreshold = useCallback((zoom: number) => {
    if (zoom <= 12) return 0.02;
    if (zoom <= 15) return 0.01;
    return 0.005;
  }, []);


  const isSignificantMovement = useCallback((oldBounds: MapBounds, newBounds: MapBounds, zoom: number) => {
    const prev = oldBounds;
    const threshold = getMovementThreshold(zoom);
    
    const latChange = Math.abs(newBounds.north - prev.north) + Math.abs(newBounds.south - prev.south);
    const lngChange = Math.abs(newBounds.east - prev.east) + Math.abs(newBounds.west - prev.west);
    
    
    return latChange > threshold || lngChange > threshold;
  }, [getMovementThreshold]);

  const handleBoundsChange = useCallback((data: BoundsChangeData) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Vérifier si le changement est suffisamment important
    const isSignificantChange = !lastBoundsRef.current || 
        isSignificantMovement(lastBoundsRef.current, data.bounds, data.zoom) 

    if (!isSignificantChange) {
      return; 
    }

    // Débouncer les changements de bounds pour éviter trop d'appels API
    debounceTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(true);
      
      // Petit délai pour permettre la transition visuelle
      setTimeout(() => {
        setBounds(data.bounds);
        lastBoundsRef.current = data.bounds;
        onBoundsChange?.(data);
        
        // Marquer la fin de la transition
        setTimeout(() => {
          setIsTransitioning(false);
        }, 200);
      }, 100);
    }, debounceMs);
  }, [onBoundsChange, debounceMs, minDistanceThreshold, calculateBoundsDistance]);

  const resetBounds = useCallback(() => {
    setBounds(null);
    lastBoundsRef.current = null;
    setIsTransitioning(false);
  }, []);

  return {
    bounds,
    isTransitioning,
    handleBoundsChange,
    resetBounds,
  };
}; 