import PropTypes from 'prop-types';
import { useState } from 'react';
import { Database, Search } from 'lucide-react';
import api from '../../services/api';

const deriveStatus = (capture) => {
  if (capture.status) return capture.status;
  if (capture.approved === true) return 'verified';
  if (capture.verificationDate) return 'rejected';
  return 'pending';
};

const mapCaptureToTree = (capture) => {
  const lat = typeof capture.latitude === 'number' ? capture.latitude : parseFloat(capture.latitude || '0');
  const lng = typeof capture.longitude === 'number' ? capture.longitude : parseFloat(capture.longitude || '0');

  return {
    treeId: String(capture.id),
    blockchainHash: capture.blockchainTxId || capture.tx_id || '',
    timestamp: capture.timestamp ? new Date(capture.timestamp).toISOString() : new Date().toISOString(),
    lastModified: capture.verificationDate ? new Date(capture.verificationDate).toISOString() : new Date().toISOString(),
    lat: Number.isFinite(lat) ? lat.toFixed(6) : '0.000000',
    lng: Number.isFinite(lng) ? lng.toFixed(6) : '0.000000',
    species: capture.species || capture.commonName || 'Unknown',
    planter: capture.plantedBy || capture.userId || 'Unknown',
    status: deriveStatus(capture),
    height: capture.height ? String(capture.height) : 'N/A',
    age: capture.treeAge ? capture.treeAge * 12 : 0,
    verifiedBy: capture.verifiedBy || null,
    verificationDate: capture.verificationDate ? new Date(capture.verificationDate).toISOString() : null,
    mintedToken: Boolean(capture.tokenId),
    raw: capture
  };
};

const BlockchainQuery = ({ trees, onSelectTree }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const findLocal = (value) => {
    const normalized = value.trim();
    if (!normalized) return null;

    return (
      trees.find((item) => item.treeId === normalized) ||
      trees.find((item) => item.blockchainHash === normalized)
    );
  };

  const handleQuery = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setResult(null);

    try {
      const local = findLocal(trimmed);
      if (local) {
        setResult(local);
      } else {
        const response = await api.captures.getById(trimmed);
        if (response.success && response.data) {
          setResult(mapCaptureToTree(response.data));
        } else {
          setResult({ error: response.error || 'Tree not found' });
        }
      }
    } catch (error) {
      setResult({ error: error.message || 'Query failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-8 rounded-xl bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center gap-2 text-emerald-600">
        <Database size={22} />
        <h3 className="text-lg font-semibold text-gray-900">Blockchain Query</h3>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Enter Tree ID or Blockchain Tx..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button
          type="button"
          onClick={handleQuery}
          className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Search size={18} />
          Query
        </button>
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-gray-500">Querying blockchain...</p>
      ) : null}

      {result ? (
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : (
            <div className="space-y-2">
              <p className="font-semibold text-gray-900">Tree #{result.treeId}</p>
              <p className="text-gray-600">Species: {result.species}</p>
              <p className="text-gray-600">Status: {result.status}</p>
              <button
                type="button"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
                onClick={() => onSelectTree(result)}
              >
                View Details
              </button>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
};

BlockchainQuery.propTypes = {
  trees: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectTree: PropTypes.func.isRequired
};

export default BlockchainQuery;
