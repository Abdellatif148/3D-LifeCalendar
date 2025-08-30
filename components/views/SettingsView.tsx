import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLifeData } from '../../hooks/useLifeData.tsx';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface SettingsViewProps {
    onBackToDashboard: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onBackToDashboard }) => {
    const { user, deleteAccount } = useAuth();
    const { lifeData, setLifeData } = useLifeData();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            await deleteAccount();
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error('Delete account error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetData = () => {
        const initialData = {
            currentAge: 25,
            targetAge: 80,
            activities: [
                { name: 'Sleep' as const, minutesPerDay: 8 * 60 },
                { name: 'Work/Study' as const, minutesPerDay: 8 * 60 },
                { name: 'Social' as const, minutesPerDay: 2 * 60 },
                { name: 'Hobbies' as const, minutesPerDay: 2 * 60 },
                { name: 'Exercise' as const, minutesPerDay: 1 * 60 },
                { name: 'Unallocated' as const, minutesPerDay: 3 * 60 },
            ],
        };
        setLifeData(initialData);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-black p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
                        Settings
                    </h1>
                    <p className="text-gray-400">Manage your account and preferences</p>
                    </div>
                    <Button onClick={onBackToDashboard} variant="secondary">
                        ← Back to Dashboard
                    </Button>
                </div>

                <div className="space-y-6">
                    {/* Account Information */}
                    <Card>
                        <h2 className="text-2xl font-bold mb-4 text-white">Account Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">{user?.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">User ID</label>
                                <p className="text-gray-400 text-sm font-mono bg-gray-700/50 px-4 py-2 rounded-lg">{user?.id}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Life Data Management */}
                    <Card>
                        <h2 className="text-2xl font-bold mb-4 text-white">Life Data</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Current Age</label>
                                    <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">{lifeData.currentAge} years</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Target Age</label>
                                    <p className="text-white bg-gray-700/50 px-4 py-2 rounded-lg">{lifeData.targetAge} years</p>
                                </div>
                            </div>
                            <Button onClick={handleResetData} variant="secondary" className="w-full">
                                Reset to Default Values
                            </Button>
                        </div>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="border-red-500/50">
                        <h2 className="text-2xl font-bold mb-4 text-red-400">Danger Zone</h2>
                        <p className="text-gray-300 mb-4">
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <Button onClick={() => setShowDeleteConfirm(true)} variant="danger">
                            Delete Account
                        </Button>
                    </Card>
                </div>
            </div>
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <Card className="max-w-md text-center border-red-500/50">
                        <h3 className="text-xl font-bold text-white mb-4">Are you sure?</h3>
                        <p className="text-gray-400 mb-6">
                            This will permanently delete your account and all your life data. This action cannot be undone.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Button 
                                onClick={() => setShowDeleteConfirm(false)} 
                                variant="secondary"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleDeleteAccount} 
                                variant="danger"
                                disabled={loading}
                            >
                                {loading ? 'Deleting...' : 'Yes, Delete Forever'}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default SettingsView;
