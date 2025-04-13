'use client'

import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

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

// ISS 위치 정보 인터페이스 추가
interface IssLocation {
  lat: number;
  lng: number;
}

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  
  // 이미지 파일이 없는 경우 기본 색상 사용
  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhongMaterial
        color="#4287f5"
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
//   satellites: Satellite[];
  issLocation: IssLocation | null; // issLocation prop 추가
}

export default function ThreeScene({ position, issLocation }: ThreeSceneProps) {
  return (
    <div className="h-[400px] w-full">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Earth />
        {/* 사용자 위치 마커 */}
        {position && (
          <Marker
            lat={position.lat}
            lng={position.lng}
            color="#00ff9d" // 녹색
          />
        )}
        {/* 위성 마커 */}
        {/* {satellites && satellites.length > 0 && satellites.map((sat, index) => (
          <Marker
            key={`sat-${index}`}
            lat={sat.satlat}
            lng={sat.satlng}
            color="#ffd700" // 노란색
          />
        ))} */}
        {/* ISS 마커 */}
        {issLocation && (
          <Marker
            lat={issLocation.lat}
            lng={issLocation.lng}
            color="#ff4d4d" // 빨간색
            size={0.03} // 약간 더 크게
          />
        )}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
} 