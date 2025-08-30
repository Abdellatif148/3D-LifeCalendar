import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl p-6 hover:border-white/20 transition-all duration-300 ${className}`}>
            {children}
        </div>
    );
};

export default Card;