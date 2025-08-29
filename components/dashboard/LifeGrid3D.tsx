
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { MAX_YEARS, WEEKS_IN_YEAR, CATEGORY_MAP } from '../../constants';
import type { CategoryName } from '../../types';

interface WeekBlockProps {
    position: [number, number, number];
    color: string;
    isPast: boolean;
}

const WeekBlock: React.FC<WeekBlockProps> = React.memo(({ position, color, isPast }) => {
    const ref = useRef<THREE.Mesh>(null!);
    return (
        <mesh position={position} ref={ref}>
            <boxGeometry args={[0.9, 0.9, 0.2]} />
            <meshStandardMaterial 
                color={color} 
                transparent 
                opacity={isPast ? 0.15 : 0.9} 
                roughness={0.6}
                metalness={0.1}
            />
        </mesh>
    );
});

interface LifeGridProps {
    currentAge: number;
    targetAge: number;
    dominantColorActivity: CategoryName;
}

const LifeGrid: React.FC<LifeGridProps> = ({ currentAge, targetAge, dominantColorActivity }) => {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        if(groupRef.current) {
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.2, 0.05);
        }
    });

    const weeks = useMemo(() => {
        const grid = [];
        const pastColor = "#4B5563"; // Dim gray
        const futureColor = CATEGORY_MAP[dominantColorActivity].color;
        const targetColor = "#10B981"; // Bright green for target year

        for (let year = 0; year < MAX_YEARS; year++) {
            for (let week = 0; week < WEEKS_IN_YEAR; week++) {
                const weekIndex = year * WEEKS_IN_YEAR + week;
                const isPast = year < currentAge;
                const isTargetYear = year === targetAge;

                let color = isPast ? pastColor : futureColor;
                if (isTargetYear) {
                    color = targetColor;
                }
                
                grid.push({
                    key: `week-${year}-${week}`,
                    position: [
                        (week - WEEKS_IN_YEAR / 2) * 1.05,
                        (year - MAX_YEARS / 2) * 1.05,
                        0
                    ] as [number, number, number],
                    color: color,
                    isPast,
                });
            }
        }
        return grid;
    }, [currentAge, dominantColorActivity, targetAge]);

    return (
        <group ref={groupRef} rotation={[0.2, 0, 0]}>
            {weeks.map(week => <WeekBlock key={week.key} {...week} />)}
            <Text
                position={[-WEEKS_IN_YEAR / 2 * 1.05 - 5, (targetAge - MAX_YEARS / 2) * 1.05, 0]}
                rotation={[0,0,0]}
                fontSize={2}
                color="#10B981"
                anchorX="right"
                anchorY="middle"
            >
                {`Target: ${targetAge}`}
            </Text>
             <Text
                position={[-WEEKS_IN_YEAR / 2 * 1.05 - 5, (currentAge - MAX_YEARS / 2) * 1.05, 0]}
                rotation={[0,0,0]}
                fontSize={2}
                color="#FBBF24"
                anchorX="right"
                anchorY="middle"
            >
                {`Now: ${currentAge}`}
            </Text>
        </group>
    );
};

const LifeGrid3D: React.FC<LifeGridProps> = (props) => {
    return (
        <Canvas 
            camera={{ position: [0, 0, 80], fov: 50 }}
            style={{ background: 'transparent' }}
        >
            <ambientLight intensity={0.8} />
            <pointLight position={[0, 20, 50]} intensity={1.5} />
            <pointLight position={[0, -20, -50]} intensity={0.5} color="#8B5CF6" />
            <LifeGrid {...props} />
            <OrbitControls 
                enableZoom={true} 
                enablePan={true}
                minDistance={20}
                maxDistance={150}
                zoomSpeed={0.8}
            />
        </Canvas>
    );
};

export default LifeGrid3D;
