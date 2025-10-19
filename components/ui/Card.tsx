import React from 'react';

// FIX: Extend React.HTMLAttributes<HTMLDivElement> to allow passing standard div props like onClick.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

// FIX: Destructure and spread `...props` to the underlying div.
const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg p-6 ${className}`} {...props}>
            {children}
        </div>
    );
};

export default Card;
