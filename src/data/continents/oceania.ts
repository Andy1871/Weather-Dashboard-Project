export interface CountryWeather {
  country: string;
  capital: string;
  lat: number;
  lon: number;
}

const oceania: CountryWeather[] = [
  { country: 'Australia', capital: 'Canberra', lat: -35.2809, lon: 149.1300 },
  { country: 'Federated States of Micronesia', capital: 'Palikir', lat: 6.9178, lon: 158.1850 },
  { country: 'Fiji', capital: 'Suva', lat: -18.1248, lon: 178.4501 },
  { country: 'Kiribati', capital: 'South Tarawa', lat: 1.3290, lon: 172.9790 },
  { country: 'Marshall Islands', capital: 'Majuro', lat: 7.0897, lon: 171.3803 },
  { country: 'Nauru', capital: 'Yaren (de facto)', lat: -0.5477, lon: 166.9209 },
  { country: 'New Zealand', capital: 'Wellington', lat: -41.2865, lon: 174.7762 },
  { country: 'Palau', capital: 'Ngerulmud', lat: 7.5004, lon: 134.6235 },
  { country: 'Papua New Guinea', capital: 'Port Moresby', lat: -9.4438, lon: 147.1803 },
  { country: 'Samoa', capital: 'Apia', lat: -13.8333, lon: -171.7500 },
  { country: 'Solomon Islands', capital: 'Honiara', lat: -9.4456, lon: 159.9729 },
  { country: 'Tonga', capital: "Nuku'alofa", lat: -21.1394, lon: -175.2018 },
  { country: 'Tuvalu', capital: 'Funafuti', lat: -8.5201, lon: 179.1983 },
  { country: 'Vanuatu', capital: 'Port Vila', lat: -17.7333, lon: 168.3167 },
];

export default oceania;
