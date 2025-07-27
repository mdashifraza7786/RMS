import React from 'react';
import { Bars } from 'react-loader-spinner';
import { Member } from './MemberTypes';
import { FaUserEdit, FaUser, FaIdCard, FaBuilding, FaMoneyBill, FaMapMarkerAlt } from 'react-icons/fa';

interface EditMemberModalProps {
  isVisible: boolean;
  memberData: Member;
  loading: boolean;
  onClose: () => void;
  onSave: (member: Member) => void;
  onChange: (updatedData: Member) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({
  isVisible,
  memberData,
  loading,
  onClose,
  onSave,
  onChange,
  onFileChange
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto animate-scaleIn">
        {/* Header */}
        <div className="bg-[#1e4569] text-white p-5 rounded-t-xl sticky top-0 z-10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FaUserEdit />
              Edit Member
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition"
              disabled={loading}
            >
              ✕
            </button>
          </div>
          <div className="text-sm text-white/80">
            ID: {memberData.userid}
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex justify-center items-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <Bars
                height="60"
                width="60"
                color="#1e4569"
                ariaLabel="bars-loading"
                visible={true}
              />
              <p className="mt-4 text-gray-700 font-medium">Saving changes...</p>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="flex items-center text-gray-700 font-medium mb-4 pb-2 border-b border-gray-200">
                <FaUser className="mr-2 text-[#1e4569]" />
                Personal Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={memberData.name}
                    onChange={(e) => onChange({ ...memberData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={memberData.role}
                    onChange={(e) => onChange({ ...memberData, role: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
                  >
                    <option value="waiter">Waiter</option>
                    <option value="chef">Chef</option>
                    <option value="manager">Manager</option>
                    <option value="washer">Washer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input
                    type="text"
                    value={memberData.mobile}
                    onChange={(e) => onChange({ ...memberData, mobile: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={memberData.email}
                    onChange={(e) => onChange({ ...memberData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* ID Documents */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="flex items-center text-gray-700 font-medium mb-4 pb-2 border-b border-gray-200">
                <FaIdCard className="mr-2 text-[#1e4569]" />
                ID Documents
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                  <input
                    type="text"
                    value={memberData.aadhaar}
                    onChange={(e) => onChange({ ...memberData, aadhaar: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card</label>
                  <input
                    type="text"
                    value={memberData.pancard}
                    onChange={(e) => onChange({ ...memberData, pancard: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="flex items-center text-gray-700 font-medium mb-4 pb-2 border-b border-gray-200">
                <FaMoneyBill className="mr-2 text-[#1e4569]" />
                Bank Details
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder</label>
                  <input
                    type="text"
                    value={memberData.account_name}
                    onChange={(e) => onChange({ ...memberData, account_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={memberData.account_number}
                    onChange={(e) => onChange({ ...memberData, account_number: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={memberData.ifsc_code}
                    onChange={(e) => onChange({ ...memberData, ifsc_code: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                  <input
                    type="text"
                    value={memberData.branch_name}
                    onChange={(e) => onChange({ ...memberData, branch_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                  <input
                    type="text"
                    value={memberData.upiid}
                    onChange={(e) => onChange({ ...memberData, upiid: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="flex items-center text-gray-700 font-medium mb-4 pb-2 border-b border-gray-200">
                <FaMapMarkerAlt className="mr-2 text-[#1e4569]" />
                Address Details
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street/House No</label>
                  <input
                    type="text"
                    value={memberData.street_or_house_no}
                    onChange={(e) => onChange({ ...memberData, street_or_house_no: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                  <input
                    type="text"
                    value={memberData.landmark}
                    onChange={(e) => onChange({ ...memberData, landmark: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                  <input
                    type="text"
                    value={memberData.address_one}
                    onChange={(e) => onChange({ ...memberData, address_one: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                  <input
                    type="text"
                    value={memberData.address_two || ''}
                    onChange={(e) => onChange({ ...memberData, address_two: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={memberData.city}
                    onChange={(e) => onChange({ ...memberData, city: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={memberData.state}
                    onChange={(e) => onChange({ ...memberData, state: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={memberData.pin}
                    onChange={(e) => onChange({ ...memberData, pin: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e4569]"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(memberData)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1e4569] hover:bg-[#2c5983] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e4569]"
              disabled={loading}
            >
              Save Changes
            </button>
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

export default EditMemberModal; 