import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';
import Button from '../ui/Button';

const SettingsView: React.FC = () => {
    const { user } = useAuth();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDeleteAccount = async () => {
        if (!user) return;

        // CRITICAL: This should be a call to a Supabase Edge Function
        // that securely deletes user data and then the user.
        console.log("Deleting account for user:", user.id);
        await supabase.from('profiles').delete().eq('id', user.id);
        // After deleting data, you would typically sign the user out.
        // The full user deletion from auth.users should be handled in an Edge Function.
        await supabase.auth.signOut();
    };

    return (
        <div className="p-8 text-white">
            <h1 className="text-4xl font-bold mb-8">Settings</h1>
            <div className="bg-white/5 p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-4">Account Management</h2>
                <p className="text-white/70 mb-4">
                    Here you can manage your account settings.
                </p>
                <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg mb-4">
                    <p className="font-bold">Warning:</p>
                    <p>This is a demo application. The 'Delete Account' button will only delete your profile data, not your authentication user. A Supabase Edge Function is required for full user deletion.</p>
                </div>
                <Button onClick={() => setShowDeleteConfirm(true)} variant="danger">
                    Delete Account
                </Button>
            </div>

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="p-8 bg-gray-800 rounded-lg shadow-2xl max-w-sm text-center">
                        <h3 className="text-xl font-bold text-white mb-4">Are you sure?</h3>
                        <p className="text-gray-400 mb-6">This action is irreversible. All your data will be permanently deleted.</p>
                        <div className="flex justify-center space-x-4">
                            <Button onClick={() => setShowDeleteConfirm(false)} variant="secondary">
                                Cancel
                            </Button>
                            <Button onClick={handleDeleteAccount} variant="danger">
                                Yes, Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsView;
