import React from 'react';

interface PieChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  size?: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, size = 150 }) => {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  if (total === 0) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-full bg-gray-700 flex items-center justify-center text-gray-500 text-sm"
      >
        No data
      </div>
    );
  }

  const gradientParts: string[] = [];
  let cumulativePercentage = 0;

  data.forEach((d) => {
    const percentage = (d.value / total) * 100;
    if (percentage > 0) {
      gradientParts.push(
        `${d.color} ${cumulativePercentage}% ${cumulativePercentage + percentage}%`
      );
    }
    cumulativePercentage += percentage;
  });

  const conicGradient = `conic-gradient(${gradientParts.join(', ')})`;

  return (
    <div
      style={{
        width: size,
        height: size,
        background: conicGradient,
      }}
      className="rounded-full"
      role="img"
      aria-label="Pie chart showing daily time breakdown"
    />
  );
};

export default PieChart;
