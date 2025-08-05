"use client"
import React from 'react'
import dynamic from 'next/dynamic'
import { Place } from '@/types/places';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">Loading map...</div>
})

interface MapProps {
  places: Place[]
  loading?: boolean
}

const Map = ({ places, loading }: MapProps) => {
  return <MapComponent places={places} loading={loading} />
}

export default Map
