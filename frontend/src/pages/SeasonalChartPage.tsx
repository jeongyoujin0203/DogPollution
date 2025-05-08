// src/pages/SeasonalChartPage.tsx
import React, { useState } from 'react';
import { YearSelector } from '../components/YearSelector';
import { SeasonPieChart } from '../components/SeasonPieChart';

const seoulDistricts = [
    '강남구', '강동구', '강북구', '강서구',
    '관악구', '광진구', '구로구', '금천구',
    '노원구', '도봉구', '동대문구', '동작구',
    '마포구', '서대문구', '서초구', '성동구',
    '성북구', '송파구', '양천구', '영등포구',
    '용산구', '은평구', '종로구', '중구', '중랑구',
];

const SeasonalChartPage: React.FC = () => {
    const [year, setYear] = useState(2023);
    const [selectedGu, setSelectedGu] = useState('강남구');

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-center">서울시 계절별 미세먼지 등급 시각화</h1>
            <div className="flex justify-center gap-4">
                <YearSelector year={year} setYear={setYear} />
                <select value={selectedGu} onChange={e => setSelectedGu(e.target.value)}>
                    {seoulDistricts.map(gu => (
                        <option key={gu} value={gu}>{gu}</option>
                    ))}
                </select>
            </div>
            <SeasonPieChart year={year} district={selectedGu} />
        </div>
    );
};

export default SeasonalChartPage;
