'use client' // 클라이언트 컴포넌트로 지정

import { useState } from 'react';

interface ConstellationCardProps {
  name: string;
  koreanName: string;
  stars: string[];
  description: string;
}

export default function ConstellationCard({ name, koreanName, stars, description }: ConstellationCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div
        className="bg-white/80 rounded-2xl shadow p-4 hover:shadow-lg transition cursor-pointer text-gray-800 h-full flex flex-col justify-between"
        onClick={() => setShowModal(true)}
      >
        <div>
          <h2 className="text-xl font-bold mb-2 text-indigo-700">{koreanName} ({name})</h2>
          <p className="text-sm mb-1"><strong>대표 별:</strong> {stars.join(', ')}</p>
        </div>
        <p className="text-gray-700 text-sm mt-2">{description}</p>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl max-w-md w-full text-black relative shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-4 text-2xl font-bold text-gray-600 hover:text-gray-800">&times;</button>
            <h3 className="text-2xl font-bold mb-4 text-indigo-700">{koreanName} ({name})</h3>
            <p className="mb-3"><strong>주요 별:</strong> {stars.join(', ')}</p>
            <p className="text-gray-800">{description}</p>
          </div>
        </div>
      )}
    </div>
  );
} 