import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IoClose } from 'react-icons/io5';
import { FaLock } from 'react-icons/fa';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            toast.error("New passwords don't match!");
            return;
        }
        
        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/auth/change-password', {
                currentPassword,
                newPassword
            });

            if (response.data.success) {
                toast.success('Password changed successfully!');
                // Reset form
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                onClose();
            } else {
                toast.error(response.data.message || 'Failed to change password');
            }
        } catch (error: any) {
            console.error('Error changing password:', error);
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md overflow-hidden animate-fadeIn">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <FaLock className="text-primary" /> Change Password
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
                    >
                        <IoClose size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                            type="password"
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Enter current password"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Enter new password"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Confirm new password"
                        />
                    </div>
                    
                    <div className="mt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 bg-primary text-white rounded-lg transition-colors shadow-sm ${
                                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primaryhover'
                            }`}
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
