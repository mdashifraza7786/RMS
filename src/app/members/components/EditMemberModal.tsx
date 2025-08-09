import React, { useState } from 'react';
import { Bars } from 'react-loader-spinner';
import { Member } from './MemberTypes';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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

  // Local-only password change UI state (no backend integration)
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ message: string; success: boolean } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);

  const generateStrongPassword = (length: number = 12): string => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{};:,.<>?';
    const all = upper + lower + digits + symbols;

    const pick = (chars: string) => chars[Math.floor(Math.random() * chars.length)];

    // Ensure at least one from each set
    const req = [pick(upper), pick(lower), pick(digits), pick(symbols)];
    const remaining = Array.from({ length: Math.max(0, length - req.length) }, () => pick(all));
    const combined = [...req, ...remaining];

    // Shuffle
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    return combined.join('');
  };

  const handleGeneratePassword = () => {
    const pwd = generateStrongPassword(12);
    setNewPassword(pwd);
    setConfirmPassword(pwd);
    setPasswordFeedback({ message: 'Generated a strong password. You can update now.', success: true });
  };

  const handleCopyPassword = async () => {
    try {
      if (!newPassword) {
        setPasswordFeedback({ message: 'Nothing to copy. Generate or enter a password first.', success: false });
        return;
      }
      await navigator.clipboard.writeText(newPassword);
      setPasswordFeedback({ message: 'Password copied to clipboard.', success: true });
    } catch (e) {
      setPasswordFeedback({ message: 'Failed to copy password.', success: false });
    }
  };

  const handleLocalPasswordUpdate = () => {
    if (newPassword.length < 6) {
      setPasswordFeedback({ message: 'Password must be at least 6 characters.', success: false });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ message: 'Passwords do not match.', success: false });
      return;
    }
    setPasswordLoading(true);
    fetch('/api/members/updateMember', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: memberData.userid,
        newPassword: newPassword,
        type: 'passwordChange',
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.success) {
          setPasswordFeedback({ message: 'Password updated successfully.', success: true });
        } else {
          setPasswordFeedback({ message: data.message || 'Failed to update password.', success: false });
        }
      })
      .catch(() => {
        setPasswordFeedback({ message: 'Failed to update password.', success: false });
      })
      .finally(() => {
        setPasswordLoading(false);
      });
    setPasswordFeedback({ message: 'Password updated successfully.', success: true });
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto animate-scaleIn">
        <div className="bg-primary text-white p-5 rounded-t-xl sticky top-0 z-10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
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

        {loading && (
          <div className="absolute inset-0 bg-white/80 flex justify-center items-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <Bars
                height="60"
                width="60"
                color="primary"
                ariaLabel="bars-loading"
                visible={true}
              />
              <p className="mt-4 text-gray-700 font-medium">Saving changes...</p>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="flex items-center text-gray-700 font-medium mb-4 pb-2 border-b border-gray-200">
                Personal Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={memberData.name}
                    onChange={(e) => onChange({ ...memberData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={memberData.role}
                    onChange={(e) => onChange({ ...memberData, role: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary focus:outline-none"
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={memberData.email}
                    onChange={(e) => onChange({ ...memberData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="flex items-center text-gray-700 font-medium mb-4 pb-2 border-b border-gray-200">
                ID Documents
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                  <input
                    type="text"
                    value={memberData.aadhaar}
                    onChange={(e) => onChange({ ...memberData, aadhaar: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card</label>
                  <input
                    type="text"
                    value={memberData.pancard}
                    onChange={(e) => onChange({ ...memberData, pancard: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="flex items-center text-gray-700 font-medium mb-4 pb-2 border-b border-gray-200">
                Bank Details
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder</label>
                  <input
                    type="text"
                    value={memberData.account_name}
                    onChange={(e) => onChange({ ...memberData, account_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={memberData.account_number}
                    onChange={(e) => onChange({ ...memberData, account_number: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={memberData.ifsc_code}
                    onChange={(e) => onChange({ ...memberData, ifsc_code: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                  <input
                    type="text"
                    value={memberData.branch_name}
                    onChange={(e) => onChange({ ...memberData, branch_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                  <input
                    type="text"
                    value={memberData.upiid}
                    onChange={(e) => onChange({ ...memberData, upiid: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            
            <div className="bg-gray-50 py-4 rounded-lg">
              <h4 className="flex items-center text-gray-700 font-medium mb-4 pb-2 border-b border-gray-200">
                Change Password
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-primary focus:border-primary focus:outline-none"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-primary focus:border-primary focus:outline-none"
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {passwordFeedback && (
                <div className={`mt-3 text-sm ${passwordFeedback.success ? 'text-green-700' : 'text-red-700'}`}>
                  {passwordFeedback.message}
                </div>
              )}

              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleLocalPasswordUpdate}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  disabled={loading || passwordLoading}
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="ml-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  disabled={loading || passwordLoading}
                >
                  Generate
                </button>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="ml-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  disabled={loading || passwordLoading}
                >
                  Copy
                </button>
              </div>
            </div>
            </div>
        
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="flex items-center text-gray-700 font-medium mb-4 pb-2 border-b border-gray-200">
                Address Details
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street/House No</label>
                  <input
                    type="text"
                    value={memberData.street_or_house_no}
                    onChange={(e) => onChange({ ...memberData, street_or_house_no: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                  <input
                    type="text"
                    value={memberData.landmark}
                    onChange={(e) => onChange({ ...memberData, landmark: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                  <input
                    type="text"
                    value={memberData.address_one}
                    onChange={(e) => onChange({ ...memberData, address_one: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                  <input
                    type="text"
                    value={memberData.address_two || ''}
                    onChange={(e) => onChange({ ...memberData, address_two: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={memberData.city}
                    onChange={(e) => onChange({ ...memberData, city: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={memberData.state}
                    onChange={(e) => onChange({ ...memberData, state: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={memberData.pin}
                    onChange={(e) => onChange({ ...memberData, pin: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(memberData)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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