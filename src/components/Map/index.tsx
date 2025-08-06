"use client"
import React from 'react'
import dynamic from 'next/dynamic'
import { Place } from '@/types/places';

export const MapLoader = () => {
  return <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">Chargement de la carte...</div>
}

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <MapLoader />
})

interface MapProps {
  places: Place[]
  loading?: boolean
}

const Map = ({ places, loading }: MapProps) => {
  return <MapComponent places={places} loading={loading} />
}

export default Map
