import { useState, useEffect } from 'react';
import { getSwapStats, getAllSwaps } from '../firebase/services';
import { Users, Repeat, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentSwaps, setRecentSwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, swapsData] = await Promise.all([
        getSwapStats(),
        getAllSwaps()
      ]);
      setStats(statsData);
      setRecentSwaps(swapsData.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Swaps',
      value: stats?.total || 0,
      icon: Repeat,
      color: 'bg-blue-500'
    },
    {
      name: 'Completed',
      value: stats?.completed || 0,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      name: 'In Progress',
      value: stats?.inProgress || 0,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      name: 'Pending',
      value: stats?.pending || 0,
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your office swap operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carrier Distribution */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Swaps by Carrier
        </h3>
        <div className="space-y-3">
          {stats?.byCarrier && Object.entries(stats.byCarrier).map(([carrier, count]) => (
            <div key={carrier} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{carrier}</span>
              <div className="flex items-center space-x-3">
                <div className="w-48 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-12 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Swaps */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Swaps</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentSwaps.length > 0 ? (
            recentSwaps.map((swap) => (
              <div key={swap.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {swap.firstName} {swap.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{swap.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">
                      {swap.currentCarrier} → {swap.phoneChoice?.split(' ')[0]}
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        swap.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : swap.status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {swap.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              No swaps yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
