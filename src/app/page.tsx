"use client"
import Logo from "@/components/icons/Logo";
import Map from "@/components/Map";
import Filter from "@/components/Filter";
import { useState, useEffect, useCallback, useRef } from "react";
import { useMapInfiniteScroll, BoundsChangeData } from "@/hooks/useMapInfiniteScroll";
import { useGetPlaces } from "@/api";
import 'react-leaflet-markercluster/styles'
import { GetVisiblePlacesParams } from "@/types/places";
import { Position } from "@/components/Map/MapComponent";
import { DEFAULT_BOUNDS, DEFAUlT_POSITION, MOVEMENT_THRESHOLD } from "@/config";

export default function Home() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(DEFAUlT_POSITION);
  const [filters, setFilters] = useState<GetVisiblePlacesParams>({
    bounds: DEFAULT_BOUNDS,
    categories: [],
    limit: 100,
    page: 1
  });
  
  const previousBoundsRef = useRef<typeof DEFAULT_BOUNDS>(DEFAULT_BOUNDS);
  const currentZoomRef = useRef<number>(13);
  
  const getBounds = useCallback((position?: Position) => {
    if(!position) position = DEFAUlT_POSITION;
    const offset = 0.01; 
    return {
      north: position.lat + offset,
      south: position.lat - offset,
      east: position.lng + offset,
      west: position.lng - offset
    };
  }, []);

  const getMovementThreshold = useCallback((zoom: number) => {
    if (zoom <= 12) return 0.02;
    if (zoom <= 15) return 0.01;
    return 0.005;
  }, []);

  const isSignificantMovement = useCallback((newBounds: typeof DEFAULT_BOUNDS, zoom: number) => {
    const prev = previousBoundsRef.current;
    const threshold = getMovementThreshold(zoom);
    
    const latChange = Math.abs(newBounds.north - prev.north) + Math.abs(newBounds.south - prev.south);
    const lngChange = Math.abs(newBounds.east - prev.east) + Math.abs(newBounds.west - prev.west);
    
    
    return latChange > threshold || lngChange > threshold;
  }, [getMovementThreshold]);

  const {  data: placesData, isLoading } = useGetPlaces(filters);

  const places = placesData?.data || [];
    
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         setUserLocation({ lat: latitude, lng: longitude });
  //         setFilters({ ...filters, bounds: getBounds({ lat: latitude, lng: longitude }) });
  //         previousBoundsRef.current = DEFAULT_BOUNDS;
  //       },
  //     );
  //   } 
  // }, []);


  const { handleBoundsChange } = useMapInfiniteScroll({
    onBoundsChange: (data: BoundsChangeData) => {
      const { bounds: newBounds, zoom } = data;
      currentZoomRef.current = zoom;
      
      // Vérifier si le mouvement est suffisamment important avant de mettre à jour les filtres
      if (isSignificantMovement(newBounds, zoom)) {
        setFilters({ ...filters, bounds: newBounds });
        previousBoundsRef.current = newBounds;
      } 
    },
    debounceMs: 500,
    minDistanceThreshold: getMovementThreshold(currentZoomRef.current),
  });


  const handleMapBoundsChange = useCallback((data: BoundsChangeData) => {
    handleBoundsChange(data);
  }, [handleBoundsChange]);

  const handleCategoriesChange = useCallback((newCategories: string[]) => {
    setFilters({ ...filters, categories: newCategories});
  }, []);

  return (
    <div className={"h-screen flex flex-col dark"}>
      <div className="pt-[36px] px-8">
        <div className=""><Logo/></div>
        
        <Filter 
          selectedCategories={filters.categories || []}
          onCategoriesChange={handleCategoriesChange}
        />
      </div>
      
      <div className="flex-1 relative">
        <Map 
          places={places} 
          loading={isLoading} 
          onBoundsChange={handleMapBoundsChange}
          userLocation={userLocation}
          categories={filters.categories}
        />
      </div>
    </div>
  );
}
