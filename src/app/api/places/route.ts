import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    console.log("Search Params =>", searchParams);
    
    // Récupération des paramètres de requête
    const bounds = searchParams.get('bounds')
    const categories = searchParams.get('categories')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const zoom_level = parseInt(searchParams.get('zoom_level') || '1')

    
    // Construction des paramètres pour la fonction Supabase
    const params: any = {
      // p_limit: limit,
      // p_page: page
    }
    
    if (bounds) {
      try {
        const boundsObj = JSON.parse(bounds)
        params.max_lat = boundsObj.north
        params.min_lat = boundsObj.south
        params.max_lng = boundsObj.east
        params.min_lng = boundsObj.west
      } catch (e) {
        console.error('Invalid bounds parameter:', e)
      }
    }
    
    if (categories) {
      try {
        params.filtered_categories = JSON.parse(categories)
      } catch (e) {
        console.error('Invalid categories parameter:', e)
      }
    }

    const options = {
      min_lng: params.min_lng,  
      min_lat: params.min_lat, 
      max_lng: params.max_lng, 
      max_lat: params.max_lat, 
      zoom_level: zoom_level, 
      filtered_categories: params.filtered_categories || [],
      max_places: 100, 
    }

    console.log(options)
    
    // Appel de la fonction Supabase get_visible_places
    const { data, error } = await supabase.rpc('get_map_visible_places', options)

    console.log('Supabase data:', data.length)
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch places', details: error.message },
        { status: 500 }
      )
    }
    
    
    return NextResponse.json({
      data: data || [],
      count: data?.length || 0,
      hasMore: data && data.length === limit,
      page,
      limit
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 