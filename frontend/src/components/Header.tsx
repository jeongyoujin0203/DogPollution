import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header: React.FC = () => {
    const getLinkClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? 'text-[#3176FF]' : 'text-[#4B5563] font-medium';

    return (
        <div className="w-full h-20 bg-[#B9CAF5] flex items-center justify-between px-14 z-10 fixed top-0">
            <img src={logo} alt="Logo" className="h-10" />
            <div className="flex space-x-8 text-base">
                <NavLink to="/" className={getLinkClass}>
                    미세먼지
                </NavLink>
                <NavLink to="/placerec" className={getLinkClass}>
                    장소추천
                </NavLink>
                <NavLink to="/manageguide" className={getLinkClass}>
                    관리가이드
                </NavLink>
                <NavLink to="/stats" className={getLinkClass}>
                    통계
                </NavLink>
            </div>
            <div className="w-12 h-12 bg-[#3176FF] rounded-full"></div>
        </div>
    );
};

export default Header;