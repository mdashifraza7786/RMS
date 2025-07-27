import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface PopupHeaderProps {
  currentStep: 'basicInfo' | 'address' | 'payout' | 'submitting' | 'completed';
  onClose: () => void;
}

const PopupHeader: React.FC<PopupHeaderProps> = ({ currentStep, onClose }) => {
  const getTitle = () => {
    switch (currentStep) {
      case 'basicInfo':
        return 'Add Member';
      case 'address':
        return 'Add Address';
      case 'payout':
        return 'Add Payout Details';
      case 'submitting':
        return 'Progress...';
      case 'completed':
        return 'Registration Complete';
      default:
        return 'Add Member';
    }
  };

  return (
    <div className='flex justify-between items-center px-10 py-5 h-[4rem] border-b-[1px] border-gray-300 z-20 sticky top-0 left-0 bg-white shadow-sm'>
      <h2 className="text-2xl text-[#1e4569] font-bold text-center">{getTitle()}</h2>
      <FaTimes onClick={onClose} className='text-2xl text-red-600 cursor-pointer' />
    </div>
  );
};

export default PopupHeader; 