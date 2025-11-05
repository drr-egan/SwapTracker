import { useState, useEffect } from 'react';
import { getAllSwaps, createSwap, updateSwap, deleteSwap } from '../firebase/services';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

export default function SwapManagement() {
  const [swaps, setSwaps] = useState([]);
  const [filteredSwaps, setFilteredSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingSwap, setEditingSwap] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    currentCarrier: '',
    currentDevice: '',
    tempNumber: '',
    phoneChoice: '',
    assignedTo: '',
    status: 'pending'
  });

  useEffect(() => {
    loadSwaps();
  }, []);

  useEffect(() => {
    filterSwaps();
  }, [swaps, searchTerm, statusFilter]);

  const loadSwaps = async () => {
    try {
      const data = await getAllSwaps();
      setSwaps(data);
    } catch (error) {
      console.error('Error loading swaps:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSwaps = () => {
    let filtered = [...swaps];

    if (searchTerm) {
      filtered = filtered.filter(swap =>
        swap.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        swap.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        swap.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        swap.phoneNumber?.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(swap => swap.status === statusFilter);
    }

    setFilteredSwaps(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSwap) {
        await updateSwap(editingSwap.id, formData);
      } else {
        await createSwap(formData);
      }
      resetForm();
      loadSwaps();
    } catch (error) {
      console.error('Error saving swap:', error);
      alert('Failed to save swap');
    }
  };

  const handleEdit = (swap) => {
    setEditingSwap(swap);
    setFormData({
      email: swap.email || '',
      firstName: swap.firstName || '',
      lastName: swap.lastName || '',
      phoneNumber: swap.phoneNumber || '',
      currentCarrier: swap.currentCarrier || '',
      currentDevice: swap.currentDevice || '',
      tempNumber: swap.tempNumber || '',
      phoneChoice: swap.phoneChoice || '',
      assignedTo: swap.assignedTo || '',
      status: swap.status || 'pending'
    });
    setShowModal(true);
  };

  const handleDelete = async (swapId) => {
    if (window.confirm('Are you sure you want to delete this swap?')) {
      try {
        await deleteSwap(swapId);
        loadSwaps();
      } catch (error) {
        console.error('Error deleting swap:', error);
        alert('Failed to delete swap');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      currentCarrier: '',
      currentDevice: '',
      tempNumber: '',
      phoneChoice: '',
      assignedTo: '',
      status: 'pending'
    });
    setEditingSwap(null);
    setShowModal(false);
  };

  const carriers = ['AT&T', 'Verizon', 'T-Mobile'];
  const assignees = ['Luke', 'Randy', 'Charley', 'Other'];
  const statuses = ['pending', 'in-progress', 'completed'];

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Swap Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage device swaps
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Swap
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Swaps Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Choice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSwaps.map((swap) => (
                <tr key={swap.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {swap.firstName} {swap.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{swap.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {swap.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{swap.currentCarrier}</div>
                    <div className="text-sm text-gray-500">{swap.currentDevice}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {swap.phoneChoice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {swap.assignedTo || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        swap.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : swap.status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {swap.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(swap)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(swap.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={resetForm}></div>
            
            <div className="relative bg-white rounded-lg max-w-2xl w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingSwap ? 'Edit Swap' : 'New Swap'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Temp Number</label>
                    <input
                      type="tel"
                      value={formData.tempNumber}
                      onChange={(e) => setFormData({...formData, tempNumber: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Carrier</label>
                    <select
                      required
                      value={formData.currentCarrier}
                      onChange={(e) => setFormData({...formData, currentCarrier: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Select...</option>
                      {carriers.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Device</label>
                    <input
                      type="text"
                      required
                      value={formData.currentDevice}
                      onChange={(e) => setFormData({...formData, currentDevice: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">New Phone Choice</label>
                  <input
                    type="text"
                    value={formData.phoneChoice}
                    onChange={(e) => setFormData({...formData, phoneChoice: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                    <select
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Select...</option>
                      {assignees.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    {editingSwap ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
