import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    valueLabel: string;
    color: string;
}

const Slider: React.FC<SliderProps> = ({ label, valueLabel, color, style, ...props }) => {
    const customStyle = {
        ...style,
        '--thumb-color': color,
        '--track-color': color,
    } as React.CSSProperties;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-200">{label}</label>
                <span 
                    className="text-sm font-bold text-black px-3 py-1 rounded-full shadow-lg" 
                    style={{ 
                        backgroundColor: color,
                        boxShadow: `0 0 15px ${color}40`
                    }}
                >
                    {valueLabel}
                </span>
            </div>
            <input
                type="range"
                className="w-full h-3 bg-gray-700/50 rounded-lg appearance-none cursor-pointer slider backdrop-blur-sm"
                style={customStyle}
                {...props}
            />
            <style>{`
                .slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: var(--thumb-color);
                    border-radius: 50%;
                    cursor: pointer;
                    border: 3px solid white;
                    box-shadow: 0 0 15px var(--thumb-color), 0 0 30px var(--thumb-color)40;
                    transition: all 0.2s ease;
                }

                .slider::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 0 20px var(--thumb-color), 0 0 40px var(--thumb-color)60;
                }

                .slider::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    background: var(--thumb-color);
                    border-radius: 50%;
                    cursor: pointer;
                    border: 3px solid white;
                    box-shadow: 0 0 15px var(--thumb-color);
                }

                .slider::-webkit-slider-track {
                    background: linear-gradient(to right, var(--track-color) 0%, var(--track-color) var(--progress, 50%), rgba(75, 85, 99, 0.5) var(--progress, 50%), rgba(75, 85, 99, 0.5) 100%);
                    border-radius: 6px;
                }
            `}</style>
        </div>
    );
};

export default Slider;