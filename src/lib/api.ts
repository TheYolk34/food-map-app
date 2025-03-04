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
    filterConditions.push(`substringof('${filters.operatingCompany}',Cells/OperatingCompany)`);
  }
  if (filters.typeObject) {
    // Используем точное совпадение вместо substringof
    filterConditions.push(`Cells/TypeObject eq '${filters.typeObject}'`);
  }
  if (filters.isNetObject !== undefined) {
    filterConditions.push(`Cells/IsNetObject eq ${filters.isNetObject}`);
  }

  if (filterConditions.length > 0) {
    params.append('$filter', filterConditions.join(' and '));
  }

  try {
    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText); // Логируем текст ошибки
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API Response:', data);

    if (Array.isArray(data)) {
      return data.map((item: any) => ({
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
      console.error('API returned non-array data:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}