"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows, Environment, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

function PetCompanion() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/Mishri.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      const actionNames = Object.keys(actions);
      if (actionNames.length > 0) {
        // Fox.glb has 'Survey', 'Walk', 'Run'. We'll use Survey.
        const idleAction = actions['Survey'] || actions['Idle'] || actions[actionNames[0]];
        if (idleAction) {
          idleAction.reset().fadeIn(0.5).play();
        }
      }
    }
  }, [actions]);

  useFrame((state) => {
    if (!group.current) return;
    
    // Smoothly rotate to track mouse pointer
    const targetX = (state.mouse.x * Math.PI) / 4;
    const targetY = -(state.mouse.y * Math.PI) / 8;
    
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetY, 0.05);
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={group} position={[0, -2.5, 0]} scale={0.04}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

// Preload the model for fast performance
useGLTF.preload('/Mishri.glb');

export default function Pet3D() {
  return (
    <div className="w-full h-[600px] md:h-[800px] relative z-10 cursor-pointer">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <directionalLight position={[-10, -10, -5]} color="#6a9574" intensity={1} />
        
        <PetCompanion />
        
        <Environment preset="city" />
        <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />
      </Canvas>
    </div>
  );
}
