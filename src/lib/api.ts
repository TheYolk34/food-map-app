import { CateringPoint, FilterParams } from './types';

const API_KEY = '372d3ea4-fc72-40a7-b6e1-9cc9c78ad1f7';
const BASE_URL = 'https://apidata.mos.ru/v1/datasets/1903/rows';

export async function fetchCateringData(filters: FilterParams = {}): Promise<CateringPoint[]> {
  const params = new URLSearchParams({
    $top: '1000',
    api_key: API_KEY,
  });

  if (filters.operatingCompany) {
    params.append('$filter', `substringof('${filters.operatingCompany}',Cells/OperatingCompany)`);
  }
  if (filters.typeObject) {
    params.append('$filter', `substringof('${filters.typeObject}',Cells/TypeObject)`);
  }
  if (filters.isNetObject !== undefined) {
    params.append('$filter', `Cells/IsNetObject eq '${filters.isNetObject ? 'да' : 'нет'}'`);
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  const data = await response.json();
  return data.map((item: any) => ({
    id: item.Cells.ID,
    Name: item.Cells.Name,
    OperatingCompany: item.Cells.OperatingCompany,
    TypeObject: item.Cells.TypeObject,
    Address: item.Cells.Address,
    SeatsCount: item.Cells.SeatsCount,
    IsNetObject: item.Cells.IsNetObject,
    geoData: {
      coordinates: [
        item.Cells.geoData.coordinates[1], // lat
        item.Cells.geoData.coordinates[0]  // lng
      ]
    }
  }));
}