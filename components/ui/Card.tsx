import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'elevated' | 'outlined';
    padding?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ 
    children, 
    className = '', 
    variant = 'default',
    padding = 'md',
    ...props 
}) => {
    const baseClasses = 'rounded-xl transition-all duration-200';
    
    const variantClasses = {
        default: 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-lg',
        elevated: 'bg-gray-800/80 backdrop-blur-md border border-gray-700/30 shadow-2xl hover:shadow-3xl transform hover:scale-[1.01]',
        outlined: 'bg-transparent border-2 border-gray-700 hover:border-gray-600',
    };
    
    const paddingClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div 
            className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`} 
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
