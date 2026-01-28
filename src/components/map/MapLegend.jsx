import PropTypes from 'prop-types';
import { statusColors } from '../../utils/constants';

const MapLegend = ({ counts }) => {
  return (
    <div className="absolute bottom-4 left-4 rounded-lg bg-white/95 p-3 text-xs shadow-lg">
      <p className="font-semibold text-gray-700">Status Legend</p>
      <div className="mt-2 space-y-2">
        {Object.keys(statusColors).map((status) => (
          <div key={status} className="flex items-center gap-2 text-gray-600">
            <span className={`h-3 w-3 rounded-full ${statusColors[status].dot}`} />
            <span>
              {statusColors[status].label} ({counts[status] || 0})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

MapLegend.propTypes = {
  counts: PropTypes.shape({
    verified: PropTypes.number,
    pending: PropTypes.number,
    rejected: PropTypes.number
  }).isRequired
};

export default MapLegend;
