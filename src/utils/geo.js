const ranges = [
  { name: 'Kenya', lat: [-5.0, 5.5], lng: [33.0, 42.5] },
  { name: 'Uganda', lat: [-1.5, 4.5], lng: [29.0, 35.0] },
  { name: 'Tanzania', lat: [-11.8, -1.0], lng: [29.0, 40.5] },
  { name: 'Ethiopia', lat: [3.0, 15.5], lng: [33.0, 48.0] },
  { name: 'Ghana', lat: [4.5, 11.5], lng: [-3.5, 1.5] },
  { name: 'Nigeria', lat: [4.0, 14.5], lng: [2.0, 15.0] },
  { name: 'India', lat: [6.0, 35.0], lng: [68.0, 97.0] },
  { name: 'Brazil', lat: [-34.0, 5.0], lng: [-74.0, -34.0] },
  { name: 'United States', lat: [24.0, 49.5], lng: [-125.0, -66.0] }
];

export const deriveCountryFromLatLng = (latValue, lngValue) => {
  const lat = parseFloat(latValue);
  const lng = parseFloat(lngValue);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return 'Unknown';

  const match = ranges.find(
    (range) => lat >= range.lat[0] && lat <= range.lat[1] && lng >= range.lng[0] && lng <= range.lng[1]
  );

  return match ? match.name : 'Unknown';
};
