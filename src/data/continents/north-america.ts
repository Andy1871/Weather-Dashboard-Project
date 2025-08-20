export interface CountryWeather {
  country: string;
  capital: string;
  lat: number;
  lon: number;
}

const northAmerica: CountryWeather[] = [
  { country: 'Antigua and Barbuda', capital: "St. John's", lat: 17.1274, lon: -61.8468 },
  { country: 'Bahamas', capital: 'Nassau', lat: 25.0443, lon: -77.3504 },
  { country: 'Barbados', capital: 'Bridgetown', lat: 13.0975, lon: -59.6167 },
  { country: 'Belize', capital: 'Belmopan', lat: 17.2510, lon: -88.7590 },
  { country: 'Canada', capital: 'Ottawa', lat: 45.4215, lon: -75.6972 },
  { country: 'Costa Rica', capital: 'San José', lat: 9.9281, lon: -84.0907 },
  { country: 'Cuba', capital: 'Havana', lat: 23.1136, lon: -82.3666 },
  { country: 'Dominica', capital: 'Roseau', lat: 15.3092, lon: -61.3790 },
  { country: 'Dominican Republic', capital: 'Santo Domingo', lat: 18.4861, lon: -69.9312 },
  { country: 'El Salvador', capital: 'San Salvador', lat: 13.6929, lon: -89.2182 },
  { country: 'Grenada', capital: "St. George's", lat: 12.0561, lon: -61.7488 },
  { country: 'Guatemala', capital: 'Guatemala City', lat: 14.6349, lon: -90.5069 },
  { country: 'Haiti', capital: 'Port-au-Prince', lat: 18.5944, lon: -72.3074 },
  { country: 'Honduras', capital: 'Tegucigalpa', lat: 14.0723, lon: -87.1921 },
  { country: 'Jamaica', capital: 'Kingston', lat: 17.9712, lon: -76.7936 },
  { country: 'Mexico', capital: 'Mexico City', lat: 19.4326, lon: -99.1332 },
  { country: 'Nicaragua', capital: 'Managua', lat: 12.1150, lon: -86.2362 },
  { country: 'Panama', capital: 'Panama City', lat: 8.9824, lon: -79.5199 },
  { country: 'Saint Kitts and Nevis', capital: 'Basseterre', lat: 17.3026, lon: -62.7177 },
  { country: 'Saint Lucia', capital: 'Castries', lat: 13.9094, lon: -60.9789 },
  { country: 'Saint Vincent and the Grenadines', capital: 'Kingstown', lat: 13.1600, lon: -61.2248 },
  { country: 'Trinidad and Tobago', capital: 'Port of Spain', lat: 10.6549, lon: -61.5019 },
  { country: 'United States', capital: 'Washington, D.C.', lat: 38.9072, lon: -77.0369 },
];

export default northAmerica;
