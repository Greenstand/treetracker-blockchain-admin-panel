import PropTypes from 'prop-types';
import { ArrowLeft, Globe, Leaf } from 'lucide-react';
import Badge from '../common/Badge';
import { statusColors } from '../../utils/constants';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { deriveCountryFromLatLng } from '../../utils/geo';
import MapContainer from '../map/MapContainer';

const PlanterProfilePage = ({ planterName, profile, onBack, onOpenTreeProfile }) => {
  if (!profile) return null;

  const countryCounts = profile.trees.reduce((acc, tree) => {
    const country = deriveCountryFromLatLng(tree.lat, tree.lng);
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  const topCountry = Object.keys(countryCounts).sort((a, b) => countryCounts[b] - countryCounts[a])[0] || 'Unknown';
  const tokenCounts = profile.trees.reduce(
    (acc, tree) => {
      if (tree.mintedToken) {
        acc.minted += 1;
      } else {
        acc.unminted += 1;
      }
      return acc;
    },
    { minted: 0, unminted: 0 }
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
      </div>

      <div className="mb-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-white/20 p-3">
            <Leaf size={26} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{planterName}</h2>
            <p className="text-sm text-green-100">Planter profile & activity overview</p>
            {planterName?.toLowerCase() === 'jim carter' && (
              <p className="mt-1 text-xs text-green-100">
                Ledger ID: 07d66899-278b-45ef-86cc-5dd4dc0fe74e
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Total Trees</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{profile.total}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Verified</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{profile.verified}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Pending</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{profile.pending}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Rejected</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{profile.rejected}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Token Minted</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{tokenCounts.minted}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Token Pending</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{tokenCounts.unminted}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm md:col-span-2">
          <div className="flex items-center gap-2 text-gray-500">
            <Globe size={18} />
            <p className="text-xs font-semibold">Planter Country (estimated)</p>
          </div>
          <p className="mt-2 text-lg font-semibold text-gray-900">{topCountry}</p>
          <p className="text-xs text-gray-400">
            Based on the most frequent coordinates from planter activity.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Planter Map View</h3>
            <p className="text-sm text-gray-500">Locations of trees registered by this planter.</p>
          </div>
        </div>
        <div className="mt-4">
          <MapContainer trees={profile.trees} onSelectTree={() => {}} />
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-sm text-gray-500">
              Latest recorded activity: {profile.latestActivity ? formatDateTime(profile.latestActivity) : 'N/A'}
            </p>
          </div>
          <span className="text-xs font-semibold text-gray-400">{profile.trees.length} records</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Tree ID</th>
                <th className="px-4 py-3">Species</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Token</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {profile.trees.map((tree) => (
                <tr key={tree.treeId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">#{tree.treeId}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <button
                      type="button"
                      className="font-medium text-emerald-700 hover:text-emerald-900"
                      onClick={() => onOpenTreeProfile(tree)}
                    >
                      {tree.species}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge className={(statusColors[tree.status] || statusColors.pending).badge}>
                      {(statusColors[tree.status] || statusColors.pending).label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge className={tree.mintedToken ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}>
                      {tree.mintedToken ? 'Minted' : 'Pending'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {tree.lat.slice(0, 6)}, {tree.lng.slice(0, 6)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(tree.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

PlanterProfilePage.propTypes = {
  planterName: PropTypes.string.isRequired,
  profile: PropTypes.shape({
    total: PropTypes.number.isRequired,
    verified: PropTypes.number.isRequired,
    pending: PropTypes.number.isRequired,
    rejected: PropTypes.number.isRequired,
    latestActivity: PropTypes.string,
    trees: PropTypes.arrayOf(
      PropTypes.shape({
        treeId: PropTypes.string.isRequired,
        species: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        lat: PropTypes.string.isRequired,
        lng: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired
      })
    ).isRequired
  }),
  onBack: PropTypes.func.isRequired,
  onOpenTreeProfile: PropTypes.func.isRequired
};

PlanterProfilePage.defaultProps = {
  profile: null
};

export default PlanterProfilePage;
