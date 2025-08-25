import { GetVisiblePlacesParams, GetVisiblePlacesResponse, Place } from '@/types/places';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';


export const useGetPlaces = ({ categories, bounds, limit = 100, page }: GetVisiblePlacesParams) => useQuery({
  queryKey: ['places', categories, bounds],
  queryFn: async () => {
    const queryParams = new URLSearchParams()
    
    if (bounds) {
      queryParams.append('bounds', JSON.stringify(bounds))
    }
    if (!!categories?.length) {
      queryParams.append('categories', JSON.stringify(categories))
    }
    if (limit) {
      queryParams.append('limit', limit.toString())
    }
    queryParams.append('page', page?.toString() || '1')
    
    return (await axios.get(`/api/places?${queryParams}`)).data as GetVisiblePlacesResponse
   
  },
  enabled: !!bounds,
  // keepPreviousData: true,
  refetchOnMount: false,
});


export function filterPlacesByCategories(places: Place[], categories?: string[]): Place[] {
  if (!categories || categories.length === 0) return places;
  return places.filter(place => {
    if (!Array.isArray((place as any).categories)) return false;
    return categories.some(cat => (place as any).categories.includes(cat));
  });
}