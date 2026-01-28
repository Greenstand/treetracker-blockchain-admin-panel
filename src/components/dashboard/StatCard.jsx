import PropTypes from 'prop-types';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="rounded-lg border-l-4 bg-white p-6 shadow-md" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="rounded-full p-3" style={{ backgroundColor: `${color}20` }}>
        <Icon size={24} color={color} />
      </div>
    </div>
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired
};

export default StatCard;
