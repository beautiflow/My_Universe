'use client'

import { useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';

interface Satellite {
  satname: string;
  satalt: number;
  satlat: number;
  satlng: number;
  elevation?: number;
  distance?: number;
}

interface Position {
  lat: number;
  lng: number;
}

interface IssLocation {
  lat: number;
  lng: number;
}

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);

  // useLoader로 텍스처 로드
  const earthTexture = useLoader(THREE.TextureLoader, '/earth.png');

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhongMaterial
        map={earthTexture}
        shininess={5}
      />
    </mesh>
  );
}

function Marker({ lat, lng, color, size = 0.02 }: { lat: number; lng: number; color: string; size?: number }) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(Math.sin(phi) * Math.cos(theta));
  const z = Math.sin(phi) * Math.sin(theta);
  const y = Math.cos(phi);

  return (
    <mesh position={[x * 1.01, y * 1.01, z * 1.01]}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

interface ThreeSceneProps {
  position: Position | null;
  issLocation: IssLocation | null;
}

export default function ThreeScene({ position, issLocation }: ThreeSceneProps) {
  return (
    <div className="h-[400px] w-full">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Earth />
          {position && (
            <Marker lat={position.lat} lng={position.lng} color="#00ff9d" />
          )}
          {issLocation && (
            <Marker lat={issLocation.lat} lng={issLocation.lng} color="#ff4d4d" size={0.03} />
          )}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}