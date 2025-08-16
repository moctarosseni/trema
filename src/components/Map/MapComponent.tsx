"use client"
import React from 'react'
import { MapContainer, TileLayer  } from "react-leaflet";
import L from 'leaflet';
import { Place } from '@/types/places';
import Marker from './Marker';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import MapEvent from './MapEvent';

export interface Bound { north: number; south: number; east: number; west: number }
export interface Position { lat: number; lng: number }
export interface MapComponentProps {
  places: Place[]
  loading?: boolean
  onBoundsChange?: (bounds: Bound) => void
  userLocation?: Position | null
}

const defaultPosition = { lat: 48.8566, lng: 2.3522 } 

const MapComponent = ({ 
  places, 
  loading, 
  onBoundsChange,
  userLocation
}: MapComponentProps) => {

  const centerPosition = userLocation || defaultPosition;

  return (
    <>
      <MapContainer 
        className='h-full w-full relative' 
        center={centerPosition}
        zoom={13} 
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEvent 
          onBoundsChange={onBoundsChange}
        />
        
        <MarkerClusterGroup
          showCoverageOnHover={true}
          maxClusterRadius={60}
          spiderfyOnMaxZoom={true}
          zoomToBoundsOnClick={true}
          removeOutsideVisibleBounds={false} // Keep markers outside viewport to show accumulated data
          //@ts-expect-error
          iconCreateFunction={(cluster) => {
            return L.divIcon({
              html: `${cluster.getChildCount()}`,
              className: 'marker-cluster-custom',
              iconSize: L.point(40, 40, true),
            });
          }}
          eventHandlers={{
            clusterclick: (e: any) => {
              e.originalEvent.stopPropagation();
            },
          }}
        >
          {places?.map((place) => <Marker key={place.place_id} place={place} />)}
        </MarkerClusterGroup>
      </MapContainer>
      
      {loading && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 z-[999]">
          <div className="w-5 h-5 border-2 border-[#191B1E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </>
  )
}

export default MapComponent 