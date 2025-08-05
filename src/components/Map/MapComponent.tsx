"use client"
import React, { useMemo } from 'react'
import { MapContainer, TileLayer } from "react-leaflet";
import L from 'leaflet';
import { Place } from '@/types/places';
import Marker from './Marker';
import MarkerClusterGroup from 'react-leaflet-markercluster';

interface MapComponentProps {
  places: Place[]
  loading?: boolean
}

const defaultPosition = { lat: 51.505, lng: -0.09}

const MapComponent = ({ places, loading }: MapComponentProps) => {

  // Calculate the center of the places we are showing
  const centerPosition = useMemo(() => {
    if (!places || places.length === 0) return defaultPosition;
    // Try to use location.coordinates if available, else fallback to latitude/longitude
    let latSum = 0, lngSum = 0, count = 0;
    places.forEach(place => {
      let lat: number | undefined, lng: number | undefined;
      if (place.location && Array.isArray(place.location.coordinates)) {
        // GeoJSON: [lng, lat]
        lng = place.location.coordinates[0];
        lat = place.location.coordinates[1];
      } else if (typeof place.latitude === "number" && typeof place.longitude === "number") {
        lat = place.latitude;
        lng = place.longitude;
      }
      if (typeof lat === "number" && typeof lng === "number") {
        latSum += lat;
        lngSum += lng;
        count++;
      }
    });
    if (count === 0) return defaultPosition;
    return { lat: latSum / count, lng: lngSum / count };
  }, [places]);


  return (
    <MapContainer 
      className='h-full w-full' 
      // center={centerPosition || position} 
      center={places.length  ?{
        lat:places[0].latitude,
        lng: places[0].longitude
      } : defaultPosition }
      zoom={13} 

    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup
        showCoverageOnHover={true}
        //@ts-expect-error
        iconCreateFunction={(cluster) => {
          return L.divIcon({
            html: `${cluster.getChildCount()}`,
            className: 'marker-cluster-custom',
            iconSize: L.point(40, 40, true),
          });
        }}
      >
        {places?.map((place) => <Marker key={place.place_id} place={place} />)}
      </MarkerClusterGroup>
    </MapContainer>
  )
}

export default MapComponent 