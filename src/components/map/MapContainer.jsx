import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { MapContainer as LeafletMap, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapLegend from './MapLegend';
import { statusColors } from '../../utils/constants';

const DEFAULT_CENTER = [0, 0];
const DEFAULT_ZOOM = 2;

const FitBounds = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!points.length) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      return;
    }
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
  }, [map, points]);

  return null;
};

const MapContainer = ({ trees, onSelectTree }) => {
  const limitedTrees = trees.slice(0, 200);
  const counts = trees.reduce(
    (acc, tree) => {
      const status = statusColors[tree.status] ? tree.status : 'pending';
      acc[status] += 1;
      return acc;
    },
    { verified: 0, pending: 0, rejected: 0 }
  );

  const points = useMemo(
    () =>
      limitedTrees
        .map((tree) => [parseFloat(tree.lat), parseFloat(tree.lng)])
        .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng)),
    [limitedTrees]
  );

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
      <LeafletMap
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        {limitedTrees.map((tree) => {
          const lat = parseFloat(tree.lat);
          const lng = parseFloat(tree.lng);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
          const status = statusColors[tree.status] ? tree.status : 'pending';
          const color = statusColors[status]?.color || '#16a34a';
          return (
            <CircleMarker
              key={tree.treeId}
              center={[lat, lng]}
              radius={7}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.9 }}
              eventHandlers={{ click: () => onSelectTree(tree) }}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">{tree.species}</div>
                  <div className="text-xs text-gray-500">{statusColors[status].label}</div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </LeafletMap>
      <div className="pointer-events-none absolute right-4 top-4 rounded-lg bg-white/95 px-3 py-2 text-xs text-gray-500 shadow-lg">
        Click markers for details
      </div>
      <MapLegend counts={counts} />
    </div>
  );
};

MapContainer.propTypes = {
  trees: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectTree: PropTypes.func.isRequired
};

FitBounds.propTypes = {
  points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired
};

export default MapContainer;
