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
      setPoints(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container mx-auto px-6">
      <h1 className="text-2xl font-bold mb-4">Food Map Москвы</h1>
      <Filters onFilterChange={loadData} />
      {loading ? <p>Загрузка...</p> : <Map points={points} />}
    </div>
  );
}