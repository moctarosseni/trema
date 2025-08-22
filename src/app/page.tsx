"use client"
import Logo from "@/components/icons/Logo";
import Map from "@/components/Map";
import Filter from "@/components/Filter";
import { useState, useEffect, useCallback } from "react";
import { useMapInfiniteScroll } from "@/hooks/useMapInfiniteScroll";
import { useGetPlaces } from "@/api";
import 'react-leaflet-markercluster/styles'
import { GetVisiblePlacesParams } from "@/types/places";
import { Position } from "@/components/Map/MapComponent";

const defaultBounds = {
  north: 48.79, 
  south: 48.93,
  east: 2.16,
  west: 2.51
};

const defaultPosition = { lat: 48.8566, lng: 2.3522 } 

export default function Home() {
  // const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(defaultPosition);
  const [filters, setFilters] = useState<GetVisiblePlacesParams>({
    bounds: defaultBounds,
    categories: [],
    limit: 100,
    page: 1
  });
  
  const getBounds = useCallback((position?: Position) => {
    if(!position) position = defaultPosition;
    const offset = 0.01; 
    return {
      north: position.lat + offset,
      south: position.lat - offset,
      east: position.lng + offset,
      west: position.lng - offset
    };
  }, []);

  const {  data: placesData, isLoading } = useGetPlaces(filters);

  const places = placesData?.data || [];

  console.log('Places data:', placesData);
  
  useEffect(() => {
    if (navigator.geolocation) {
      console.log('Geolocation is supported');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          setUserLocation(defaultPosition);
        }
      );
    } else {
      setUserLocation(defaultPosition);
    }
  }, []);


  const { handleBoundsChange } = useMapInfiniteScroll({
    onBoundsChange: (newBounds) => {
      setFilters({ ...filters, bounds: newBounds });
    },
    debounceMs: 500
  });


  const handleMapBoundsChange = useCallback((newBounds: typeof defaultBounds) => {
    handleBoundsChange(newBounds);
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
        />
      </div>
    </div>
  );
}
