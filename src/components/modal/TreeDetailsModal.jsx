import PropTypes from 'prop-types';
import { CheckCircle, XCircle } from 'lucide-react';
import Badge from '../common/Badge';
import { statusColors } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatters';

const TreeDetailsModal = ({ tree, onClose, onUpdateStatus }) => {
  if (!tree) return null;
  const statusStyle = statusColors[tree.status] || statusColors.pending;
  const blockchainRef = tree.blockchainHash || tree.blockchainTxId || tree.tx_id || 'N/A';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Tree Details - ID #{tree.treeId}</h3>
          <button type="button" className="text-2xl text-gray-500 hover:text-gray-700" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Species</p>
            <p className="font-semibold text-gray-900">{tree.species || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Planter</p>
            <p className="font-semibold text-gray-900">{tree.planter || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Height</p>
            <p className="font-semibold text-gray-900">{tree.height || 'N/A'} meters</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Age</p>
            <p className="font-semibold text-gray-900">{tree.age || 0} months</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-semibold text-gray-900">
              {tree.lat}, {tree.lng}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <Badge className={statusStyle.badge}>{statusStyle.label}</Badge>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-500">Blockchain Reference</p>
          <p className="mt-2 break-all rounded-lg bg-gray-50 p-3 text-xs font-mono text-gray-700">
            {blockchainRef}
          </p>
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-500">Timestamp</p>
          <p className="font-semibold text-gray-900">{formatDateTime(tree.timestamp)}</p>
        </div>

        {tree.status === 'pending' ? (
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
              onClick={() => onUpdateStatus(tree.treeId, 'verified')}
            >
              <CheckCircle size={18} />
              Verify
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              onClick={() => onUpdateStatus(tree.treeId, 'rejected')}
            >
              <XCircle size={18} />
              Reject
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

TreeDetailsModal.propTypes = {
  tree: PropTypes.shape({
    treeId: PropTypes.string.isRequired,
    species: PropTypes.string,
    planter: PropTypes.string,
    height: PropTypes.string,
    age: PropTypes.number,
    lat: PropTypes.string,
    lng: PropTypes.string,
    status: PropTypes.string,
    blockchainHash: PropTypes.string,
    timestamp: PropTypes.string
  }),
  onClose: PropTypes.func.isRequired,
  onUpdateStatus: PropTypes.func.isRequired
};

TreeDetailsModal.defaultProps = {
  tree: null
};

export default TreeDetailsModal;
