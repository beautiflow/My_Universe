import { NextResponse } from 'next/server';

// 별자리 정보 인터페이스 (예시)
interface Constellation {
  id: string;
  name: string;
  visible: boolean;
  image: string; // 별자리 이미지 URL
}

// 가상의 별자리 데이터베이스 (위도/시간에 따라 가시성 달라짐)
const allConstellations: Constellation[] = [
  { id: 'ori', name: '오리온자리', visible: true, image: '/constellations/orion.png' },
  { id: 'uma', name: '큰곰자리', visible: true, image: '/constellations/ursa-major.png' },
  { id: 'leo', name: '사자자리', visible: true, image: '/constellations/leo.png' },
  { id: 'sco', name: '전갈자리', visible: true, image: '/constellations/scorpius.png' },
  { id: 'cas', name: '카시오페이아자리', visible: true, image: '/constellations/cassiopeia.png' },
  { id: 'cru', name: '남십자자리', visible: false, image: '/constellations/crux.png' }, // 남반구 별자리
  { id: 'cyg', name: '백조자리', visible: true, image: '/constellations/cygnus.png' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');
  // 실제 API에서는 시간 정보도 중요할 수 있습니다.
  // const time = new Date();

  if (!latStr || !lngStr) {
    return NextResponse.json(
      { error: '위도와 경도가 필요합니다.' },
      { status: 400 }
    );
  }

  const lat = parseFloat(latStr);
  // const lng = parseFloat(lngStr);

  try {
    // === 실제 천문 API 호출 부분 ===
    // 이 부분에서 외부 API (예: AstronomyAPI)를 호출하여
    // 주어진 위도, 경도, 시간에 보이는 별자리 목록을 가져옵니다.
    // const astronomyApiKey = process.env.ASTRONOMY_API_KEY;
    // const response = await fetch(`https://api.astronomyapi.com/v2/...`, { headers: ... });
    // const data = await response.json();
    // const visibleConstellations = processApiResponse(data);
    // === API 호출 부분 끝 ===

    // === 임시 로직: 위도에 따라 보이는 별자리 필터링 (매우 단순화됨) ===
    const visibleConstellations = allConstellations.filter(constellation => {
      // 간단한 예시: 남십자자리는 남위도에서만 보이도록 설정
      if (constellation.id === 'cru') {
        return lat < 0;
      }
      // 다른 북반구 별자리는 일단 보이도록 설정 (실제로는 더 복잡함)
      return lat >= -30; // 대략적인 북반구 기준
    });
    // === 임시 로직 끝 ===

    return NextResponse.json({ visibleConstellations });

  } catch (error) {
    console.error('별자리 API 오류:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '별자리 데이터를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 