import React, { useState, useEffect } from 'react';
import { AnalyticsStats, VisitorData } from '../../../shared/types';
import { analyticsService } from '../services/analyticsService';
import { AnalyticsFilters, BulkDeleteRequest } from '../services/api/analytics';
import { 
  BarChart3, Users, Eye, Globe, Monitor, Calendar, MapPin, Clock, Wifi, WifiOff,
  Filter, Trash2, Download, RefreshCw, Search, X, AlertTriangle, CheckCircle
} from 'lucide-react';
import AdminAuth from '../components/AdminAuth';

const AnalyticsContent: React.FC = () => {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);
  
  // New state for filtering and management
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AnalyticsFilters>({});
  const [selectedVisitors, setSelectedVisitors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(20);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState<'selected' | 'filtered' | 'all'>('selected');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    checkApiHealth();
  }, []);

  useEffect(() => {
    if (apiHealthy) {
      loadAnalytics();
      loadVisitors();
    }
  }, [timeRange, apiHealthy, currentPage]);

  useEffect(() => {
    if (apiHealthy && (Object.keys(filters).length > 0 || showFilters)) {
      loadFilteredVisitors();
    }
  }, [filters, apiHealthy]);

  const checkApiHealth = async () => {
    try {
      const healthy = await analyticsService.checkApiHealth();
      setApiHealthy(healthy);
      if (!healthy) {
        setError('Backend API is not available. Please check your connection.');
      }
    } catch (err) {
      setApiHealthy(false);
      setError('Failed to connect to analytics API.');
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading analytics stats for', timeRange, 'days');
      const analyticsData = await analyticsService.getAnalyticsStats(timeRange);
      console.log('Analytics data received:', analyticsData);
      setStats(analyticsData);
    } catch (err) {
      console.error('Analytics error details:', err);
      setError('Failed to load analytics data. Please check your backend API.');
    } finally {
      setLoading(false);
    }
  };

  const loadVisitors = async () => {
    try {
      console.log('Loading visitors - page:', currentPage, 'pageSize:', pageSize, 'timeRange:', timeRange);
      const response = await analyticsService.getVisitors(currentPage, pageSize, timeRange);
      console.log('Visitors response:', response);
      if (response && response.visitors && response.pagination) {
        setVisitors(response.visitors);
        setTotalPages(response.pagination.totalPages);
        setTotalCount(response.pagination.totalCount);
      } else {
        console.error('Invalid response structure:', response);
        setVisitors([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Failed to load visitors:', err);
      setVisitors([]);
      setTotalPages(1);
      setTotalCount(0);
    }
  };

  const loadFilteredVisitors = async () => {
    try {
      const response = await analyticsService.getFilteredData(filters, currentPage, pageSize, timeRange);
      if (response && response.visitors && response.pagination) {
        setVisitors(response.visitors);
        setTotalPages(response.pagination.totalPages);
        setTotalCount(response.pagination.totalCount);
      } else {
        console.error('Invalid filtered response structure:', response);
        setVisitors([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Failed to load filtered visitors:', err);
      setVisitors([]);
      setTotalPages(1);
      setTotalCount(0);
    }
  };

  const handleFilterChange = (key: keyof AnalyticsFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
    loadVisitors();
  };

  const handleSelectVisitor = (id: string) => {
    setSelectedVisitors(prev => 
      prev.includes(id) 
        ? prev.filter(visitorId => visitorId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedVisitors.length === visitors.length && visitors.length > 0) {
      setSelectedVisitors([]);
    } else {
      setSelectedVisitors(visitors?.map(v => v.id!).filter(Boolean) || []);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const deletedCount = await analyticsService.bulkDeleteVisitors({ ids: selectedVisitors });
      setSuccessMessage(`Successfully deleted ${deletedCount} visitor records`);
      setSelectedVisitors([]);
      setShowDeleteConfirm(false);
      loadAnalytics();
      loadVisitors();
    } catch (err) {
      setError('Failed to delete selected visitors');
    }
  };

  const handleDeleteFiltered = async () => {
    try {
      const deletedCount = await analyticsService.bulkDeleteVisitors({ 
        filters, 
        days: timeRange 
      });
      setSuccessMessage(`Successfully deleted ${deletedCount} visitor records`);
      setShowDeleteConfirm(false);
      clearFilters();
      loadAnalytics();
      loadVisitors();
    } catch (err) {
      setError('Failed to delete filtered visitors');
    }
  };

  const handleClearAllData = async () => {
    try {
      const deletedCount = await analyticsService.clearAllData();
      setSuccessMessage(`Successfully cleared ${deletedCount} analytics records`);
      setShowDeleteConfirm(false);
      loadAnalytics();
      loadVisitors();
    } catch (err) {
      setError('Failed to clear all data');
    }
  };

  const handleDeleteAction = () => {
    switch (deleteType) {
      case 'selected':
        handleDeleteSelected();
        break;
      case 'filtered':
        handleDeleteFiltered();
        break;
      case 'all':
        handleClearAllData();
        break;
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    
    let date: Date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleString();
  };

  const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({
    title,
    value,
    icon,
    color
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          {React.cloneElement(icon as React.ReactElement, { 
            className: "w-6 h-6", 
            style: { color } 
          })}
        </div>
      </div>
    </div>
  );

  const ChartCard: React.FC<{ title: string; data: { label: string; value: number }[]; color: string }> = ({
    title,
    data,
    color
  }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="space-y-3">
          {data.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1 mr-2">{item.label}</span>
              <div className="flex items-center flex-1">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[2rem]">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // API Health Status Component
  const ApiStatus: React.FC = () => (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
      apiHealthy === null ? 'bg-gray-100 dark:bg-gray-700' :
      apiHealthy ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
      'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
    }`}>
      {apiHealthy === null ? (
        <Clock className="w-4 h-4" />
      ) : apiHealthy ? (
        <Wifi className="w-4 h-4" />
      ) : (
        <WifiOff className="w-4 h-4" />
      )}
      <span className="text-sm font-medium">
        {apiHealthy === null ? 'Checking API...' :
         apiHealthy ? 'API Connected' : 'API Disconnected'}
      </span>
    </div>
  );

  // Success Message Component
  const SuccessMessage: React.FC = () => {
    if (!successMessage) return null;
    
    return (
      <div className="mb-4 bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-500 text-green-700 dark:text-green-400 px-4 py-3 rounded flex items-center justify-between">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span>{successMessage}</span>
        </div>
        <button
          onClick={() => setSuccessMessage(null)}
          className="text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // Filter Panel Component
  const FilterPanel: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
        >
          Clear All
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
          <input
            type="text"
            value={filters.country || ''}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            placeholder="e.g., United States"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
          <input
            type="text"
            value={filters.city || ''}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            placeholder="e.g., New York"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Device Type</label>
          <select
            value={filters.deviceType || ''}
            onChange={(e) => handleFilterChange('deviceType', e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Devices</option>
            <option value="desktop">Desktop</option>
            <option value="mobile">Mobile</option>
            <option value="tablet">Tablet</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Browser</label>
          <input
            type="text"
            value={filters.browser || ''}
            onChange={(e) => handleFilterChange('browser', e.target.value)}
            placeholder="e.g., Chrome"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Operating System</label>
          <input
            type="text"
            value={filters.os || ''}
            onChange={(e) => handleFilterChange('os', e.target.value)}
            placeholder="e.g., Windows"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Page</label>
          <input
            type="text"
            value={filters.page || ''}
            onChange={(e) => handleFilterChange('page', e.target.value)}
            placeholder="e.g., /"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );

  // Delete Confirmation Modal
  const DeleteConfirmModal: React.FC = () => {
    if (!showDeleteConfirm) return null;
    
    const getDeleteMessage = () => {
      switch (deleteType) {
        case 'selected':
          return `Are you sure you want to delete ${selectedVisitors.length} selected visitor records?`;
        case 'filtered':
          return 'Are you sure you want to delete all visitors matching the current filters?';
        case 'all':
          return 'Are you sure you want to delete ALL analytics data? This action cannot be undone.';
        default:
          return 'Are you sure you want to delete this data?';
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Deletion</h3>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {getDeleteMessage()}
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAction}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
          <div className="mt-4 space-x-2">
            <button
              onClick={checkApiHealth}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              Check API
            </button>
            <button
              onClick={loadAnalytics}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">No analytics data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Website visitor analytics with advanced filtering and management</p>
            </div>
            <div className="flex items-center space-x-4">
              <ApiStatus />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value))}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={365}>Last year</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                  showFilters 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              <button
                onClick={loadAnalytics}
                disabled={!apiHealthy}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        <SuccessMessage />

        {/* Filter Panel */}
        {showFilters && <FilterPanel />}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Page Views"
            value={stats?.totalVisitors || 0}
            icon={<Eye />}
            color="#3B82F6"
          />
          <StatCard
            title="Unique Visitors"
            value={stats?.uniqueVisitors || 0}
            icon={<Users />}
            color="#10B981"
          />
          <StatCard
            title="Countries"
            value={stats?.topCountries?.length || 0}
            icon={<Globe />}
            color="#F59E0B"
          />
          <StatCard
            title="Device Types"
            value={stats?.deviceTypes?.length || 0}
            icon={<Monitor />}
            color="#8B5CF6"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <ChartCard
            title="Top Countries"
            data={stats?.topCountries?.map(item => ({ label: item.country, value: item.count })) || []}
            color="#10B981"
          />
          <ChartCard
            title="Device Types"
            data={stats?.deviceTypes?.map(item => ({ label: item.type, value: item.count })) || []}
            color="#8B5CF6"
          />
          <ChartCard
            title="Browsers"
            data={stats?.browsers?.map(item => ({ label: item.browser, value: item.count })) || []}
            color="#F59E0B"
          />
        </div>

        {/* Visitor Management */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Visitor Records ({totalCount.toLocaleString()})
            </h3>
            
            <div className="flex items-center space-x-2">
              {selectedVisitors.length > 0 && (
                <button
                  onClick={() => {
                    setDeleteType('selected');
                    setShowDeleteConfirm(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm flex items-center space-x-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Selected ({selectedVisitors.length})</span>
                </button>
              )}
              
              {Object.keys(filters).length > 0 && (
                <button
                  onClick={() => {
                    setDeleteType('filtered');
                    setShowDeleteConfirm(true);
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm flex items-center space-x-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Filtered</span>
                </button>
              )}
              
              <button
                onClick={() => {
                  setDeleteType('all');
                  setShowDeleteConfirm(true);
                }}
                className="bg-red-800 hover:bg-red-900 text-white px-3 py-2 rounded text-sm flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Data</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedVisitors.length === visitors.length && visitors.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Browser
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {visitors && visitors.length > 0 ? (
                  visitors.map((visitor) => (
                    <tr key={visitor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedVisitors.includes(visitor.id!)}
                          onChange={() => handleSelectVisitor(visitor.id!)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(visitor.timestamp)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {visitor.city && visitor.country ? `${visitor.city}, ${visitor.country}` : visitor.country || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <Monitor className="w-4 h-4 mr-2 text-gray-400" />
                          {visitor.deviceType} ({visitor.os})
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {visitor.browser}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {visitor.page}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={async () => {
                            if (await analyticsService.deleteVisitor(visitor.id!)) {
                              setSuccessMessage('Visitor record deleted successfully');
                              loadAnalytics();
                              loadVisitors();
                            } else {
                              setError('Failed to delete visitor record');
                            }
                          }}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      {apiHealthy === false ? 'Unable to load visitor data - API not connected' : 'No visitor data available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                
                <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <DeleteConfirmModal />
    </div>
  );
};

const Analytics: React.FC = () => {
  return (
    <AdminAuth>
      <AnalyticsContent />
    </AdminAuth>
  );
};

export default Analytics; 