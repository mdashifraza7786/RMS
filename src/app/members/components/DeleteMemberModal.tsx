import React, { useState } from 'react';
import { Bars } from 'react-loader-spinner';
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa';

interface DeleteMemberModalProps {
  isVisible: boolean;
  memberName: string;
  memberID: string;
  loading: boolean;
  onClose: () => void;
  onDelete: (memberID: string) => void;
}

const DeleteMemberModal: React.FC<DeleteMemberModalProps> = ({
  isVisible,
  memberName,
  memberID,
  loading,
  onClose,
  onDelete
}) => {
  const [confirmText, setConfirmText] = useState('');
  
  if (!isVisible) return null;
  
  const handleDelete = () => {
    if (confirmText === memberName) {
      onDelete(memberID);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-scaleIn">
        <div className="bg-red-600 text-white p-5 rounded-t-xl flex items-center gap-3">
          <FaExclamationTriangle size={24} />
          <h3 className="text-xl font-bold">Delete Member</h3>
        </div>
    
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this member? This action cannot be undone.
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex items-center">
                <FaTrash className="text-red-500 mr-3" />
                <p className="text-red-700">
                  <span className="font-bold">{memberName}</span> will be permanently removed from the system.
                </p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="font-bold">{memberName}</span> to confirm deletion:
              </label>
              <input
                type="text"
                placeholder={`Type "${memberName}" to confirm`}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => { onClose(); setConfirmText(''); }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg"
              disabled={loading}
            >
              Cancel
            </button>
            
            {loading ? (
              <button className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg flex items-center justify-center">
                <Bars
                  height="20"
                  width="20"
                  color="#ffffff"
                  ariaLabel="bars-loading"
                  visible={true}
                />
              </button>
            ) : (
              <button
                onClick={handleDelete}
                className={`px-4 py-2 font-medium rounded-lg ${
                  confirmText === memberName 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-red-200 text-red-400 cursor-not-allowed'
                }`}
                disabled={confirmText !== memberName}
              >
                Delete Member
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DeleteMemberModal; 