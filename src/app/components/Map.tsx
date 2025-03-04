"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngTuple, divIcon, Marker as LeafletMarker } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import { CateringPoint } from '@/lib/types';

interface MapProps {
  points: CateringPoint[];
}

// Кастомная иконка для маркеров заведений с использованием divIcon
const customIcon = (point: CateringPoint) =>
  divIcon({
    html: `
      <div class="relative w-[40px] h-[40px]">
        <img src="/icons/restaurant.png" alt="${point.Name}" class="w-full h-full object-contain" />
      </div>
    `,
    className: '', // Убираем стандартные стили Leaflet
    iconSize: [40, 40], // Размер иконки
    iconAnchor: [20, 40], // Точка привязки (центр снизу)
  });

export default function Map({ points }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const center: LatLngTuple = [55.751244, 37.618423];

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return <div>Загрузка карты...</div>;
  }

  // Функция для создания кастомной иконки кластера
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
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: '600px', width: '100%' }}
    >
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
          points.map((point) => (
            <Marker
              key={point.id}
              position={point.geoData.coordinates}
              icon={customIcon(point)} // Используем divIcon для полной области
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
          ))
        ) : (
          <div>Нет данных для отображения</div>
        )}
      </MarkerClusterGroup>
    </MapContainer>
  );
}