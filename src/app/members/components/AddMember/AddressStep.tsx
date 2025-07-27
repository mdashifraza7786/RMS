import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { AddressFields } from '../MemberTypes';

interface AddressStepProps {
  addressFields: AddressFields;
  isNextEnabled: boolean;
  onChangeAddress: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onNext: () => void;
}

const AddressStep: React.FC<AddressStepProps> = ({
  addressFields,
  isNextEnabled,
  onChangeAddress,
  onBack,
  onNext
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <FaMapMarkerAlt className="text-[#1e4569]" />
        <h3 className="text-lg font-medium text-gray-800">Address Information</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street/House No.</label>
            <input
              type="text"
              name="street_or_house_no"
              placeholder="Enter Street/House no."
              value={addressFields.street_or_house_no}
              onChange={onChangeAddress}
              required
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
            <input
              type="text"
              name="landmark"
              placeholder="Enter Landmark"
              value={addressFields.landmark}
              onChange={onChangeAddress}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
          <input
            type="text"
            name="address_one"
            placeholder="Enter Address 1"
            value={addressFields.address_one}
            onChange={onChangeAddress}
            required
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
          <input
            type="text"
            name="address_two"
            placeholder="Enter Address 2"
            value={addressFields.address_two}
            onChange={onChangeAddress}
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              placeholder="Enter City"
              value={addressFields.city}
              onChange={onChangeAddress}
              required
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              name="state"
              placeholder="Enter State"
              value={addressFields.state}
              onChange={onChangeAddress}
              required
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              name="country"
              placeholder="Enter Country"
              value={addressFields.country}
              onChange={onChangeAddress}
              required
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
          <input
            type="text"
            name="pin_code"
            placeholder="Enter PIN Code"
            value={addressFields.pin_code}
            onChange={onChangeAddress}
            required
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
            isNextEnabled 
              ? 'bg-[#1e4569] hover:bg-[#2c5983]' 
              : 'bg-gray-400 cursor-not-allowed'
          } transition-colors`} 
          onClick={onNext} 
          disabled={!isNextEnabled}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AddressStep; 