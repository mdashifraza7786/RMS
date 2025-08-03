import React from 'react';
import { FaPhone, FaEnvelope, FaIdCard, FaAddressCard, FaMoneyBillAlt } from 'react-icons/fa';
import { Member } from './MemberTypes';
import Image from 'next/image';

interface ViewMemberModalProps {
  member: Member;
  isVisible: boolean;
  onClose: () => void;
}

const ViewMemberModal: React.FC<ViewMemberModalProps> = ({ member, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-auto animate-scaleIn">
        <div className="bg-primary text-white p-5 rounded-t-xl sticky top-0 z-10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
              Member Details
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition"
            >
              ✕
            </button>
          </div>
          <div className="text-sm text-white/80">
            ID: {member.userid}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center h-36 gap-6">
            <div className="h-36 w-36 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm flex items-center justify-center bg-gray-100">
              {member.photo ? (
                <Image 
                  src={member.photo} 
                  alt={member.name} 
                  className="h-full w-full object-cover"
                  style={{ objectPosition: 'center' }}
                  width={144}
                  height={144}
                />
              ) : (
                <div className="h-full w-full bg-gray-300 flex items-center justify-center text-gray-500 text-4xl font-medium">
                  {member.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <h4 className="text-xl font-bold text-gray-800">{member.name}</h4>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                member.role === 'chef' ? 'bg-blue-100 text-blue-800' : 
                member.role === 'waiter' ? 'bg-green-100 text-green-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {member.role.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Contact Information</h5>
            <div className="space-y-2">
              <div className="flex items-center">
                <FaPhone className="text-gray-400 mr-3" />
                <span className="text-gray-800">{member.mobile}</span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-gray-400 mr-3" />
                <span className="text-gray-800">{member.email}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">ID Documents</h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <FaIdCard className="mr-1" /> Aadhaar
                </div>
                <p className="font-medium text-gray-800">{member.aadhaar || 'Not provided'}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <FaIdCard className="mr-1" /> PAN Card
                </div>
                <p className="font-medium text-gray-800">{member.pancard || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              <FaMoneyBillAlt className="inline mr-1" /> Bank Details
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Account Holder</span>
                <span className="font-medium text-gray-900">{member.account_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number</span>
                <span className="font-medium text-gray-900">{member.account_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IFSC Code</span>
                <span className="font-medium text-gray-900">{member.ifsc_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Branch</span>
                <span className="font-medium text-gray-900">{member.branch_name}</span>
              </div>
              {member.upiid && (
                <div className="flex justify-between">
                  <span className="text-gray-600">UPI ID</span>
                  <span className="font-medium text-gray-900">{member.upiid}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              <FaAddressCard className="inline mr-1" /> Address
            </h5>
            <div className="text-gray-800">
              <p>{member.street_or_house_no}</p>
              {member.landmark && <p>{member.landmark}</p>}
              <p>{member.address_one}</p>
              {member.address_two && <p>{member.address_two}</p>}
              <p>{member.city}, {member.state} - {member.pin}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg"
            >
              Close
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

export default ViewMemberModal; 