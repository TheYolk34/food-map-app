export interface CateringPoint {
    id: number;
    Name: string;
    OperatingCompany: string;
    TypeObject: string;
    Address: string;
    SeatsCount: number;
    IsNetObject: string; // "да" или "нет"
    geoData: {
      coordinates: [number, number];
    };
  }
  
  export interface FilterParams {
    operatingCompany?: string;
    typeObject?: string;
    isNetObject?: boolean;
  }