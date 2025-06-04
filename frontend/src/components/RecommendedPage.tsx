import React from 'react';
import { useLocation } from 'react-router-dom';
import KakaoMap from '../components/KakaoMap';

const RecommendedPage: React.FC = () => {
    const location = useLocation();
    const walkWarningMessage = location.state?.walkWarningMessage || '정보 없음';

    return (
        <div>
            <h2>추천 산책 장소</h2>
            <KakaoMap walkWarningMessage={walkWarningMessage} />
        </div>
    );
};

export default RecommendedPage;
