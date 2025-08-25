"use client"
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from 'leaflet';
import 'leaflet.markercluster';
import { Place } from '@/types/places';
import MapEvent, { BoundsChangeData } from './MapEvent';
import { filterPlacesByCategories } from '@/api';

export interface Bound { north: number; south: number; east: number; west: number }
export interface Position { lat: number; lng: number }
export interface MapComponentProps {
  places: Place[]
  loading?: boolean
  onBoundsChange?: (data: BoundsChangeData) => void
  userLocation?: Position | null
  categories?: string[]
}

const defaultPosition = { lat: 48.8566, lng: 2.3522 } 

const DynamicMarkers = ({ places, categories }: { places: Place[], categories?: string[] }) => {
  const map = useMap();
  const clusterGroupRef = useRef<any>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!clusterGroupRef.current) {
      // Créer le cluster group avec Leaflet directement
      const clusterGroup = (L as any).markerClusterGroup({
        showCoverageOnHover: true,
        maxClusterRadius: 60,
        spiderfyOnMaxZoom: true,
        zoomToBoundsOnClick: true,
        removeOutsideVisibleBounds: false,
        iconCreateFunction: (cluster: any) => {
          return L.divIcon({
            html: `${cluster.getChildCount()}`,
            className: 'marker-cluster-custom',
            iconSize: L.point(40, 40, true),
          });
        }
      });

      clusterGroupRef.current = clusterGroup;
      map.addLayer(clusterGroup);
      setIsInitialized(true);
    }

    return () => {
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
        clusterGroupRef.current = null;
      }
    };
  }, [map]);

  useEffect(() => {
    if (!clusterGroupRef.current || !isInitialized) return;

    const clusterGroup = clusterGroupRef.current;
    const currentMarkers = markersRef.current;
    const currentPlaceIds = new Set(currentMarkers.keys());
    const newPlaceIds = new Set(places.map(place => place.place_id));

    // Supprimer les markers qui ne sont plus dans la liste filtrée
    currentMarkers.forEach((marker, placeId) => {
      if (!newPlaceIds.has(placeId)) {
        clusterGroup.removeLayer(marker);
        currentMarkers.delete(placeId);
      }
    });

    // Ajouter les nouveaux markers
    places.forEach(place => {
      if (!currentPlaceIds.has(place.place_id)) {
        const marker = L.marker([place.latitude, place.longitude], {
          icon: L.icon({
            iconUrl: "/icon_default.png",
            iconRetinaUrl: "/icon_default.png",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, 116],
          }),
          zIndexOffset: 999,
        });

        // Créer le contenu du popup
        const popupContent = `
          <div class="min-w-[80px]">
            <div class="text-sm text-[#191B1E] mb-2">${place.name}</div>
            <div class="flex flex-row gap-3">
              <img src="/phone.png" width="18" height="18" alt="Position Géographique"/>
              <img src="/globe.png" width="18" height="18" alt="Position Géographique"/>
              <img src="/icon_default.png" width="18" height="18" alt="Position Géographique"/>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          className: '!px-6 !py-4',
          closeButton: false,
          closeOnEscapeKey: true
        });

        // Animation d'apparition
        marker.setOpacity(0);
        clusterGroup.addLayer(marker);
        currentMarkers.set(place.place_id, marker);

        // Animation d'apparition progressive
        setTimeout(() => {
          marker.setOpacity(1);
        }, 50);
      }
    });

  }, [places, isInitialized, categories]);

  return null;
};

const MapComponent = ({ 
  places, 
  loading, 
  categories,
  onBoundsChange,
  userLocation
}: MapComponentProps) => {

  const centerPosition = userLocation || defaultPosition;

  const [availablePlaces, setAvailablePlaces] = useState<Place[]>(places);

  useEffect(() => {
    if(places?.length){
      const _places = [...availablePlaces, ...places];
      const uniquePlaces = Array.from(new Set(_places.map(place => place.place_id)))
        .map(id => _places.find(place => place.place_id === id));
      setAvailablePlaces(uniquePlaces.filter(place => place !== undefined) as Place[]);
    }
  }, [places]);

  // Filtrer les places selon les catégories
  const filteredPlaces = useMemo(() => {
    return filterPlacesByCategories(availablePlaces, categories);
  }, [availablePlaces, categories]);

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
        
        <MapEvent onBoundsChange={onBoundsChange} />
        
        <DynamicMarkers 
          places={filteredPlaces}
          categories={categories}
        />
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