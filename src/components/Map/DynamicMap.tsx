"use client"
import { Place } from '@/api';
import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the Map component with no SSR
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">Loading map...</div>
})

interface DynamicMapProps {
  places: Place[]
  loading?: boolean
}

const DynamicMap = ({ places, loading }: DynamicMapProps) => {
  return <MapComponent places={places} loading={loading} />
}

export default DynamicMap 