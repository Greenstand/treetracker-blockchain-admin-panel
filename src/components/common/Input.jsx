import PropTypes from 'prop-types';

const Input = ({ label, id, ...props }) => {
  return (
    <label className="block text-sm font-medium text-gray-700" htmlFor={id}>
      {label}
      <input
        id={id}
        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        {...props}
      />
    </label>
  );
};

Input.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

export default Input;
