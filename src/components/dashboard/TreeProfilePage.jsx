import PropTypes from 'prop-types';
import { ArrowLeft, ClipboardList, Leaf } from 'lucide-react';
import Badge from '../common/Badge';
import { statusColors } from '../../utils/constants';
import { formatDate, formatDateTime } from '../../utils/formatters';
import MapContainer from '../map/MapContainer';
import { deriveCountryFromLatLng } from '../../utils/geo';

const Field = ({ label, value, valueClassName, valueStyle }) => {
  const displayValue = value !== undefined && value !== null && String(value).trim() !== ''
    ? String(value)
    : '_______________________';

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p
        className={`mt-1 text-sm font-medium text-gray-900 ${valueClassName}`.trim()}
        style={valueStyle}
      >
        {displayValue}
      </p>
    </div>
  );
};

Field.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueClassName: PropTypes.string,
  valueStyle: PropTypes.object
};

Field.defaultProps = {
  value: '',
  valueClassName: '',
  valueStyle: undefined
};

const TreeProfilePage = ({ tree, onBack, onMintToken, onOpenPlanterProfile }) => {
  if (!tree) return null;
  const country = deriveCountryFromLatLng(tree.lat, tree.lng);
  const statusStyle = statusColors[tree.status] || statusColors.pending;

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
            <h2 className="text-2xl font-bold">{tree.species}</h2>
            <button
              type="button"
              className="text-xs text-green-100 underline-offset-4 hover:underline"
              onClick={() => onOpenPlanterProfile(tree.planter)}
            >
              {tree.planter}
            </button>
            {tree.ledgerId && (
              <p className="mt-1 text-xs text-green-100">Ledger ID: {tree.ledgerId}</p>
            )}
          </div>
        </div>
      </div>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-emerald-600">
          <ClipboardList size={18} />
          <h3 className="text-lg font-semibold text-gray-900">Tree Identification</h3>
        </div>
        <h4 className="text-sm font-semibold text-gray-700">Unique Identifiers</h4>
        <div className="mt-3 grid gap-4 md:grid-cols-4">
          <Field
            label="Tree ID"
            value={`TREE-${tree.treeId}`}
            valueStyle={{ fontSize: '11px' }}
          />
          <Field label="Tag Number" value="" />
          <Field label="QR Code/Barcode" value="" />
          <Field label="Alternative ID" value="" />
        </div>

        <h4 className="mt-6 text-sm font-semibold text-gray-700">Location Information</h4>
        <div className="mt-3 grid gap-4 md:grid-cols-4">
          <Field label="Project Name" value="" />
          <Field label="Site Name" value="" />
          <Field label="Plot Number" value="" />
          <Field label="GPS Latitude" value={tree.lat} />
          <Field label="GPS Longitude" value={tree.lng} />
          <Field label="Elevation" value={tree.raw?.altitude ? `${tree.raw.altitude} m` : ''} />
          <Field label="GPS Accuracy" value={tree.raw?.gpsAccuracy ? `${tree.raw.gpsAccuracy} m` : ''} />
          <Field label="Datum" value="WGS84" />
          <Field label="Grid Reference" value="" />
          <Field label="Position in Plot" value="" />
          <Field label="Country" value={country} />
        </div>

        <h4 className="mt-6 text-sm font-semibold text-gray-700">Species Information</h4>
        <div className="mt-3 grid gap-4 md:grid-cols-4">
          <Field label="Common Name" value={tree.species} />
          <Field label="Scientific Name" value={tree.raw?.scientificName || ''} />
          <Field label="Variety/Cultivar" value="" />
          <Field label="Provenance/Seed Source" value="" />
          <Field label="Native/Introduced" value="" />
        </div>
      </section>

      <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Planting Information</h3>
        <h4 className="mt-4 text-sm font-semibold text-gray-700">Planting Details</h4>
        <div className="mt-3 grid gap-4 md:grid-cols-4">
          <Field label="Planting Date" value={formatDate(tree.timestamp)} />
          <Field label="Planting Season" value="" />
          <Field label="Planting Method" value={tree.raw?.captureMethod || ''} />
        </div>

        <h4 className="mt-6 text-sm font-semibold text-gray-700">Initial Seedling Characteristics</h4>
        <div className="mt-3 grid gap-4 md:grid-cols-4">
          <Field label="Source" value="" />
          <Field label="Nursery Name" value="" />
          <Field label="Container Type" value="" />
          <Field label="Age at Planting" value={tree.age ? `${tree.age} months` : ''} />
          <Field label="Initial Height" value={tree.height ? `${tree.height} m` : ''} />
          <Field label="Initial Root Collar Diameter" value={tree.raw?.dbh ? `${tree.raw.dbh} cm` : ''} />
          <Field label="Initial Condition" value="" />
          <Field label="Initial Health Score" value={tree.raw?.healthStatus || ''} />
        </div>

        <h4 className="mt-6 text-sm font-semibold text-gray-700">Planting Conditions</h4>
        <div className="mt-3 grid gap-4 md:grid-cols-4">
          <Field label="Weather at Planting" value={tree.raw?.weather?.precipitation || ''} />
          <Field label="Soil Moisture" value={tree.raw?.soilType || ''} />
          <Field label="Soil Temperature" value={tree.raw?.weather?.temperature ? `${tree.raw.weather.temperature}°C` : ''} />
          <Field label="Air Temperature" value={tree.raw?.weather?.temperature ? `${tree.raw.weather.temperature}°C` : ''} />
          <Field label="Planter Name/ID" value={tree.planter} />
          <Field label="Planting Team" value="" />
        </div>
      </section>

      <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Verification Status</h3>
          <Badge className={statusStyle.badge}>{statusStyle.label}</Badge>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Field label="Verified By" value={tree.verifiedBy || ''} />
          <Field label="Verification Date" value={tree.verificationDate ? formatDateTime(tree.verificationDate) : ''} />
          <Field label="Blockchain Tx" value={tree.blockchainHash || ''} />
        </div>
      </section>

      <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Quick Reference: Tree Status Summary</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <Field label="Current Status" value={statusStyle.label} />
          <Field label="Age" value={tree.age ? `${Math.floor(tree.age / 12)} years` : ''} />
          <Field label="Height" value={tree.height ? `${tree.height} m` : ''} />
          <Field label="DBH" value={tree.raw?.dbh ? `${tree.raw.dbh} cm` : ''} />
          <Field label="Health Score" value={tree.raw?.healthStatus || ''} />
          <Field label="Total Carbon" value={tree.raw?.carbonSequestrationEstimate || ''} />
          <Field label="Last Monitored" value={formatDateTime(tree.timestamp)} />
        </div>
        <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
          Overall Assessment: ________ | Priority Actions Needed: ___________________________
        </div>
      </section>

      <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Map View</h3>
        <p className="text-sm text-gray-500">Tree location overview.</p>
        <div className="mt-4">
          <MapContainer trees={[tree]} onSelectTree={() => {}} />
        </div>
        <button
          type="button"
          className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          onClick={() => onMintToken(tree)}
          disabled={tree.mintedToken || tree.status !== 'verified'}
        >
          {tree.mintedToken ? 'Token Minted' : 'Mint Token'}
        </button>
        {tree.status !== 'verified' && !tree.mintedToken && (
          <p className="mt-2 text-xs text-gray-500">Verify the capture before minting a token.</p>
        )}
      </section>
    </div>
  );
};

TreeProfilePage.propTypes = {
  tree: PropTypes.shape({
    treeId: PropTypes.string.isRequired,
    planter: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired,
    lat: PropTypes.string.isRequired,
    lng: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    age: PropTypes.number,
    height: PropTypes.string,
    verifiedBy: PropTypes.string,
    verificationDate: PropTypes.string,
    mintedToken: PropTypes.bool,
    ledgerId: PropTypes.string,
    raw: PropTypes.object
  }),
  onBack: PropTypes.func.isRequired,
  onMintToken: PropTypes.func.isRequired,
  onOpenPlanterProfile: PropTypes.func.isRequired
};

TreeProfilePage.defaultProps = {
  tree: null
};

export default TreeProfilePage;
