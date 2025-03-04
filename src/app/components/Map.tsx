"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import { CateringPoint } from '@/lib/types';

interface MapProps {
  points: CateringPoint[];
}

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

  return (
    <MapContainer
      key={Date.now()}
      center={center}
      zoom={10}
      style={{ height: '600px', width: '100%' }}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup>
        {points && points.length > 0 ? (
          points.map((point) => (
            <Marker key={point.id} position={point.geoData.coordinates}>
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