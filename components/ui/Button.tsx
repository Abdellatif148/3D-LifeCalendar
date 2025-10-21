import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
    children, 
    variant = 'primary', 
    size = 'md',
    loading = false,
    icon,
    fullWidth = false,
    className = '', 
    disabled,
    ...props 
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation select-none';
    
    const sizeClasses = {
        sm: 'px-3 py-2 text-sm min-h-[36px] gap-2',
        md: 'px-4 py-2.5 text-sm min-h-[42px] gap-2',
        lg: 'px-6 py-3 text-base min-h-[48px] gap-3',
        xl: 'px-8 py-4 text-lg min-h-[56px] gap-3',
    };
    
    const variantClasses = {
        primary: 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] focus:ring-primary-500',
        secondary: 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:ring-gray-500',
        ghost: 'bg-transparent hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-gray-800 dark:active:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-gray-500',
        outline: 'bg-transparent hover:bg-primary-50 active:bg-primary-100 dark:hover:bg-primary-900/20 dark:active:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 hover:border-primary-300 dark:hover:border-primary-700 focus:ring-primary-500',
    };

    const widthClass = fullWidth ? 'w-full' : '';
    const isDisabled = disabled || loading;

    return (
        <button 
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`} 
            disabled={isDisabled}
            {...props}
        >
            {loading && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {!loading && icon && icon}
            <span className={loading ? 'opacity-0' : ''}>{children}</span>
        </button>
    );
};

export default Button;