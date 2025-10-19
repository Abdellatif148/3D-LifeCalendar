import React, { useEffect } from 'react';
import type { AppNotification } from '../../types';

interface NotificationToastProps {
    notification: AppNotification;
    onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto-dismiss after 5 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="bg-gray-700/80 backdrop-blur-md border border-purple-500/50 rounded-lg shadow-2xl p-4 animate-fade-in-right">
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                     <svg className="h-6 w-6 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </div>
                <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-semibold text-white">{notification.title}</p>
                    <p className="mt-1 text-sm text-gray-300">{notification.message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button onClick={onClose} className="inline-flex text-gray-400 hover:text-white">
                        <span className="sr-only">Close</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
             <style>{`
                @keyframes fade-in-right {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in-right { animation: fade-in-right 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default NotificationToast;
