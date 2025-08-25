import { GetPlaceDto, GetVisiblePlacesParams, GetVisiblePlacesResponse, Place } from '@/types/places';
import axios from 'axios';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

interface PlacesResponse {
  data: Place[];
  total: number;
  limit: number;
  page: number
}

interface ApiResponse {
  data: Place[],
  meta: {
    filter_count: number
    total_count: number,
    page_count?: number
  }
}


export const useGetPlacesInfinite = ({categories, bounds, limit = 500 }: GetPlaceDto) => useInfiniteQuery<PlacesResponse, void>({
  queryKey: ['placesInfinite', categories, bounds],
  queryFn: async ({ pageParam = 1 }) => {
    
    let searchParams = `limit=${limit}&page=${pageParam}&meta=*`;
    
    if (bounds) {
      searchParams += `&filter[latitude][_gte]=${bounds.south}&filter[latitude][_lte]=${bounds.north}&filter[longitude][_gte]=${bounds.west}&filter[longitude][_lte]=${bounds.east}`;
    }
    
    // if (categories && categories.length > 0) {
    //   const filterObject = {
    //     _or: categories.map(cat => ({
    //       categories: { _contains: cat }
    //     }))
    //   };
    //   searchParams += `&filter=${encodeURIComponent(JSON.stringify(filterObject))}`;
    // }

    try {
      const response = await axios.get(`https://admin.tre.ma/items/places?${searchParams}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
        }
      });
      
      const { data , meta } = response.data as ApiResponse;
      
      return {
        data: filterPlacesByCategories(data, categories),
        total: meta.filter_count,
        limit,
        page_count: Math.ceil(meta.filter_count / limit),
        page: pageParam
      };
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },
  getNextPageParam: (lastPage, allPages) => {
    const nextOffset = allPages.length * lastPage.limit;
    return nextOffset < lastPage.total ? allPages.length + 1 : undefined;
  },
  enabled: !!bounds,
  keepPreviousData: true, 
  refetchOnMount: false, 
});

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
  keepPreviousData: true,
  refetchOnMount: false,
});


function filterPlacesByCategories(places: Place[], categories?: string[]): Place[] {
  if (!categories || categories.length === 0) return places;
  return places.filter(place => {
    if (!Array.isArray((place as any).categories)) return false;
    return categories.some(cat => (place as any).categories.includes(cat));
  });
}