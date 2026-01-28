import PropTypes from 'prop-types';

const Button = ({ className, children, ...props }) => {
  return (
    <button
      className={`transition duration-200 ease-in-out ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

Button.defaultProps = {
  className: ''
};

export default Button;
