import React from 'react';

const CubeGridPreview: React.FC = () => {
    return (
        <div className="w-full h-48 bg-black/20 rounded-lg flex items-center justify-center p-4 overflow-hidden">
            <div className="grid grid-cols-8 gap-1 max-w-full">
                {Array.from({ length: 64 }).map((_, i) => {
                    const opacity = Math.random() * 0.8 + 0.2;
                    const delay = Math.random() * 2;
                    const colors = ['#22D3EE', '#8B5CF6', '#10B981', '#F59E0B', '#F472B6'];
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    
                    return (
                        <div
                            key={i}
                            className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm animate-pulse"
                            style={{
                                backgroundColor: color,
                                opacity: opacity,
                                animationDelay: `${delay}s`,
                                animationDuration: '3s'
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default CubeGridPreview;