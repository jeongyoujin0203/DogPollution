// src/pages/FineDustStats.tsx
import React from 'react';
import Header from '../components/Header';

const FineDustStats: React.FC = () => {
    return (
        <div className="relative w-screen bg-[#B9CAF5]">
            <Header />
            <div className="relative w-full bg-white pt-6 pb-20">
                <div className="max-w-[1280px] mx-auto px-4">
                    <h1 className="text-2xl font-bold text-[#1F2937]">미세먼지 통계</h1>
                    <p className="text-base text-[#4B5563] mt-1">미세먼지 통계 정보를 확인하세요.</p>
                </div>
            </div>
        </div>
    );
};

export default FineDustStats;