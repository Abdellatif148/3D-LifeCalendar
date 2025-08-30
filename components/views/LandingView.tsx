import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Button from '../ui/Button';

const FloatingOrbPreview: React.FC = () => {
    const orbRef = useRef<THREE.Mesh>(null!);
    const particlesRef = useRef<THREE.Points>(null!);

    useFrame((state) => {
        if (orbRef.current) {
            orbRef.current.rotation.y += 0.005;
            orbRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
        if (particlesRef.current) {
            particlesRef.current.rotation.y += 0.002;
        }
    });

    // Create particle system for orb surface
    const particleGeometry = React.useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(1000 * 3);
        const colors = new Float32Array(1000 * 3);
        
        for (let i = 0; i < 1000; i++) {
            const phi = Math.acos(-1 + (2 * i) / 1000);
            const theta = Math.sqrt(1000 * Math.PI) * phi;
            
            const x = 3 * Math.cos(theta) * Math.sin(phi);
            const y = 3 * Math.sin(theta) * Math.sin(phi);
            const z = 3 * Math.cos(phi);
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            
            // Color gradient from cyan to purple
            const t = (i / 1000);
            colors[i * 3] = 0.13 + t * 0.41; // R: cyan to purple
            colors[i * 3 + 1] = 0.83 - t * 0.32; // G: cyan to purple
            colors[i * 3 + 2] = 0.93 + t * 0.03; // B: cyan to purple
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geometry;
    }, []);

    return (
        <group>
            <mesh ref={orbRef}>
                <sphereGeometry args={[2.8, 32, 32]} />
                <meshStandardMaterial 
                    color="#22D3EE" 
                    transparent 
                    opacity={0.3}
                    roughness={0.1}
                    metalness={0.8}
                />
            </mesh>
            <points ref={particlesRef} geometry={particleGeometry}>
                <pointsMaterial size={0.05} vertexColors transparent opacity={0.8} />
            </points>
        </group>
    );
};

interface LandingViewProps {
    onStart: () => void;
    onDemo?: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onStart, onDemo }) => {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-600 to-gray-900 animate-gradient-shift"></div>
            
            {/* Starfield background */}
            <div className="absolute inset-0 bg-starfield opacity-30"></div>
            
            {/* Hero Section */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-screen px-4">
                <div className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight animate-fade-in-down">
                        See your life in time.
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                            Change it in minutes.
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mb-8 animate-fade-in-up">
                        An interactive calendar that shows how your habits steal or gift you years.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up-delayed">
                        <Button onClick={onStart} className="text-lg px-8 py-4 glow-effect">
                            Start Free
                        </Button>
                        <Button 
                            variant="secondary" 
                            onClick={onDemo}
                            className="text-lg px-8 py-4 border-2 border-white/30 bg-transparent hover:bg-white/10"
                        >
                            See Demo
                        </Button>
                    </div>
                </div>
                
                {/* 3D Orb Preview */}
                <div className="lg:w-1/2 h-96 lg:h-[600px] animate-fade-in-right">
                    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                        <ambientLight intensity={0.6} />
                        <pointLight position={[10, 10, 10]} intensity={1} color="#22D3EE" />
                        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
                        <FloatingOrbPreview />
                        <OrbitControls 
                            enableZoom={false} 
                            enablePan={false}
                            autoRotate
                            autoRotateSpeed={0.5}
                        />
                    </Canvas>
                </div>
            </div>

            {/* Feature Section */}
            <div className="relative z-10 py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-white mb-16">
                        Transform Your Relationship with Time
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all duration-300 group-hover:transform group-hover:scale-105">
                                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-2xl">🧊</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Your Life in Blocks</h3>
                                <p className="text-gray-300">
                                    See your entire life as a 3D orb of glowing weeks. Each particle represents one week of your existence.
                                </p>
                            </div>
                        </div>
                        
                        <div className="text-center group">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-300 group-hover:transform group-hover:scale-105">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-2xl">⚡</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Simulate Habits</h3>
                                <p className="text-gray-300">
                                    Adjust your daily routine and watch your life orb transform. See how "-1h TikTok +1h Reading" reshapes your future.
                                </p>
                            </div>
                        </div>
                        
                        <div className="text-center group">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-green-400/50 transition-all duration-300 group-hover:transform group-hover:scale-105">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Tiny Nudges</h3>
                                <p className="text-gray-300">
                                    Export calendar reminders to your phone. Small daily nudges that compound into years of gained time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fade-in-right {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                
                .animate-gradient-shift {
                    background-size: 400% 400%;
                    animation: gradient-shift 8s ease infinite;
                }
                
                .animate-fade-in-down {
                    animation: fade-in-down 1s ease-out forwards;
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 1s ease-out 0.3s both;
                }
                
                .animate-fade-in-up-delayed {
                    animation: fade-in-up 1s ease-out 0.6s both;
                }
                
                .animate-fade-in-right {
                    animation: fade-in-right 1s ease-out 0.4s both;
                }
                
                .glow-effect {
                    box-shadow: 0 0 20px rgba(34, 211, 238, 0.4);
                }
                
                .glow-effect:hover {
                    box-shadow: 0 0 30px rgba(34, 211, 238, 0.6);
                }
                
                .bg-starfield {
                    background-image: 
                        radial-gradient(2px 2px at 20px 30px, #fff, transparent),
                        radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(1px 1px at 90px 40px, #fff, transparent),
                        radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
                        radial-gradient(2px 2px at 160px 30px, #fff, transparent);
                    background-repeat: repeat;
                    background-size: 200px 100px;
                }
            `}</style>
        </div>
    );
};

export default LandingView;