import React from 'react';

const CubeGridPreview: React.FC = () => {
    return (
        <div className="w-full h-48 bg-black/20 rounded-lg flex items-center justify-center p-4">
            <div className="grid grid-cols-8 gap-1">
                {Array.from({ length: 64 }).map((_, i) => (
                    <div
                        key={i}
                        className="w-4 h-4 rounded-sm"
                        style={{
                            backgroundColor: `rgba(34, 211, 238, ${Math.random() * 0.5 + 0.1})`,
                            opacity: Math.random() * 0.8 + 0.2
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default CubeGridPreview;
