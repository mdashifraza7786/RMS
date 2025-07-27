import React from 'react';
import { FaMoneyBill, FaUniversity, FaIdCard } from 'react-icons/fa';
import { PayoutFields } from '../MemberTypes';

interface PayoutStepProps {
  payoutFields: PayoutFields;
  isSubmitEnabled: boolean;
  onChangePayout: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const PayoutStep: React.FC<PayoutStepProps> = ({
  payoutFields,
  isSubmitEnabled,
  onChangePayout,
  onBack,
  onSubmit
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <FaMoneyBill className="text-[#1e4569]" />
        <h3 className="text-lg font-medium text-gray-800">Payment Information</h3>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <div className="flex items-center">
          <FaIdCard className="text-blue-500 mr-3" />
          <p className="text-blue-700 text-sm">
            Bank account details are required for salary payments and reimbursements.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
          <input
            type="text"
            name="account_name"
            placeholder="Enter Account Name"
            value={payoutFields.account_name}
            onChange={onChangePayout}
            required
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <input
              type="number"
              name="account_number"
              placeholder="Enter Account Number"
              value={payoutFields.account_number}
              onChange={onChangePayout}
              required
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
            <input
              type="text"
              name="ifsc_code"
              placeholder="Enter IFSC Code"
              value={payoutFields.ifsc_code}
              onChange={onChangePayout}
              required
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
          <div className="flex items-center">
            <FaUniversity className="text-gray-400 mr-2" />
            <input
              type="text"
              name="branch_name"
              placeholder="Enter Branch Name"
              value={payoutFields.branch_name}
              onChange={onChangePayout}
              required
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID (Optional)</label>
          <input
            type="text"
            name="upiid"
            placeholder="Enter UPI ID"
            value={payoutFields.upiid}
            onChange={onChangePayout}
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button 
          className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors" 
          onClick={onBack}
        >
          Back
        </button>
        <button 
          className={`px-6 py-2 text-white font-medium rounded-md ${
            isSubmitEnabled 
              ? 'bg-[#1e4569] hover:bg-[#2c5983]' 
              : 'bg-gray-400 cursor-not-allowed'
          } transition-colors`} 
          onClick={onSubmit} 
          disabled={!isSubmitEnabled}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default PayoutStep; 