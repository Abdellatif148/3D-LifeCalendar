import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { MAX_YEARS, WEEKS_IN_YEAR, CATEGORY_MAP } from '../../constants';
import type { CategoryName } from '../../types';

interface OrbParticleSystemProps {
    currentAge: number;
    targetAge: number;
    dominantColorActivity: CategoryName;
}

const OrbParticleSystem: React.FC<OrbParticleSystemProps> = ({ currentAge, targetAge, dominantColorActivity }) => {
    const particlesRef = useRef<THREE.Points>(null!);
    const orbRef = useRef<THREE.Mesh>(null!);
    const [hoveredWeek, setHoveredWeek] = React.useState<{ year: number; week: number; position: THREE.Vector3 } | null>(null);

    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y += 0.003;
            particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
        }
        if (orbRef.current) {
            orbRef.current.rotation.y += 0.001;
        }
    });

    const { particleGeometry, particleMaterial } = useMemo(() => {
        const totalWeeks = MAX_YEARS * WEEKS_IN_YEAR;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(totalWeeks * 3);
        const colors = new Float32Array(totalWeeks * 3);
        const sizes = new Float32Array(totalWeeks);
        
        const pastColor = new THREE.Color('#4B5563');
        const futureColor = new THREE.Color(CATEGORY_MAP[dominantColorActivity].color);
        const targetColor = new THREE.Color('#10B981');
        const currentColor = new THREE.Color('#FBBF24');
        
        for (let year = 0; year < MAX_YEARS; year++) {
            for (let week = 0; week < WEEKS_IN_YEAR; week++) {
                const index = year * WEEKS_IN_YEAR + week;
                
                // Distribute particles on sphere surface using Fibonacci spiral
                const phi = Math.acos(1 - 2 * (index + 0.5) / totalWeeks);
                const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5);
                
                const radius = 4;
                const x = radius * Math.cos(theta) * Math.sin(phi);
                const y = radius * Math.sin(theta) * Math.sin(phi);
                const z = radius * Math.cos(phi);
                
                positions[index * 3] = x;
                positions[index * 3 + 1] = y;
                positions[index * 3 + 2] = z;
                
                // Color logic
                let color = futureColor;
                let size = 0.08;
                
                if (year < currentAge) {
                    color = pastColor;
                    size = 0.04;
                } else if (year === currentAge) {
                    color = currentColor;
                    size = 0.12;
                } else if (year === targetAge) {
                    color = targetColor;
                    size = 0.1;
                }
                
                colors[index * 3] = color.r;
                colors[index * 3 + 1] = color.g;
                colors[index * 3 + 2] = color.b;
                sizes[index] = size;
            }
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.08,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: true,
        });
        
        return { particleGeometry: geometry, particleMaterial: material };
    }, [currentAge, targetAge, dominantColorActivity]);

    return (
        <group>
            {/* Outer glow sphere */}
            <mesh ref={orbRef}>
                <sphereGeometry args={[4.2, 32, 32]} />
                <meshStandardMaterial 
                    color={CATEGORY_MAP[dominantColorActivity].color}
                    transparent 
                    opacity={0.1}
                    roughness={0.1}
                    metalness={0.8}
                />
            </mesh>
            
            {/* Particle system */}
            <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} />
            
            {/* Age labels */}
            <Text
                position={[0, -5.5, 0]}
                fontSize={0.8}
                color="#FBBF24"
                anchorX="center"
                anchorY="middle"
            >
                Now: {currentAge} years
            </Text>
            
            <Text
                position={[0, 5.5, 0]}
                fontSize={0.8}
                color="#10B981"
                anchorX="center"
                anchorY="middle"
            >
                Target: {targetAge} years
            </Text>
            
            {/* Tooltip for hovered week */}
            {hoveredWeek && (
                <Html position={hoveredWeek.position.toArray()}>
                    <div className="bg-black/80 text-white p-2 rounded text-xs whitespace-nowrap pointer-events-none">
                        Year {hoveredWeek.year}, Week {hoveredWeek.week}
                    </div>
                </Html>
            )}
        </group>
    );
};

interface LifeOrb3DProps {
    currentAge: number;
    targetAge: number;
    dominantColorActivity: CategoryName;
    enableZoom?: boolean;
    density?: number;
}

const LifeOrb3D: React.FC<LifeOrb3DProps> = ({ enableZoom = true, density = 1, ...props }) => {
    return (
        <Canvas
            camera={{ position: [0, 0, 12], fov: 50 }}
            style={{ background: 'transparent' }}
        >
            <ambientLight intensity={0.4 * density} />
            <pointLight position={[10, 10, 10]} intensity={1.5 * density} color="#22D3EE" />
            <pointLight position={[-10, -10, -10]} intensity={0.8 * density} color="#8B5CF6" />
            <pointLight position={[0, 15, 0]} intensity={0.6 * density} color="#FFFFFF" />
            
            <Text
                position={[0, 0, -6]}
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="middle"
                opacity={0.5}
            >
                Each dot = 1 week
            </Text>

            <OrbParticleSystem {...props} />
            
            <OrbitControls
                enableZoom={enableZoom}
                enablePan={true}
                minDistance={6}
                maxDistance={20}
                zoomSpeed={0.8}
                rotateSpeed={0.5}
            />
        </Canvas>
    );
};

export default LifeOrb3D;