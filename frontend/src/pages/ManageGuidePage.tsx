// src/pages/ManageGuidePage.tsx
import React from 'react';
import Header from '../components/Header';

const ManageGuidePage: React.FC = () => {
    return (
        <div className="relative w-screen bg-[#B9CAF5]">
            <Header />
            <div className="relative w-full bg-white pt-6 pb-20">
                <div className="max-w-[1280px] mx-auto px-4">
                    <h1 className="text-2xl font-bold text-[#1F2937]">📘 관리 가이드 페이지</h1>
                    <p className="text-base text-[#4B5563] mt-1">미세먼지로부터 반려견을 지키는 방법을 안내해드려요.</p>
                </div>
            </div>
        </div>
    );
};

export default ManageGuidePage;