import PropTypes from 'prop-types';

const TreeMarker = ({ x, y, status, onClick, title }) => {
  const resolvedStatus =
    status === 'verified' || status === 'pending' || status === 'rejected' ? status : 'pending';
  const colorClass =
    resolvedStatus === 'verified'
      ? 'fill-green-500'
      : resolvedStatus === 'pending'
      ? 'fill-yellow-500'
      : 'fill-red-500';

  return (
    <g className="cursor-pointer" onClick={onClick}>
      <circle cx={`${x}%`} cy={`${y}%`} r="6" className={`${colorClass} opacity-80`}>
        <title>{title}</title>
      </circle>
      {resolvedStatus === 'pending' ? (
        <circle cx={`${x}%`} cy={`${y}%`} r="6" className="fill-yellow-400" opacity="0.3">
          <animate attributeName="r" from="6" to="12" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
      ) : null}
    </g>
  );
};

TreeMarker.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default TreeMarker;
