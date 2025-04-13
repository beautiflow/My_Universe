import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const apiKey = process.env.NEXT_PUBLIC_N2YO_API_KEY;

  if (!lat || !lng) {
    return NextResponse.json(
      { error: '위도와 경도가 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    const url = `https://api.n2yo.com/rest/v1/satellite/above/${lat}/${lng}/0/70/18/${apiKey}`;
    console.log('Requesting URL:', url);

    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '위성 API 오류');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API 오류:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '위성 데이터를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 