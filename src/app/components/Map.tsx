"use client";

import { useEffect, useState } from 'react';
import { TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngTuple, divIcon, Marker as LeafletMarker } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import { CateringPoint } from '@/lib/types';

interface MapProps {
  points: CateringPoint[];
}

const customIcon = (point: CateringPoint) =>
  divIcon({
    html: `
      <div class="relative w-[40px] h-[40px]">
        <img src="/icons/restaurant.png" alt="${point.Name}" class="w-full h-full object-contain" />
      </div>
    `,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

export default function Map({ points }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const map = useMap();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  console.log('Map received points:', points); // Отладка

  if (!isMounted) {
    return <div>Загрузка карты...</div>;
  }

  const clusterIconCreateFunction = (cluster: any) => {
    const childCount = cluster.getChildCount();
    const size = childCount < 10 ? 40 : childCount < 100 ? 48 : 56;
    const className = `bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold shadow-md`;
    return divIcon({
      html: `<div class="${className}" style="width: ${size}px; height: ${size}px; line-height: ${size}px;">${childCount}</div>`,
      className: 'custom-cluster-icon',
      iconSize: [size, size],
    });
  };

  return (
    <>
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup
        iconCreateFunction={clusterIconCreateFunction}
        disableClusteringAtZoom={15}
        maxClusterRadius={50}
      >
        {points && points.length > 0 ? (
          points.map((point) => {
            console.log('Rendering point:', point); // Отладка рендеринга
            return (
              <Marker
                key={point.id}
                position={point.geoData.coordinates}
                icon={customIcon(point)}
                eventHandlers={{
                  mouseover: (e) => {
                    const marker = e.target as LeafletMarker;
                    marker.openPopup();
                  },
                  mouseout: (e) => {
                    const marker = e.target as LeafletMarker;
                    marker.closePopup();
                  },
                }}
              >
                <Popup>
                  <div className="space-y-1">
                    <h3 className="font-bold">{point.Name}</h3>
                    <p>Компания: {point.OperatingCompany}</p>
                    <p>Тип: {point.TypeObject}</p>
                    <p>Адрес: {point.Address}</p>
                    <p>Мест: {point.SeatsCount}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })
        ) : (
          <div>Нет данных для отображения</div>
        )}
      </MarkerClusterGroup>
    </>
  );
}