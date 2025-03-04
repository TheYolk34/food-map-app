import { CateringPoint, FilterParams } from './types';

const API_KEY = '372d3ea4-fc72-40a7-b6e1-9cc9c78ad1f7';
const BASE_URL = 'https://apidata.mos.ru/v1/datasets/1903/rows';

export async function fetchCateringData(filters: FilterParams = {}): Promise<CateringPoint[]> {
  const params = new URLSearchParams({
    $top: '1000',
    api_key: API_KEY,
  });

  const filterConditions: string[] = [];

  if (filters.operatingCompany) {
    // Избегаем двойной кодировки, передаём значение напрямую
    params.append('q', filters.operatingCompany); // Не используем encodeURIComponent здесь
  }
  if (filters.typeObject) {
    filterConditions.push(`Cells/TypeObject eq '${filters.typeObject}'`);
  }
  if (filters.isNetObject === true) { // Добавляем только если true
    filterConditions.push(`Cells/IsNetObject eq true`);
  }

  if (filterConditions.length > 0) {
    params.append('$filter', filterConditions.join(' and '));
  }

  const requestUrl = `${BASE_URL}?${params.toString()}`;
  console.log('Request URL:', requestUrl); // Логируем URL для диагностики

  try {
    const response = await fetch(requestUrl);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API Response Raw:', data);

    const items = Array.isArray(data) ? data : Array.isArray(data.Items) ? data.Items : [];
    console.log('Processed OperatingCompany:', items.map((item: any) => item.Cells.OperatingCompany));

    if (Array.isArray(items)) {
      return items.map((item: { Cells: { ID: number; Name: string; OperatingCompany: string; TypeObject: string; Address: string; SeatsCount: number; IsNetObject: boolean; geoData: { coordinates: number[] } } }) => ({
        id: item.Cells.ID,
        Name: item.Cells.Name,
        OperatingCompany: item.Cells.OperatingCompany,
        TypeObject: item.Cells.TypeObject,
        Address: item.Cells.Address,
        SeatsCount: item.Cells.SeatsCount,
        IsNetObject: item.Cells.IsNetObject,
        geoData: {
          coordinates: [item.Cells.geoData.coordinates[1], item.Cells.geoData.coordinates[0]],
        },
      }));
    } else {
      console.error('API returned non-array data or no Items:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}