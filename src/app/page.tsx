'use client'

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// 동적 임포트로 Three.js 컴포넌트 로드
const ThreeScene = dynamic(() => import('../components/ThreeScene'), {
  ssr: false,
  loading: () => <div className="h-[400px] flex items-center justify-center">로딩 중...</div>
});

// 위성 정보 인터페이스
// interface Satellite {
//   satname: string;
//   satalt: number;
//   satlat: number;
//   satlng: number;
//   elevation?: number;
//   distance?: number; // 거리 정보 추가
// }

// 위치 정보 인터페이스
interface Position {
  lat: number;
  lng: number;
}

// ISS 위치 정보 인터페이스
interface IssLocation {
  lat: number;
  lng: number;
}

// 두 지점 간의 거리 계산 함수 (km 단위)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 지구 반경 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  // const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [issLocation, setIssLocation] = useState<IssLocation | null>(null);
  const [issError, setIssError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);

  // 컴포넌트 마운트 상태 관리
  useEffect(() => {
    setMounted(true);
  }, []);

  // 방문자 수 증가 및 가져오기
  useEffect(() => {
    const updateVisitorCount = async () => {
      try {
        // 방문자 수 증가
        const postResponse = await fetch('/api/visitor', { method: 'POST' });
        const postData = await postResponse.json();
        console.log('POST response:', postData);

        // 최신 방문자 수 가져오기
        const getResponse = await fetch('/api/visitor');
        const count = await getResponse.json();
        console.log('GET response:', count);

        // 숫자 값을 직접 설정
        setVisitorCount(Number(count));
      } catch (error) {
        console.error('방문자 수 업데이트 실패:', error);
      }
    };

    updateVisitorCount();
  }, []);

  // 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLoading(false);
        },
        (err) => {
          console.error('위치 정보를 가져올 수 없습니다.', err);
          setLoading(false);
        }
      );
    } else {
      console.error('위치 정보가 지원되지 않습니다.');
      setLoading(false);
    }
  }, []);

  // ISS 위치 정보 가져오기
  useEffect(() => {
    let isMounted = true;
    
    async function fetchISS() {
      try {
        const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        if (!res.ok) {
          throw new Error('ISS 위치 정보를 가져올 수 없습니다.');
        }
        const data = await res.json();
        if (isMounted) {
          setIssLocation({ lat: data.latitude, lng: data.longitude });
        }
      } catch (error) {
        console.error("ISS Fetch Error:", error);
        if (isMounted) {
          setIssError('ISS 위치 정보를 가져오는 데 실패했습니다.');
        }
      }
    }

    fetchISS();
    const intervalId = setInterval(fetchISS, 10000); // 10초마다 업데이트

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // API를 통해 위성 데이터 가져오기
  // const fetchSatellites = async (lat: number, lng: number) => {
  //   try {
  //     const response = await fetch(`/api/satellites?lat=${lat}&lng=${lng}`);
      
  //     if (!response.ok) {
  //       throw new Error('API 요청 실패');
  //     }
      
  //     const data = await response.json();
      
  //     if (data.error) {
  //       throw new Error(data.error);
  //     }
      
  //     if (data.above && Array.isArray(data.above)) {
  //       // 각 위성에 대한 거리 계산
  //       const satellitesWithDistance = data.above.map((sat: any) => ({
  //         ...sat,
  //         distance: calculateDistance(lat, lng, sat.satlat, sat.satlng)
  //       }));
        
  //       // 거리 기준으로 정렬하고 상위 5개만 선택
  //       const closestSatellites = satellitesWithDistance
  //         .sort((a: Satellite, b: Satellite) => (a.distance ?? 0) - (b.distance ?? 0))
  //         .slice(0, 5);
        
  //       console.log('가장 가까운 5개 위성:', closestSatellites);
  //       setSatellites(closestSatellites);
  //       setLoading(false); // 위성 데이터 로드 완료
  //     } else {
  //       throw new Error('잘못된 데이터 형식');
  //     }
  //   } catch (err) {
  //     console.error('위성 데이터 오류:', err);
  //     setLoading(false);
  //   }
  // };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#1a1a2e] to-[#0a0a20] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#00ff9d] drop-shadow-[0_0_10px_rgba(0,255,157,0.5)] text-center mb-2">
            ISS 실시간 위치 추적
          </h1>
          <p className="text-cyan-300">
            👥 전체 방문자 수: {visitorCount}
          </p>
        </div>

        {loading ? (
          <div className="text-center text-[#00ff9d] text-xl">
            위치 정보를 불러오는 중...
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {issLocation && (
                <p className="text-center text-cyan-300 text-xl">
                  🛰️ ISS 현재 위치: 위도 {issLocation.lat.toFixed(2)}° / 경도 {issLocation.lng.toFixed(2)}°
                </p>
              )}
              {position && (
                <p className="text-center text-[#00ff9d] text-xl">
                  👤 내 현재 위치: 위도 {position.lat.toFixed(2)}° / 경도 {position.lng.toFixed(2)}°
                </p>
              )}
              {issError && (
                <p className="text-center text-red-500">{issError}</p>
              )}
            </div>

            {/* Three.js 컴포넌트에 ISS 위치 전달 */}
            <div className="rounded-xl overflow-hidden shadow-2xl mb-8">
              {/* 위치 표시 설명 추가 */}
              <div className="bg-black/50 p-4 text-center space-y-2">
                <p className="text-[#00ff9d]">🟢 초록색 점: 내 현재 위치</p>
                <p className="text-red-400">🔴 빨간색 점: ISS 🛰️ 위치</p>
              </div>
              <ThreeScene position={position} issLocation={issLocation} />
            </div>

            {/* 버튼 섹션 */}
            <div className="flex justify-center items-center gap-6 mt-8">
              <button
                onClick={() => setShowModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-[#00ff9d] to-[#00cc7e] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#00ff9d]/20 transition-all duration-300 transform hover:-translate-y-1 text-lg min-w-[240px]"
              >
                🛰️ 누가 내 머리 위에 위성쐈어
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-cyan-300 to-blue-400 text-black rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-300/20 transition-all duration-300 transform hover:-translate-y-1 text-lg min-w-[240px]"
              >
                ⭐ 내 위의 별자리
              </button>
            </div>
          </>
        )}
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a2e] border border-[#00ff9d] rounded-xl p-8 max-w-md w-full">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#00ff9d] mb-4">준비중입니다!</h3>
              <p className="text-white mb-6">조금만 기다려주세요 감사합니다 :)</p>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-[#00ff9d] text-black rounded-full font-semibold hover:bg-opacity-80 transition-all"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}