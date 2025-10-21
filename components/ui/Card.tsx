import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'elevated' | 'outlined' | 'glass';
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    hover?: boolean;
}

const Card: React.FC<CardProps> = ({ 
    children, 
    className = '', 
    variant = 'default',
    padding = 'md',
    hover = false,
    ...props 
}) => {
    const baseClasses = 'rounded-2xl transition-all duration-300';
    
    const variantClasses = {
        default: 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm',
        elevated: 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-soft-lg',
        outlined: 'bg-transparent border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
        glass: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-soft',
    };
    
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
    };

    const hoverClasses = hover ? 'hover:scale-[1.02] hover:shadow-soft-lg cursor-pointer' : '';

    return (
        <div 
            className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`} 
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;