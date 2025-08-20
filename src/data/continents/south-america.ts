export interface CountryWeather {
  country: string;
  capital: string;
  lat: number;
  lon: number;
}

const southAmerica: CountryWeather[] = [
  { country: 'Argentina', capital: 'Buenos Aires', lat: -34.6037, lon: -58.3816 },
  { country: 'Bolivia', capital: 'La Paz', lat: -16.5000, lon: -68.1500 },
  { country: 'Brazil', capital: 'Brasília', lat: -15.8267, lon: -47.9218 },
  { country: 'Chile', capital: 'Santiago', lat: -33.4489, lon: -70.6693 },
  { country: 'Colombia', capital: 'Bogotá', lat: 4.7110, lon: -74.0721 },
  { country: 'Ecuador', capital: 'Quito', lat: -0.1807, lon: -78.4678 },
  { country: 'Guyana', capital: 'Georgetown', lat: 6.8013, lon: -58.1551 },
  { country: 'Paraguay', capital: 'Asunción', lat: -25.2637, lon: -57.5759 },
  { country: 'Peru', capital: 'Lima', lat: -12.0464, lon: -77.0428 },
  { country: 'Suriname', capital: 'Paramaribo', lat: 5.8520, lon: -55.2038 },
  { country: 'Uruguay', capital: 'Montevideo', lat: -34.9011, lon: -56.1645 },
  { country: 'Venezuela', capital: 'Caracas', lat: 10.4806, lon: -66.9036 },
];

export default southAmerica;
