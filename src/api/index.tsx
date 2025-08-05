import { Place } from '@/types/places';
import axios from 'axios';
import { useQuery } from 'react-query';


interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}


export const useGetPlaces = ( categories?: []) => useQuery<Place[], void>({
    queryKey: ['places'],
    queryFn: async () =>( await axios.get('https://admin.tre.ma/items/places', {
      params: { categories },
      headers: {
        Authorization: "Bearer BNVt0x6gTllbqy2vbBpWFB6x8Y9se2Q0"
      }
    })).data.data ,
  });

// New method to get places from dummy.json with filter
import dummyData from './dummy.json';

// Helper function to filter places by categories
function filterPlacesByCategories(places: Place[], categories?: string[]): Place[] {
  if (!categories || categories.length === 0) return places;
  return places.filter(place => {
    // Assuming place.categories is an array of strings
    if (!Array.isArray((place as any).categories)) return false;
    return categories.some(cat => (place as any).categories.includes(cat));
  });
}

// Hook to get places from dummy.json with filter
export const useGetDummyPlaces = (categories?: string[]) =>
  useQuery<Place[], void>({
    queryKey: ['dummyPlaces', categories],
    queryFn: async () => {
      // @ts-ignore
      const places: Place[] = dummyData.data;
      return filterPlacesByCategories(places, categories);
    },
  });


export type { Place, ApiResponse };
