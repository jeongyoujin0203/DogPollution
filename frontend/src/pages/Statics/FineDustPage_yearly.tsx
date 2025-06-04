import React, { useState, useEffect } from 'react';
import { fetchAirQuality } from '../../assets/airQuality';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AirQualityRow {
    MSRSTE_NM: string;  // 측정소 이름
    PM10: string;       // PM10 수치
    PM25?: string;      // PM2.5 수치 (옵션)
    [key: string]: any; // 기타 속성이 있을 경우 대비
}

const availableYears = ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];

const getPM10Grade = (value: number): string => {
    if (value <= 30) return '좋음';
    if (value <= 80) return '보통';
    if (value <= 150) return '나쁨';
    return '매우나쁨';
};

const FineDustPage_yearly = () => {
    const [year, setYear] = useState('2019');
    const [data, setData] = useState<AirQualityRow[]>([]);
    const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchAirQuality(year);
            setData(result);
            setSelectedDistricts([]);
        };
        fetchData();
    }, [year]);

    const filteredData =
        selectedDistricts.length === 0
            ? data
            : data.filter((row) => selectedDistricts.includes(row.MSRSTE_NM));

    const allDistricts = Array.from(new Set(data.map((row) => row.MSRSTE_NM)));

    const toggleDistrict = (district: string) => {
        setSelectedDistricts((prev) =>
            prev.includes(district)
                ? prev.filter((d) => d !== district)
                : [...prev, district]
        );
    };

    const clearSelection = () => setSelectedDistricts([]);

    const minPM10 = Math.min(...filteredData.map((row) => Number(row.PM10)));
    const maxPM10 = Math.max(...filteredData.map((row) => Number(row.PM10)));
    const minGrade = getPM10Grade(minPM10);
    const maxGrade = getPM10Grade(maxPM10);
    const minPM10Row = filteredData.find((row) => Number(row.PM10) === minPM10);
    const maxPM10Row = filteredData.find((row) => Number(row.PM10) === maxPM10);

    const chartData = {
        labels: filteredData.map((row) => row.MSRSTE_NM),
        datasets: [
            {
                label: 'PM10',
                data: filteredData.map((row) => Number(row.PM10)),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'PM2.5',
                data: filteredData.map((row) => Number(row.PM25 || 0)),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <div className="p-4">
            {/* 제목과 연도 선택 + 최고/최악 박스 정렬 */}
            <div className="flex justify-between mb-6 items-start">
                {/* 제목과 연도 선택 */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold">서울시 연도별 평균 대기오염도</h2>

                    <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="border p-2 rounded w-32"
                    >
                        {availableYears.map((y) => (
                            <option key={y} value={y}>
                                {y}년
                            </option>
                        ))}
                    </select>
                </div>

                {/* 최고/최악 대기질 박스 */}
                <div className="flex gap-4">
                    <div className="p-4 border rounded-lg bg-green-100 text-green-700 shadow-md w-64">
                        <strong className="block text-lg font-semibold">최고 대기질</strong>
                        <p className="text-xl">{minGrade}</p>
                        <p>{minPM10} µg/m³</p>
                        <p className="mt-2 text-sm">장소: {minPM10Row?.MSRSTE_NM}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-red-100 text-red-700 shadow-md w-64">
                        <strong className="block text-lg font-semibold">최악 대기질</strong>
                        <p className="text-xl">{maxGrade}</p>
                        <p>{maxPM10} µg/m³</p>
                        <p className="mt-2 text-sm">장소: {maxPM10Row?.MSRSTE_NM}</p>
                    </div>
                </div>
            </div>

            {/* 자치구 선택 */}
            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    onClick={clearSelection}
                    className={`px-3 py-1 border rounded ${
                        selectedDistricts.length === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}
                >
                    전체 보기
                </button>
                {allDistricts.map((district) => (
                    <button
                        key={district}
                        onClick={() => toggleDistrict(district)}
                        className={`px-3 py-1 border rounded ${
                            selectedDistricts.includes(district) ? 'bg-blue-500 text-white' : 'bg-gray-100'
                        }`}
                    >
                        {district}
                    </button>
                ))}
            </div>

            {/* 표 + 차트 양옆 배치 */}
            <div className="flex gap-8 mb-6">
                {/* 테이블 */}
                <div className="w-2/5">
                    {filteredData.length > 0 && (
                        <div className="max-h-[300px] overflow-y-auto">
                            <table className="w-full border border-gray-300 text-sm">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-3 py-2 text-left">측정소</th>
                                    <th className="border px-3 py-2 text-left">PM10</th>
                                    <th className="border px-3 py-2 text-left">PM2.5</th>
                                    <th className="border px-3 py-2 text-left">등급</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredData.map((row, idx) => {
                                    const pm10 = Number(row.PM10);
                                    const grade = getPM10Grade(pm10);
                                    let gradeClass = '';

                                    switch (grade) {
                                        case '좋음':
                                            gradeClass = 'text-green-600';
                                            break;
                                        case '보통':
                                            gradeClass = 'text-yellow-600';
                                            break;
                                        case '나쁨':
                                            gradeClass = 'text-orange-600';
                                            break;
                                        case '매우나쁨':
                                            gradeClass = 'text-red-600';
                                            break;
                                    }

                                    return (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="border px-3 py-2">{row.MSRSTE_NM}</td>
                                            <td className="border px-3 py-2">{row.PM10}</td>
                                            <td className="border px-3 py-2">{row.PM25 || '-'}</td>
                                            <td className={`border px-3 py-2 font-semibold ${gradeClass}`}>{grade}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* 차트 */}
                <div className="w-3/5">
                    {filteredData.length > 0 ? (
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { position: 'top' },
                                    title: { display: false },
                                },
                            }}
                        />
                    ) : (
                        <p className="text-gray-500 mt-4">데이터가 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FineDustPage_yearly;
