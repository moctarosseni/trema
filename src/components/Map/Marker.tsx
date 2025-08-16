import React, { useState, useRef } from 'react';
import { Marker as LMarker, MarkerProps as LMarkerProps, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Place } from '@/types/places';
import Image from 'next/image';
import Pin from "@/assets/icon_default.png"
import Phone from '../icons/Phone';
import Globe from '../icons/Globe';

interface MarkerProps extends Omit<LMarkerProps, 'position'>  {
  place: Place;
}

const Marker = ({ place, ...rest }: MarkerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const markerRef = useRef<any>(null);

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
    >
     <Popup 
        className='!px-6 !py-4' 
        closeButton={false}  
        closeOnEscapeKey={true}
      >
        <div className="min-w-[80px]">
          <div className="text-sm text-[#191B1E] mb-2">{place.name}</div>
          <div className="flex flex-row gap-3">
            <span className='w-[16px]'>
              <Phone />
            </span>
            <span className='w-[16px]'>
              <Globe />
            </span>
            <Image src={Pin} width={18} height={18}  alt='Position Géorgaphique'/>
          </div>
        </div>
      </Popup>
    </LMarker>
  );
};

export default Marker;
