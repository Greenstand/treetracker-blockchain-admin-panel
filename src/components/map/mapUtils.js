export const convertToMapPosition = (lat, lng) => {
  const x = ((parseFloat(lng) + 180) / 360) * 100;
  const y = ((90 - parseFloat(lat)) / 180) * 100;
  return { x, y };
};
