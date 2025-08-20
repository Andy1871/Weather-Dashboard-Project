export interface CountryWeather {
    country: string;
    capital: string;
    lat: number;
    lon: number;
  }
  
  export interface LiveWeather {
    temp: number; // current temperature (°C)
    high: number; // today's high (°C)
    low: number;  // today's low (°C)
  }
  
  export type LiveWeatherByCapital = Record<string, LiveWeather>;
  