"use client"
import { useGetPlacesInfinite } from "@/api";
import CategoryItem from "@/components/CategoryItem";
import Logo from "@/components/icons/Logo";
import Map from "@/components/Map";
import { useState, useEffect, useCallback } from "react";
import { useMapInfiniteScroll } from "@/hooks/useMapInfiniteScroll";

import 'react-leaflet-markercluster/styles'
import { GetPlaceDto, Place } from "@/types/places";

const categorieList = [
  { value: "Hotels & Accommodations", label : "Hôtels & hébergements"},
  { value: "Restaurants", label : "Restaurants"},
  { value: "Bars & Nightlife", label : "Bars & Clubs"},
  { value: "Shoppings", label : "Shopping"},
  { value: "Arts", label : "Arts & Culture"},
  { value: "Cafes", label : "Cafés"},
]

const defaultBounds = {
  north: 48.9, 
  south: 48.8,
  east: 2.4,
  west: 2.3
};

export default function Home() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [accumulatedPlaces, setAccumulatedPlaces] = useState<Place[]>([]);

  const { bounds, handleBoundsChange, resetBounds } = useMapInfiniteScroll({
    onBoundsChange: (newBounds) => {
      setFilters(prev => ({ ...prev, bounds: newBounds }))
    },
    debounceMs: 500
  });

  const [filters, setFilters] = useState<GetPlaceDto>({
    categories: selectedCategories,
    bounds: bounds || defaultBounds,
    limit: 500, 
    page: 1
  })

  const { 
    data: infiniteData, 
    isLoading, 
    isFetchingNextPage, 
    hasNextPage, 
    isFetching,
    refetch
  } = useGetPlacesInfinite(filters);

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

  const handleToggleCategory = (value: string) => {
    if(selectedCategories.includes(value)) {
      return setSelectedCategories(selectedCategories.filter((cat) => cat !== value))
    }
    setSelectedCategories([ ...selectedCategories, value])
  }

  const handleRefresh = () => {
    setAccumulatedPlaces([]);
    refetch();
  };

  const totalPages = infiniteData?.pages?.length || 0;
  const totalPlacesBeforeDedup = infiniteData?.pages?.reduce((total, page) => total + (page.data?.length || 0), 0) || 0;

  return (
    <div className={"h-screen  flex flex-col dark"}>
      <div className="pt-[36px] px-8">
        <div className=""><Logo/></div>
        <div className="flex flex-row flex-wrap gap-3 py-6 ">
          <CategoryItem 
            label={"Tous les lieux"} 
            selected={!selectedCategories.length}
            onClick={() => setSelectedCategories([])}
          /> 
          {categorieList.map(({ label, value }) => (
            <CategoryItem 
              key={value} 
              label={label} selected={selectedCategories.includes(value)}
              onClick={() => handleToggleCategory(value)}
            /> 
          ))}
        </div>
        
        {/* Debug info - you can remove this later */}
        <div className="text-xs text-gray-500 mb-2 flex items-center gap-4">
          <span>Places uniques: {accumulatedPlaces.length}</span>
          <span>Total pages: {totalPages}</span>
          <span>Total API: {totalPlacesBeforeDedup}</span>
          <span>Has next page: {hasNextPage ? 'Yes' : 'No'}</span>
          <span>Loading next: {isFetchingNextPage ? 'Yes' : 'No'}</span>
          <span>Loading: {isLoading ? 'Yes' : 'No'}</span>
          <button 
            onClick={handleRefresh}
            className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs hover:bg-blue-200"
          >
            Refresh
          </button>
        </div>
        
      </div>
      <div className="flex-1 relative">
        <Map 
          places={accumulatedPlaces} 
          loading={isFetching} 
          onBoundsChange={handleMapBoundsChange}
        />
      </div>
    </div>
  );
}
