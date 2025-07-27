import React from 'react';
import { Bars } from 'react-loader-spinner';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Bars
        height="60"
        width="60"
        color="#1e4569"
        ariaLabel="loading"
        visible={true}
      />
      <p className="mt-6 text-gray-600 font-medium">
        Registering new member...
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Please wait while we create the account
      </p>
    </div>
  );
};

export default LoadingState; 