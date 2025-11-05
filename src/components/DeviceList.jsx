import { useState, useEffect } from 'react';
import { getAllDevices } from '../firebase/services';
import { Smartphone, Search } from 'lucide-react';

export default function DeviceList() {
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDevices();
  }, []);

  useEffect(() => {
    filterDevices();
  }, [devices, searchTerm]);

  const loadDevices = async () => {
    try {
      const data = await getAllDevices();
      setDevices(data);
    } catch (error) {
      console.error('Error loading devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDevices = () => {
    if (searchTerm) {
      setFilteredDevices(
        devices.filter(device =>
          device.deviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.model?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredDevices(devices);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Devices</h2>
        <p className="mt-1 text-sm text-gray-500">
          All managed devices in the system
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((device) => (
          <div key={device.id} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Smartphone className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {device.deviceName}
                </p>
                <p className="text-sm text-gray-500">{device.userName}</p>
                <p className="text-xs text-gray-400 mt-1">{device.model}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    device.type === 'iOS' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {device.type}
                  </span>
                  <span className="text-xs text-gray-500">{device.os}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No devices found
        </div>
      )}
    </div>
  );
}
