import { useState, useEffect } from 'react';
import { getSwapStats } from '../firebase/services';
import { TrendingUp, Users, Smartphone, CheckCircle } from 'lucide-react';

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getSwapStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const completionRate = stats?.total > 0 
    ? ((stats.completed / stats.total) * 100).toFixed(1) 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Statistics</h2>
        <p className="mt-1 text-sm text-gray-500">
          Detailed analytics and insights
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Swaps</p>
              <p className="text-3xl font-bold mt-2">{stats?.total || 0}</p>
            </div>
            <Smartphone className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold mt-2">{stats?.completed || 0}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold mt-2">{stats?.inProgress || 0}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Completion Rate</p>
              <p className="text-3xl font-bold mt-2">{completionRate}%</p>
            </div>
            <Users className="h-12 w-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Carrier Distribution */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Carrier Distribution</h3>
        <div className="space-y-4">
          {stats?.byCarrier && Object.entries(stats.byCarrier).map(([carrier, count]) => {
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <div key={carrier}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{carrier}</span>
                  <span className="text-sm text-gray-500">{count} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      carrier === 'AT&T' ? 'bg-blue-500' :
                      carrier === 'Verizon' ? 'bg-red-500' :
                      'bg-pink-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assignee Performance */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Swaps by Assignee</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats?.byAssignee && Object.entries(stats.byAssignee)
            .sort((a, b) => b[1] - a[1])
            .map(([assignee, count]) => (
              <div key={assignee} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{assignee}</span>
                  <span className="text-2xl font-bold text-indigo-600">{count}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
