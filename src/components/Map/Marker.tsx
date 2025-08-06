import React, { useState, useRef, useEffect } from 'react';
import { Marker as LMarker, MarkerProps as LMarkerProps, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Place } from '@/types/places';
import Image from 'next/image';
import Phone from "@/assets/phone.png"
import Globe from "@/assets/globe.png"
import Pin from "@/assets/icon_default.png"

interface MarkerProps extends Omit<LMarkerProps, 'position'>  {
  place: Place;
}

const Marker = ({ place, ...rest }: MarkerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const markerRef = useRef<any>(null);

  

  // Update icon when popup state changes
  // useEffect(() => {
  //   const marker = markerRef.current;
  //   if (!marker) return;

  //   const icon = L.icon({
  //     iconUrl: isOpen ? "/icon_active.png" : "/icon_default.png",
  //     iconRetinaUrl: isOpen ? "/icon_active.png" : "/icon_default.png",
  //     iconSize: [32, 32],
  //     iconAnchor: [16, 32],
  //     popupAnchor: [0, 116],
  //   });

  //   marker.setIcon(icon);
  // }, [isOpen]);

  const handleMarkerClick = () => {
    const marker = markerRef.current;
    if (!marker) return;

    if (isOpen) {
      // Close existing popup if any
      if (marker._popup) {
        try {
          marker._popup.remove();
        } catch (error) {
          console.log('Popup already removed');
        }
        marker._popup = null;
      }
      setIsOpen(false);
    } else {
      // Use the marker's built-in popup methods
      const popupContent = `
        <div class="px-6 py-4">
          <div class="text-sm text-[#191B1E] mb-2">${place.name}</div>
          <div class="flex flex-row gap-3">
            <img src="/phone.png" width="16" height="16" alt="Contact"/>
            <img src="/globe.png" width="16" height="16" alt="Site Web"/>
            <img src="/icon_default.png" width="18" height="18" alt="Position Géographique"/>
          </div>
        </div>
      `;
      
      // Use the marker's bindPopup method instead of creating a standalone popup
      marker.bindPopup(popupContent, {
        className: '!px-6 !py-4',
        closeButton: false,
        closeOnEscapeKey: true,
      });
      
      marker.openPopup();
      
      // Store reference to popup
      marker._popup = marker.getPopup();
      
      // Add event listener for popup close
      marker.on('popupclose', () => {
        setIsOpen(false);
        marker._popup = null;
      });
      
      setIsOpen(true);
    }
  };

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
        popupAnchor: [0, 116],
      })}
      zIndexOffset={999}
      // eventHandlers={{
      //   click: handleMarkerClick
      // }}
    >
     <Popup 
        className='!px-6 !py-4' 
        closeButton={false}  
        closeOnEscapeKey={true}
      >
        <div className="">
          <div className="text-sm text-[#191B1E] mb-2">{place.name}</div>
          <div className="flex flex-row gap-3">
            <Image src={Phone} width={16} height={16} alt='Contact'/>
            <Image src={Globe} width={16} height={16}  alt='Site Web'/>
            <Image src={Pin} width={18} height={18}  alt='Position Géorgaphique'/>
          </div>
        </div>
      </Popup>
    </LMarker>
  );
};

export default Marker;
