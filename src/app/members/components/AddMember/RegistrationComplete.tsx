import React from 'react';
import { FaCheckCircle, FaUser, FaKey, FaCopy } from 'react-icons/fa';

interface RegistrationCompleteProps {
  credentials: {
    uniqueID?: string;
    password?: string;
  };
}

const RegistrationComplete: React.FC<RegistrationCompleteProps> = ({ credentials }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <FaCheckCircle className="text-green-600 text-4xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Registration Successful!</h3>
        <p className="text-gray-600 mt-2 text-center">
          The member has been added successfully. Please save the login credentials below.
        </p>
      </div>

      <div className="w-full max-w-md bg-blue-50 rounded-lg p-6 border border-blue-100">
        <h4 className="text-blue-800 font-medium mb-4 text-center">Login Credentials</h4>
        
        <div className="space-y-4">
          <div className="bg-white rounded-md p-3 flex items-center justify-between border border-blue-200">
            <div className="flex items-center">
              <FaUser className="text-gray-500 mr-3" />
              <div>
                <p className="text-xs text-gray-500">User ID</p>
                <p className="font-medium">{credentials.uniqueID}</p>
              </div>
            </div>
            <button 
              onClick={() => copyToClipboard(credentials.uniqueID || '')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Copy to clipboard"
            >
              <FaCopy className="text-gray-500" />
            </button>
          </div>
          
          <div className="bg-white rounded-md p-3 flex items-center justify-between border border-blue-200">
            <div className="flex items-center">
              <FaKey className="text-gray-500 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Password</p>
                <p className="font-medium">{credentials.password}</p>
              </div>
            </div>
            <button 
              onClick={() => copyToClipboard(credentials.password || '')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Copy to clipboard"
            >
              <FaCopy className="text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-blue-200 text-center">
          <p className="text-sm text-blue-800">
            Please share these credentials with the member securely.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationComplete; 