export interface CountryWeather {
  country: string;
  capital: string;
  lat: number;
  lon: number;
}

export interface LiveWeather {
  temp: number;
  high: number;
  low: number;
  description?: string | null;
  pop?: number | null;
  summary?: string | null;
  tz?: string | null;
  tzOffset?: number | null;

}

export type LiveWeatherByCapital = Record<string, LiveWeather>;
