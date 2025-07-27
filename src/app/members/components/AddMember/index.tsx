import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import PopupHeader from './PopupHeader';
import BasicInfoStep from './BasicInfoStep';
import AddressStep from './AddressStep';
import PayoutStep from './PayoutStep';
import LoadingState from './LoadingState';
import RegistrationComplete from './RegistrationComplete';
import { BasicInfoFields, AddressFields, PayoutFields } from '../MemberTypes';

interface AddMemberProps {
  onClose: () => void;
}

const AddMember: React.FC<AddMemberProps> = ({ onClose }) => {
  // Step state
  const [currentStep, setCurrentStep] = useState<'basicInfo' | 'address' | 'payout' | 'submitting' | 'completed'>('basicInfo');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<{ uniqueID?: string; password?: string }>({});

  // Form data
  const [basicInfoFields, setBasicInfoFields] = useState<BasicInfoFields>({
    name: '',
    phone_number: '',
    email: '',
    aadhar_no: '',
    pan_no: '',
    role: '',
    photo: '',
  });

  const [addressFields, setAddressFields] = useState<AddressFields>({
    street_or_house_no: '',
    landmark: '',
    address_one: '',
    address_two: '',
    city: '',
    state: '',
    country: '',
    pin_code: '',
  });

  const [payoutFields, setPayoutFields] = useState<PayoutFields>({
    account_name: '',
    account_number: '',
    ifsc_code: '',
    branch_name: '',
    upiid: '',
  });

  // Button states
  const [isNextEnabled1, setIsNextEnabled1] = useState(false);
  const [isNextEnabled2, setIsNextEnabled2] = useState(false);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  // Validate form fields
  useEffect(() => {
    const isBasicInfoComplete = Object.values(basicInfoFields).every(field => field && field.trim() !== '') && !!imagePreviewUrl;
    setIsNextEnabled1(isBasicInfoComplete);
  }, [basicInfoFields, imagePreviewUrl]);

  useEffect(() => {
    const isAddressComplete = Object.entries(addressFields).every(([key, value]) => {
      if (key === 'landmark' || key === 'address_two') return true; // Allow these to be empty
      return value.trim() !== ''; // Ensure all other fields are filled
    });
    setIsNextEnabled2(isAddressComplete);
  }, [addressFields]);

  useEffect(() => {
    const isPayoutComplete = Object.entries(payoutFields).every(([key, value]) => {
      if (key === 'upiid') return true; // Allow UPI ID to be empty
      return value.trim() !== ''; // Ensure all other fields are filled
    });
    setIsSubmitEnabled(isPayoutComplete);
  }, [payoutFields]);

  // Event handlers
  const handleChangeBasicInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBasicInfoFields({
      ...basicInfoFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBasicInfoFields({
      ...basicInfoFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressFields({
      ...addressFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePayout = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayoutFields({
      ...payoutFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      
      // Create an image element to get dimensions
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.onload = () => {
          // Create a canvas to potentially resize the image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set dimensions maintaining aspect ratio
          const MAX_SIZE = 300; // Max width/height
          let width = img.width;
          let height = img.height;
          
          if (width > height && width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw image on canvas and convert to data URL
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          setImagePreviewUrl(dataUrl);
          setBasicInfoFields({
            ...basicInfoFields,
            photo: dataUrl
          });
        };
        
        img.src = e.target?.result as string;
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreviewUrl(null);
    setBasicInfoFields({
      ...basicInfoFields,
      photo: ''
    });
  };

  // Step navigation
  const handleNextStep1 = () => setCurrentStep('address');
  const handleNextStep2 = () => setCurrentStep('payout');
  const handleBackStep1 = () => setCurrentStep('basicInfo');
  const handleBackStep2 = () => setCurrentStep('address');

  // Form submission
  const handleSubmit = async () => {
    setCurrentStep('submitting');
    try {
      const response = await axios.post('/api/members/register', {
        basicInfoFields,
        addressFields,
        payoutFields
      });
      
      if (response.status === 200) {
        setCredentials(response.data.cred || {});
        setCurrentStep('completed');
      }
    } catch (error) {
      console.error('Error registering member:', error);
      alert('An error occurred while registering the member.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto animate-scaleIn">
        <PopupHeader currentStep={currentStep} onClose={onClose} />
        
        <div className="p-6">
          {currentStep === 'basicInfo' && (
            <BasicInfoStep
              basicInfoFields={basicInfoFields}
              imagePreviewUrl={imagePreviewUrl}
              isNextEnabled={isNextEnabled1}
              onChangeBasicInfo={handleChangeBasicInfo}
              onChangeRole={handleChangeRole}
              onFileChange={handleFileChange}
              onRemoveImage={handleRemoveImage}
              onNext={handleNextStep1}
            />
          )}
          
          {currentStep === 'address' && (
            <AddressStep
              addressFields={addressFields}
              isNextEnabled={isNextEnabled2}
              onChangeAddress={handleChangeAddress}
              onBack={handleBackStep1}
              onNext={handleNextStep2}
            />
          )}
          
          {currentStep === 'payout' && (
            <PayoutStep
              payoutFields={payoutFields}
              isSubmitEnabled={isSubmitEnabled}
              onChangePayout={handleChangePayout}
              onBack={handleBackStep2}
              onSubmit={handleSubmit}
            />
          )}
          
          {currentStep === 'submitting' && <LoadingState />}
          
          {currentStep === 'completed' && <RegistrationComplete credentials={credentials} />}
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

export default AddMember; 