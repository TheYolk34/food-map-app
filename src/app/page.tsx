"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Filters from './components/Filters';
import { fetchCateringData } from '@/lib/api';
import { CateringPoint, FilterParams } from '@/lib/types';

const Map = dynamic(() => import('./components/Map'), {
  ssr: false,
});

export default function Home() {
  const [points, setPoints] = useState<CateringPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async (filters: FilterParams = {}) => {
    setLoading(true);
    try {
      const data = await fetchCateringData(filters);
      setPoints(data || []);
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
      ) : points.length > 0 ? (
        <Map points={points} />
      ) : (
        <p>Нет данных для отображения</p>
      )}
    </div>
  );
}