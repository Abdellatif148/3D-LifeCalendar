import React from 'react';

interface PieChartProps {
    data: {
        name: string;
        value: number;
        color: string;
    }[];
    size?: number;
    className?: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, size = 150, className = '' }) => {
    const total = data.reduce((acc, d) => acc + d.value, 0);
    if (total === 0) {
        return (
            <div 
                style={{width: size, height: size}} 
                className={`rounded-full bg-gray-700 flex items-center justify-center text-gray-500 text-sm ${className}`}
                role="img"
                aria-label="No data available"
            >
                No data
            </div>
        );
    }
    
    const gradientParts: string[] = [];
    let cumulativePercentage = 0;

    data.forEach(d => {
        const percentage = (d.value / total) * 100;
        if (percentage > 0) {
            gradientParts.push(`${d.color} ${cumulativePercentage}% ${cumulativePercentage + percentage}%`);
        }
        cumulativePercentage += percentage;
    });

    const conicGradient = `conic-gradient(${gradientParts.join(', ')})`;
    
    // Create accessible description
    const description = data
        .filter(d => d.value > 0)
        .map(d => `${d.name}: ${((d.value / total) * 100).toFixed(1)}%`)
        .join(', ');
    
    return (
        <div 
            style={{
                width: size,
                height: size,
                background: conicGradient,
            }}
            className={`rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 ${className}`}
            role="img"
            aria-label={`Pie chart showing daily time breakdown: ${description}`}
            title={description}
        >
            <span className="sr-only">{description}</span>
        </div>
    );
};

export default PieChart;
