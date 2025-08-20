export interface CountryWeather {
  country: string;
  capital: string;
  lat: number;
  lon: number;
}

const europe: CountryWeather[] = [
  { country: 'Albania', capital: 'Tirana', lat: 41.3275, lon: 19.8189 },
  { country: 'Andorra', capital: 'Andorra la Vella', lat: 42.5078, lon: 1.5211 },
  { country: 'Austria', capital: 'Vienna', lat: 48.2100, lon: 16.3738 },
  { country: 'Belarus', capital: 'Minsk', lat: 53.9006, lon: 27.5590 },
  { country: 'Belgium', capital: 'Brussels', lat: 50.8503, lon: 4.3517 },
  { country: 'Bosnia and Herzegovina', capital: 'Sarajevo', lat: 43.8563, lon: 18.4131 },
  { country: 'Bulgaria', capital: 'Sofia', lat: 42.6977, lon: 23.3219 },
  { country: 'Croatia', capital: 'Zagreb', lat: 45.8150, lon: 15.9785 },
  { country: 'Czechia', capital: 'Prague', lat: 50.0755, lon: 14.4378 },
  { country: 'Denmark', capital: 'Copenhagen', lat: 55.6761, lon: 12.5683 },
  { country: 'Estonia', capital: 'Tallinn', lat: 59.4370, lon: 24.7536 },
  { country: 'Finland', capital: 'Helsinki', lat: 60.1699, lon: 24.9384 },
  { country: 'France', capital: 'Paris', lat: 48.8566, lon: 2.3522 },
  { country: 'Germany', capital: 'Berlin', lat: 52.5200, lon: 13.4050 },
  { country: 'Greece', capital: 'Athens', lat: 37.9838, lon: 23.7275 },
  { country: 'Hungary', capital: 'Budapest', lat: 47.4979, lon: 19.0402 },
  { country: 'Iceland', capital: 'Reykjavik', lat: 64.1355, lon: -21.8954 },
  { country: 'Ireland', capital: 'Dublin', lat: 53.3331, lon: -6.2489 },
  { country: 'Italy', capital: 'Rome', lat: 41.9028, lon: 12.4964 },
  { country: 'Kazakhstan* (part in Europe)', capital: 'Astana', lat: 51.1605, lon: 71.4704 },
  { country: 'Kosovo', capital: 'Pristina', lat: 42.6629, lon: 21.1655 },
  { country: 'Latvia', capital: 'Riga', lat: 56.9496, lon: 24.1052 },
  { country: 'Liechtenstein', capital: 'Vaduz', lat: 47.1416, lon: 9.5215 },
  { country: 'Lithuania', capital: 'Vilnius', lat: 54.6872, lon: 25.2797 },
  { country: 'Luxembourg', capital: 'Luxembourg', lat: 49.6117, lon: 6.1319 },
  { country: 'Malta', capital: 'Valletta', lat: 35.8997, lon: 14.5146 },
  { country: 'Moldova', capital: 'Chișinău', lat: 47.0105, lon: 28.8638 },
  { country: 'Monaco', capital: 'Monaco', lat: 43.7384, lon: 7.4246 },
  { country: 'Montenegro', capital: 'Podgorica', lat: 42.4410, lon: 19.2627 },
  { country: 'Netherlands', capital: 'Amsterdam', lat: 52.3676, lon: 4.9041 },
  { country: 'North Macedonia', capital: 'Skopje', lat: 41.9981, lon: 21.4254 },
  { country: 'Norway', capital: 'Oslo', lat: 59.9139, lon: 10.7522 },
  { country: 'Poland', capital: 'Warsaw', lat: 52.2297, lon: 21.0122 },
  { country: 'Portugal', capital: 'Lisbon', lat: 38.7169, lon: -9.1390 },
  { country: 'Romania', capital: 'Bucharest', lat: 44.4268, lon: 26.1025 },
  { country: 'Russia* (part in Europe)', capital: 'Moscow', lat: 55.7558, lon: 37.6173 },
  { country: 'San Marino', capital: 'San Marino', lat: 43.9336, lon: 12.4508 },
  { country: 'Serbia', capital: 'Belgrade', lat: 44.8176, lon: 20.4569 },
  { country: 'Slovakia', capital: 'Bratislava', lat: 48.1486, lon: 17.1077 },
  { country: 'Slovenia', capital: 'Ljubljana', lat: 46.0569, lon: 14.5058 },
  { country: 'Spain', capital: 'Madrid', lat: 40.4168, lon: -3.7038 },
  { country: 'Sweden', capital: 'Stockholm', lat: 59.3293, lon: 18.0686 },
  { country: 'Switzerland', capital: 'Bern', lat: 46.9481, lon: 7.4474 },
  { country: 'Turkey* (part in Europe)', capital: 'Ankara', lat: 39.9334, lon: 32.8597 },
  { country: 'Ukraine', capital: 'Kyiv', lat: 50.4501, lon: 30.5234 },
  { country: 'United Kingdom', capital: 'London', lat: 51.5074, lon: -0.1278 },
  { country: 'Vatican City', capital: 'Vatican City', lat: 41.9029, lon: 12.4534 },
];

export default europe;
