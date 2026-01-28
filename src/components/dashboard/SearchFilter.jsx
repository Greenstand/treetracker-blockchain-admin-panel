import PropTypes from 'prop-types';
import { Filter, Search } from 'lucide-react';

const SearchFilter = ({ searchQuery, onSearchChange, filterStatus, onFilterChange }) => {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by species, planter, or ID..."
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <Filter size={18} className="text-gray-400" />
        <select
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={filterStatus}
          onChange={(event) => onFilterChange(event.target.value)}
        >
          <option value="all">All Status</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>
  );
};

SearchFilter.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  filterStatus: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired
};

export default SearchFilter;
