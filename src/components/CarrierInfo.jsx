import { useState, useEffect } from 'react';
import { getAllCarriers } from '../firebase/services';
import { Wifi, Phone, Mail, User } from 'lucide-react';

export default function CarrierInfo() {
  const [carriers, setCarriers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCarriers();
  }, []);

  const loadCarriers = async () => {
    try {
      const data = await getAllCarriers();
      setCarriers(data);
    } catch (error) {
      console.error('Error loading carriers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const carrierColors = {
    'AT&T': 'bg-blue-500',
    'Verizon': 'bg-red-500',
    'T-Mobile': 'bg-pink-500'
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Carrier Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          Account details and contact information for carriers
        </p>
      </div>

      {carriers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carriers.map((carrier) => (
            <div key={carrier.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className={`${carrierColors[carrier.name] || 'bg-gray-500'} p-4`}>
                <div className="flex items-center space-x-3">
                  <Wifi className="h-8 w-8 text-white" />
                  <h3 className="text-xl font-bold text-white">{carrier.name}</h3>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase">Account Number</h4>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{carrier.accountNumber}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase">PIN</h4>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{carrier.pin}</p>
                </div>
                
                {carrier.transferPin && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase">Transfer PIN</h4>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{carrier.transferPin}</p>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">Contact</h4>
                  
                  {carrier.contactName && (
                    <div className="flex items-center space-x-2 text-sm text-gray-700 mb-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{carrier.contactName}</span>
                    </div>
                  )}
                  
                  {carrier.contactEmail && (
                    <div className="flex items-center space-x-2 text-sm text-gray-700 mb-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${carrier.contactEmail}`} className="text-indigo-600 hover:text-indigo-800">
                        {carrier.contactEmail}
                      </a>
                    </div>
                  )}
                  
                  {carrier.contactPhone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${carrier.contactPhone}`} className="text-indigo-600 hover:text-indigo-800">
                        {carrier.contactPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <Wifi className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Carriers</h3>
          <p className="mt-2 text-sm text-gray-500">
            No carrier information has been added yet.
          </p>
        </div>
      )}
    </div>
  );
}
