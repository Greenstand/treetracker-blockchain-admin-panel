import PropTypes from 'prop-types';
import { MapPin } from 'lucide-react';
import Badge from '../common/Badge';
import { statusColors } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

const TreeRow = ({ tree, onSelect, onOpenTreeProfile, onSelectPlanter }) => {
  const statusStyle = statusColors[tree.status] || statusColors.pending;

  return (
    <tr className="hover:bg-gray-50 transition">
      <td className="px-4 py-3 text-sm text-gray-500">
        <button
          type="button"
          className="font-medium text-emerald-700 hover:text-emerald-900"
          onClick={() => onSelectPlanter(tree.planterKey || tree.planter)}
        >
          {tree.planter}
        </button>
      </td>
      <td className="px-4 py-3 text-sm text-gray-900">
        <button
          type="button"
          className="font-medium text-emerald-700 hover:text-emerald-900"
          onClick={() => onOpenTreeProfile(tree)}
        >
          {tree.species}
        </button>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          {tree.lat.slice(0, 6)}, {tree.lng.slice(0, 6)}
        </div>
      </td>
      <td className="px-4 py-3 text-sm">
        <Badge className={statusStyle.badge}>{statusStyle.label}</Badge>
      </td>
      <td className="px-4 py-3 text-sm">
        <Badge className={tree.mintedToken ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}>
          {tree.mintedToken ? 'Minted' : 'Pending'}
        </Badge>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(tree.timestamp)}</td>
      <td className="px-4 py-3 text-sm">
        <button
          type="button"
          className="text-emerald-600 hover:text-emerald-900 font-medium"
          onClick={() => onSelect(tree)}
        >
          View Details
        </button>
      </td>
    </tr>
  );
};

TreeRow.propTypes = {
  tree: PropTypes.shape({
    treeId: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired,
    planter: PropTypes.string.isRequired,
    planterKey: PropTypes.string,
    lat: PropTypes.string.isRequired,
    lng: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    mintedToken: PropTypes.bool
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  onOpenTreeProfile: PropTypes.func.isRequired,
  onSelectPlanter: PropTypes.func.isRequired
};

export default TreeRow;
