import React, { useState, useRef, useEffect } from 'react';
import { Marker as LMarker, MarkerProps as LMarkerProps, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Place } from '@/types/places';

interface MarkerProps extends Omit<LMarkerProps, 'position'>  {
  place: Place;
}

const Marker = ({ place, ...rest }: MarkerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    marker.on('popupopen', handleOpen);
    marker.on('popupclose', handleClose);
    return () => {
      marker.off('popupopen', handleOpen);
      marker.off('popupclose', handleClose);
    };
  }, []);

  return (
    <LMarker
      ref={markerRef}
      {...rest}
      position={[place.latitude, place.longitude]}
      icon={L.icon({
        iconUrl: isOpen ? "/icon_active.png" : "/icon_default.png",
        iconRetinaUrl: isOpen ? "/icon_active.png" : "/icon_default.png",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      })}
    >
      <Popup>
        <strong>{place.name}</strong>
        <br />
        {place.address}
      </Popup>
    </LMarker>
  );
};

export default Marker;
