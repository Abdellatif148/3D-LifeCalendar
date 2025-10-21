import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    color?: 'primary' | 'secondary' | 'white';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    size = 'md', 
    color = 'primary',
    className = '' 
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };
    
    const colorClasses = {
        primary: 'border-gray-300 border-t-purple-500',
        secondary: 'border-gray-600 border-t-gray-400',
        white: 'border-gray-200 border-t-white',
    };

    return (
        <div 
            className={`animate-spin rounded-full border-2 ${colorClasses[color]} ${sizeClasses[size]} ${className}`}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default LoadingSpinner;