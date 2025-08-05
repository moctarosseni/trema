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


export type { Place, ApiResponse };
