import React, { useCallback, useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet';
import { Bound } from './MapComponent';

export interface BoundsChangeData {
  bounds: Bound;
  zoom: number;
}

const MapEvent = ({ onBoundsChange }: {
  onBoundsChange?: (data: BoundsChangeData) => void
}) => {
  const map = useMap();
  const lastBounds = useRef<L.LatLngBounds | null>(null);
  const lastBoundsChangeTime = useRef<number>(0);
  const boundsChangeThreshold = 0.05; 
  const minTimeBetweenChanges = 1000; 
  const lastFetchTime = useRef<number>(0);
  const minTimeBetweenFetches = 2000; 
  const zoomLevel = useRef<number>(map.getZoom());

  const handleBoundsChange = useCallback(() => {
    const bounds = map.getBounds();
    const currentZoom = map.getZoom();
    const now = Date.now();
    
    const isZoomChange = Math.abs(currentZoom - zoomLevel.current) > 0.1;
    zoomLevel.current = currentZoom;
    
    if (!lastBounds.current || 
        !lastBounds.current.equals(bounds, boundsChangeThreshold) ||
        (now - lastBoundsChangeTime.current) > minTimeBetweenChanges ||
        isZoomChange) {
      
      lastBounds.current = bounds;
      lastBoundsChangeTime.current = now;
      
      const newBounds = {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      };
      
      onBoundsChange?.({ bounds: newBounds, zoom: currentZoom });
    }
  }, [map, onBoundsChange]);

  const handleChange = useCallback(() => {
    handleBoundsChange();
  }, [handleBoundsChange]);


  useEffect(() => {
    map.on('moveend', handleChange);
    map.on('zoomend', handleChange);
    map.on('move', handleChange);

    return () => {
      map.off('moveend', handleChange);
      map.off('zoomend', handleChange);
      map.off('move', handleChange);
    };
  }, [map, handleChange]);

  return null;
};
  

export default MapEvent
