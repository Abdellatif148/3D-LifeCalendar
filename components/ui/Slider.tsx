import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    valueLabel: string;
    color: string;
}

const Slider: React.FC<SliderProps> = ({ label, valueLabel, color, style, title, ...props }) => {
    const customStyle = {
        ...style,
        '--thumb-color': color,
    } as React.CSSProperties;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-300">{label}</label>
                <span className="text-sm font-semibold text-white px-3 py-1 rounded-full shadow-sm" style={{ backgroundColor: color }}>{valueLabel}</span>
            </div>
            <input
                type="range"
                className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer slider focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
                style={customStyle}
                title={title}
                aria-label={label}
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
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    transition: all 0.2s ease;
                }
                
                .slider::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                }

                .slider::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    background: var(--thumb-color);
                    border-radius: 50%;
                    cursor: pointer;
                    border: 3px solid white;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
                
                .slider:focus {
                    outline: none;
                }
                
                .slider:focus::-webkit-slider-thumb {
                    ring: 2px;
                    ring-color: var(--thumb-color);
                    ring-opacity: 0.5;
                }
            `}</style>
        </div>
    );
};

export default Slider;