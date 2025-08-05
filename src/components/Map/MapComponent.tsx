"use client"
import React from 'react'
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from 'leaflet';
import FillPin from '../icons/FillPin';
import { Place } from '@/types/places';

// Fix for default markers in react-leaflet
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

interface MapComponentProps {
  places: Place[]
  loading?: boolean
}

const position = { lat: 51.505, lng: -0.09}

const MapComponent = ({ places, loading }: MapComponentProps) => {
  return (
    <MapContainer 
        className='h-full w-full' 
        center={position} 
        zoom={13} scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <>
        {/* {places?.map(( { latitude, longitude}) => ( */}
          {places?.map((place) => (
            <Marker
              key={place.place_id}
              position={[place.latitude, place.longitude]}
              icon={L.divIcon({
                className: '',
                iconUrl:"/icon_default.png",
                // html: `<span style="display: flex; align-items: center; justify-content: center;">${require('react-dom/server').renderToString(<FillPin />)}</span>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
              })}
            >
              <Popup>
                <strong>{place.name}</strong>
                <br />
                {place.address}
              </Popup>
            </Marker>
          ))}
        {/* ))} */}
      </>
    </MapContainer>
  )
}

export default MapComponent 