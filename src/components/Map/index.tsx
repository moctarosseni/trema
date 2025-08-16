"use client"
import React from 'react'
import dynamic from 'next/dynamic'
import { MapComponentProps } from './MapComponent';

export const MapLoader = () => {
  return <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">Chargement de la carte...</div>
}

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <MapLoader />
})

const Map = ({ places, loading, onBoundsChange }: MapComponentProps) => {
  return (
    <MapComponent 
      places={places} 
      loading={loading} 
      onBoundsChange={onBoundsChange}
    />
  )
}

export default Map
