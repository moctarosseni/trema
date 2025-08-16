"use client"
import { useGetPlacesInfinite } from "@/api";
import Logo from "@/components/icons/Logo";
import Map from "@/components/Map";
import Filter from "@/components/Filter";
import { useState, useEffect, useCallback } from "react";
import { useMapInfiniteScroll } from "@/hooks/useMapInfiniteScroll";

import 'react-leaflet-markercluster/styles'
import { GetPlaceDto, Place } from "@/types/places";
import { Position } from "@/components/Map/MapComponent";

const defaultBounds = {
  north: 48.79, 
  south: 48.93,
  east: 2.16,
  west: 2.51
};

const defaultPosition = { lat: 48.8566, lng: 2.3522 } 

export default function Home() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<Position | null>(defaultPosition);
  const [accumulatedPlaces, setAccumulatedPlaces] = useState<Place[]>([]);

  useEffect(() => {
    if (navigator.geolocation) {
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

  const { bounds, handleBoundsChange, resetBounds } = useMapInfiniteScroll({
    onBoundsChange: (newBounds) => {
      setFilters(prev => ({ ...prev, bounds: newBounds }))
    },
    debounceMs: 500
  });

  const getDefaultBounds = () => {
    if (userLocation) {
      const offset = 0.01; 
      return {
        north: userLocation.lat + offset,
        south: userLocation.lat - offset,
        east: userLocation.lng + offset,
        west: userLocation.lng - offset
      };
    }
    return defaultBounds;
  };

  const [filters, setFilters] = useState<GetPlaceDto>({
    categories: selectedCategories,
    bounds: getDefaultBounds(),
    limit: 500, 
    page: 1
  })

  useEffect(() => {
    if (userLocation) {
      setFilters(prev => ({ ...prev, bounds: getDefaultBounds() }));
    }
  }, [userLocation]);

  const { data: infiniteData, isFetching } = useGetPlacesInfinite(filters);

  const addNewPlaces = (newPlaces: Place[]) => {
    setAccumulatedPlaces(prevPlaces => {
      const updatedPlaces = [...prevPlaces];
      let addedCount = 0;
      const placeIds = prevPlaces.flatMap((place) => place.place_id)
      
      newPlaces.forEach(place => {
        if (!placeIds.includes(place.place_id)) {
          updatedPlaces.push(place);
          addedCount++;
        }
      });

      return updatedPlaces;
    });
  }

  useEffect(() => {
    if (infiniteData?.pages) {
      infiniteData.pages.forEach((page, index) => {
        if (page?.data && page.data.length > 0) {
          addNewPlaces(page.data);
        }
      });
    }
  }, [infiniteData]);

  useEffect(() => {
    setAccumulatedPlaces([]);
    resetBounds();
  }, [selectedCategories, resetBounds]);

  const handleMapBoundsChange = useCallback((newBounds: typeof defaultBounds) => {
    handleBoundsChange(newBounds);
  }, [handleBoundsChange]);

  const handleCategoriesChange = useCallback((newCategories: string[]) => {
    setSelectedCategories(newCategories);
    setFilters(prev => ({ ...prev, categories: newCategories }));
  }, []);

  return (
    <div className={"h-screen  flex flex-col dark"}>
      <div className="pt-[36px] px-8">
        <div className=""><Logo/></div>
        
        <Filter 
          selectedCategories={selectedCategories}
          onCategoriesChange={handleCategoriesChange}
        />
        
      </div>
      <div className="flex-1 relative">
        <Map 
          places={accumulatedPlaces} 
          loading={isFetching} 
          onBoundsChange={handleMapBoundsChange}
          userLocation={userLocation}
        />
      </div>
    </div>
  );
}
