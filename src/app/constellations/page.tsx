'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { constellations } from '../../data/constellations'; // 데이터 임포트 경로 수정
import ConstellationCard from '../../components/ConstellationCard'; // 컴포넌트 임포트 경로 수정

interface IssLocation {
  lat: number;
  lon: number;
}

export default function ConstellationsPage() {
  const [issLocation, setIssLocation] = useState<IssLocation | null>(null);
  const currentMonth = new Date().getMonth() + 1;
  const monthStr = currentMonth.toString().padStart(2, '0');

  // 현재 월에 보이는 별자리 필터링
  const visibleNow = constellations.filter(c => c.visible_months.includes(monthStr));

  useEffect(() => {
    async function fetchISS() {
      try {
        const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        if (!res.ok) {
          throw new Error('ISS 위치 정보를 가져올 수 없습니다.');
        }
        const data = await res.json();
        setIssLocation({ lat: data.latitude, lon: data.longitude });
      } catch (error) {
        console.error("ISS Fetch Error:", error);
        // 에러 상태를 관리하여 사용자에게 알릴 수도 있습니다.
      }
    }
    fetchISS();
    // ISS 위치는 주기적으로 업데이트할 수 있습니다.
    // const intervalId = setInterval(fetchISS, 5000); // 5초마다 업데이트
    // return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 제거
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-yellow-300">🪐 지금 보이는 별자리 ({currentMonth}월)</h1>
        <Link href="/">
          <button className="bg-white/20 text-white px-4 py-2 rounded-full text-sm hover:bg-white/30 transition-all">
            위성 보기로 돌아가기
          </button>
        </Link>
      </div>
      {issLocation && (
        <p className="text-center mb-6 text-cyan-300">국제우주정거장 현재 위치 🛰️ 위도: {issLocation.lat.toFixed(2)}° / 경도: {issLocation.lon.toFixed(2)}°</p>
      )}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleNow.length > 0 ? (
          visibleNow.map((c, index) => (
            <ConstellationCard
              key={index} // 고유 ID가 있다면 그것을 사용하는 것이 좋습니다.
              name={c.name}
              koreanName={c.korean_name}
              stars={c.main_stars}
              description={c.description}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400">
            이번 달에 주로 보이는 별자리 정보가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}