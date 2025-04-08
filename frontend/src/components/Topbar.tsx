// src/components/TopBar.tsx
import { Link } from 'react-router-dom';
import React from 'react';

const TopBar: React.FC = () => {
    return (
        <div className="w-full h-[80px] px-[36px] bg-gradient-to-r from-[#32AAFF] to-[#FFE66B] flex items-center gap-[50px]">
            <div className="w-[113.7px] h-[30px]" />
            <div className="w-[1040px] h-[19px] relative" />

            {/* 페이지 이동 링크 */}
            <Link to="/finedust" className="text-[16px] font-[Roboto] text-black hover:underline">
                미세먼지
            </Link>
            <Link to="/placerec" className="text-[16px] font-[Roboto] text-black hover:underline">
                장소 추천
            </Link>
            <Link to="/manageguide" className="text-[16px] font-[Roboto] text-black hover:underline">
                관리 가이드
            </Link>
        </div>
    );
};

export default TopBar;