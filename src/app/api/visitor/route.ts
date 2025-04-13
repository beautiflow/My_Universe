const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5171'; // C# API 주소

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/visitor`);
    if (!response.ok) {
      throw new Error('방문자 수를 가져오는데 실패했습니다.');
    }
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('방문자 수 조회 오류:', error);
    return Response.json({ error: '방문자 수를 가져오는데 실패했습니다.' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const response = await fetch(`${API_BASE_URL}/visitor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error('방문자 수 업데이트에 실패했습니다.');
    }
    
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('방문자 수 업데이트 오류:', error);
    return Response.json({ error: '방문자 수 업데이트에 실패했습니다.' }, { status: 500 });
  }
} 