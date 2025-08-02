import React from 'react';

const MemberHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-800">Members</h1>
        </div>
      </div>
    </div>
  );
};

export default MemberHeader; 