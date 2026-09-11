export interface CinemaLocation {
  id: string;
  cityId: string;
  nombre: string;
  direccion: string;
}

export interface CityLocation {
  id: string;
  countryId: string;
  nombre: string;
  departamento: string;
  cines: CinemaLocation[];
}

export interface DepartmentLocation {
  id: string;
  nombre: string;
  ciudades: CityLocation[];
}

export interface CountryLocation {
  id: string;
  nombre: string;
  departamentos: DepartmentLocation[];
}

export interface CountryRecord {
  id: string;
  nombre: string;
}

export interface CityRecord {
  id: string;
  countryId: string;
  nombre: string;
  departamento: string;
}

export type CinemaRecord = CinemaLocation;

export interface SelectedLocation {
  country: string;
  department: string;
  city: string;
}
