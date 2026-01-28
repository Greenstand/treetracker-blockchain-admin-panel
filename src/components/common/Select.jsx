import PropTypes from 'prop-types';

const Select = ({ label, id, children, ...props }) => {
  return (
    <label className="block text-sm font-medium text-gray-700" htmlFor={id}>
      {label}
      <select
        id={id}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        {...props}
      >
        {children}
      </select>
    </label>
  );
};

Select.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default Select;
