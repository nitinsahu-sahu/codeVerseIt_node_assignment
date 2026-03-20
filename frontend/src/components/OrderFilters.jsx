import { FaSearch, FaFilter } from 'react-icons/fa';

const OrderFilters = ({ 
  filter, 
  setFilter, 
  dateRange, 
  setDateRange, 
  searchTerm, 
  setSearchTerm 
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'created', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID or restaurant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <FaFilter className="absolute left-3 top-3 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="relative">
          <FaFilter className="absolute left-3 top-3 text-gray-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            {dateOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {(filter !== 'all' || dateRange !== 'all' || searchTerm) && (
        <div className="mt-3 flex items-center">
          <span className="text-sm text-gray-600 mr-2">Active Filters:</span>
          <div className="flex flex-wrap gap-2">
            {filter !== 'all' && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Status: {filter}
              </span>
            )}
            {dateRange !== 'all' && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Date: {dateRange}
              </span>
            )}
            {searchTerm && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                Search: "{searchTerm}"
              </span>
            )}
            <button
              onClick={() => {
                setFilter('all');
                setDateRange('all');
                setSearchTerm('');
              }}
              className="text-red-600 text-xs hover:underline"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFilters;