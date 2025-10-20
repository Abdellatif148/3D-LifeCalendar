import React, { useRef, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { CATEGORY_MAP } from '../../constants';
import type { CategoryName, Delta } from '../../types';

interface YearBlockProps {
    position: [number, number, number];
    color: string;
    isPast: boolean;
    isImpacted: boolean;
    onPointerOver: (event: any) => void;
    onPointerOut: (event: any) => void;
    onClick: () => void;
}

const YearBlock: React.FC<YearBlockProps> = React.memo(({ position, color, isPast, isImpacted, onPointerOver, onPointerOut, onClick }) => {
    const ref = useRef<THREE.Mesh>(null!);
    return (
        <mesh position={position} ref={ref} onPointerOver={onPointerOver} onPointerOut={onPointerOut} onClick={onClick}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial 
                color={color} 
                transparent 
                opacity={isPast ? 0.25 : 0.8} 
                roughness={0.5}
                metalness={0.2}
                emissive={isImpacted ? color : '#000000'}
                emissiveIntensity={isImpacted ? 0.5 : 0}
            />
        </mesh>
    );
});

YearBlock.displayName = 'YearBlock';

interface LifeGridProps {
    currentAge: number;
    targetAge: number;
    dominantColorActivity: CategoryName;
    onYearClick: (year: number) => void;
    deltas: Delta[];
}

const LifeGrid: React.FC<LifeGridProps> = ({ currentAge, targetAge, dominantColorActivity, onYearClick, deltas }) => {
    const groupRef = useRef<THREE.Group>(null!);
    const [hovered, setHovered] = useState<{ year: number; position: [number, number, number]; color: string; isPast: boolean; title?: string } | null>(null);

    const { years, gridDimensions } = useMemo(() => {
        const grid = [];
        const pastColor = "#4B5563"; // Dim gray
        const currentColor = "#34D399"; // Green
        const futureColor = CATEGORY_MAP[dominantColorActivity].color;
        
        const totalDeltaMinutes = deltas.reduce((sum, delta) => sum + delta.deltaMinutes, 0);

        const cols = Math.ceil(Math.sqrt(targetAge));
        const rows = Math.ceil(targetAge / cols);
        const spacing = 1.2;

        for (let year = 0; year < targetAge; year++) {
            const isCurrent = year === currentAge -1;
            const isPast = year < currentAge;
            
            const color = isCurrent ? currentColor : (isPast ? pastColor : futureColor);
            const isImpacted = !isPast && Math.abs(totalDeltaMinutes) > 0;

            const row = Math.floor(year / cols);
            const col = year % cols;
            
            grid.push({
                key: `year-${year}`,
                position: [
                    (col - (cols - 1) / 2) * spacing,
                    ((rows - 1) / 2 - row) * spacing, 
                    0
                ] as [number, number, number],
                color: color,
                isPast,
                isImpacted,
                year,
            });
        }
        return { years: grid, gridDimensions: { cols, rows, spacing }};
    }, [currentAge, dominantColorActivity, targetAge, deltas]);

    const nowLabelPosition = useMemo(() => {
        if (currentAge >= targetAge || currentAge < 1) return null;
        const { cols, rows, spacing } = gridDimensions;
        const row = Math.floor((currentAge - 1) / cols);
        const x = -(cols / 2) * spacing - 1;
        const y = ((rows - 1) / 2 - row) * spacing;
        return [x, y, 0] as [number, number, number];
    }, [currentAge, targetAge, gridDimensions]);

    return (
        <group ref={groupRef}>
            {years.map(y => 
                <YearBlock 
                    key={y.key} 
                    position={y.position}
                    color={y.color}
                    isPast={y.isPast}
                    isImpacted={y.isImpacted}
                    onPointerOver={(e) => {
                        e.stopPropagation();
                        let title = '';
                        try {
                            // This should be handled by the TimeData context
                            title = `Year ${y.year + 1}`;
                        } catch (error) {
                            console.error("Failed to parse year data for tooltip", error)
                        }
                        setHovered({ year: y.year, position: y.position, color: y.color, isPast: y.isPast, title });
                    }}
                    onPointerOut={() => {
                        setHovered(null);
                    }}
                    onClick={() => onYearClick(y.year)}
                />
            )}
             {hovered && (
                <group position={[hovered.position[0], hovered.position[1], 1.5]}>
                    <mesh>
                         <planeGeometry args={[7, hovered.title ? 2.5 : 1.5]} />
                        <meshBasicMaterial color="#111827" transparent opacity={0.85} />
                    </mesh>
                    <Text
                        position={[0, hovered.title ? 0.5 : 0, 0.1]}
                        fontSize={0.6}
                        color={hovered.year === currentAge - 1 ? '#34D399' : (hovered.isPast ? '#A0A0A0' : hovered.color)}
                        anchorX="center"
                        anchorY="middle"
                        maxWidth={6.5}
                        textAlign="center"
                    >
                        {hovered.title || `Year ${hovered.year + 1}`}
                    </Text>
                     {hovered.title && (
                         <Text
                            position={[0, -0.5, 0.1]}
                            fontSize={0.4}
                            color="#9CA3AF"
                            anchorX="center"
                            anchorY="middle"
                        >
                            {`Year ${hovered.year + 1}`}
                        </Text>
                     )}
                </group>
            )}

            {nowLabelPosition && (
                 <Text
                    position={nowLabelPosition}
                    rotation={[0,0,0]}
                    fontSize={1}
                    color="#34D399"
                    anchorX="right"
                    anchorY="middle"
                >
                    {`Now: ${currentAge}`}
                </Text>
            )}
        </group>
    );
};

const LifeGrid3D: React.FC<LifeGridProps> = (props) => {
    return (
        <Canvas 
            camera={{ position: [0, 0, 25], fov: 50 }}
            style={{ background: 'transparent' }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
        >
            <ambientLight intensity={0.8} />
            <pointLight position={[0, 10, 20]} intensity={1.5} />
            <pointLight position={[0, -10, -20]} intensity={0.5} color="#8B5CF6" />
            <LifeGrid {...props} />
            <OrbitControls 
                enableZoom={true} 
                enablePan={true}
                minDistance={10}
                maxDistance={60}
                zoomSpeed={0.8}
                enableDamping={true}
                dampingFactor={0.05}
            />
        </Canvas>
    );
};

export default LifeGrid3D;