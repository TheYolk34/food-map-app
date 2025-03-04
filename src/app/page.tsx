"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Filters from './components/Filters';
import { fetchCateringData } from '@/lib/api';
import { CateringPoint, FilterParams } from '@/lib/types';

// Динамический импорт всех компонентов Leaflet с отключением SSR
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), {
  ssr: false,
  loading: () => <p>Загрузка карты...</p>,
});
const Map = dynamic(() => import('./components/Map'), {
  ssr: false,
  loading: () => <p>Загрузка карты...</p>,
});
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), {
  ssr: false,
});
const MarkerClusterGroup = dynamic(() => import('react-leaflet-markercluster'), {
  ssr: false,
});

export default function Home() {
  const [points, setPoints] = useState<CateringPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async (filters: FilterParams = {}) => {
    setLoading(true);
    try {
      const data = await fetchCateringData(filters);
      setPoints(data);
      console.log('Points set to:', data); // Логируем данные, переданные в Map
    } catch (error) {
      console.error('Error fetching data:', error);
      setPoints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Filters onFilterChange={loadData} />
      {loading ? (
        <p>Загрузка данных...</p>
      ) : (
        <MapContainer
          center={[55.751244, 37.618423]}
          zoom={10}
          style={{ height: '600px', width: '100%' }}
        >
          <Map points={points} />
        </MapContainer>
      )}
    </div>
  );
}