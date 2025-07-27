import React, { ChangeEvent } from 'react';
import { FaTimes, FaUserCircle, FaCamera } from 'react-icons/fa';
import { BasicInfoFields } from '../MemberTypes';

interface BasicInfoStepProps {
  basicInfoFields: BasicInfoFields;
  imagePreviewUrl: string | null;
  isNextEnabled: boolean;
  onChangeBasicInfo: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeRole: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onNext: () => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  basicInfoFields,
  imagePreviewUrl,
  isNextEnabled,
  onChangeBasicInfo,
  onChangeRole,
  onFileChange,
  onRemoveImage,
  onNext
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-4 col-span-2">
        {imagePreviewUrl ? (
          <div className="relative w-32 h-32">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center bg-gray-100">
              <img 
                src={imagePreviewUrl} 
                alt="Selected Profile" 
                className="h-full w-full object-cover" 
                style={{ objectPosition: 'center' }}
              />
            </div>
            <button
              onClick={onRemoveImage}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition shadow-sm"
              aria-label="Remove image"
            >
              <FaTimes size={12} />
            </button>
          </div>
        ) : (
          <div
            className="w-32 h-32 flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
            onClick={() => document.getElementById('profile_image')?.click()}
          >
            <FaCamera className="text-gray-400 text-2xl mb-1" />
            <span className="text-xs text-gray-500">Upload Photo</span>
            <input
              type="file"
              id="profile_image"
              className="hidden"
              onChange={onFileChange}
              accept="image/*"
              required
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter Full Name"
            value={basicInfoFields.name}
            onChange={onChangeBasicInfo}
            required
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="number"
            name="phone_number"
            placeholder="Enter Phone Number"
            value={basicInfoFields.phone_number}
            onChange={onChangeBasicInfo}
            required
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={basicInfoFields.email}
            onChange={onChangeBasicInfo}
            required
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
            <input
              type="number"
              name="aadhar_no"
              placeholder="Enter Aadhaar Number"
              value={basicInfoFields.aadhar_no}
              onChange={onChangeBasicInfo}
              required
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
            <input
              type="text"
              name="pan_no"
              placeholder="Enter PAN Number"
              value={basicInfoFields.pan_no}
              onChange={onChangeBasicInfo}
              required
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            name="role"
            value={basicInfoFields.role}
            onChange={onChangeRole}
            required
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-[#1e4569] focus:border-[#1e4569] focus:outline-none"
          >
            <option value="" disabled>Select Role</option>
            <option value="waiter">Waiter</option>
            <option value="chef">Chef</option>
            <option value="manager">Manager</option>
            <option value="washer">Washer</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-4">
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

export default BasicInfoStep; 