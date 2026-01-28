import PropTypes from 'prop-types';

const Badge = ({ className, children }) => {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
};

Badge.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

Badge.defaultProps = {
  className: ''
};

export default Badge;
