
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
    } as React.CSSProperties;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-300">{label}</label>
                <span className="text-sm font-semibold text-white px-2 py-0.5 rounded" style={{ backgroundColor: color }}>{valueLabel}</span>
            </div>
            <input
                type="range"
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={customStyle}
                {...props}
            />
            {/* FIX: Removed the 'jsx' prop from the <style> tag. 
                This syntax is specific to libraries like styled-jsx
                and is not supported in a standard React setup, causing a type error. */}
            <style>{`
                .slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    background: var(--thumb-color);
                    border-radius: 50%;
                    cursor: pointer;
                    border: 2px solid white;
                }

                .slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    background: var(--thumb-color);
                    border-radius: 50%;
                    cursor: pointer;
                    border: 2px solid white;
                }
            `}</style>
        </div>
    );
};

export default Slider;
