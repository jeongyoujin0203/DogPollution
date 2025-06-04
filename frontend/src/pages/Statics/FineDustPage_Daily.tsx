import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_KEY = import.meta.env.VITE_AIR_QUALITY_API_KEY;

interface AirQualityData {
    MSRSTE_NM: string;
    PM10: string;
    PM25?: string;
    [key: string]: any;
}

const FineDustPage_Daily = () => {
    const [selectedDate, setSelectedDate] = useState("20250101");
    const [data, setData] = useState<AirQualityData[]>([]);
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

    const fetchData = async (date: string) => {
        try {
            const url = `http://openAPI.seoul.go.kr:8088/${API_KEY}/json/DailyAverageAirQuality/1/100/${date}`;
            const res = await axios.get(url);
            const items = res.data?.DailyAverageAirQuality?.row || [];
            setData(items);
        } catch (error) {
            console.error("Error fetching daily air quality data", error);
        }
    };

    useEffect(() => {
        fetchData(selectedDate);
    }, [selectedDate]);

    const uniqueRegions = Array.from(new Set(data.map((item) => item.MSRSTE_NM)));

    const toggleRegion = (region: string) => {
        setSelectedRegions((prev) =>
            prev.includes(region)
                ? prev.filter((r) => r !== region)
                : [...prev, region]
        );
    };

    const showAllRegions = () => setSelectedRegions([]);

    const filteredData =
        selectedRegions.length === 0
            ? data
            : data.filter((item) => selectedRegions.includes(item.MSRSTE_NM));

    const getPM10Grade = (value: number): string => {
        if (value <= 30) return '좋음';
        if (value <= 80) return '보통';
        if (value <= 150) return '나쁨';
        return '매우나쁨';
    };

    const chartData = {
        labels: filteredData.map((item) => item.MSRSTE_NM),
        datasets: [
            {
                label: "PM10",
                data: filteredData.map((item) => parseInt(item.PM10 || "0")),
                backgroundColor: "rgba(75, 192, 192, 0.6)"
            },
            {
                label: "PM2.5",
                data: filteredData.map((item) => parseInt(item.PM25 || "0")),
                backgroundColor: "rgba(255, 99, 132, 0.6)"
            }
        ]
    };

    const chartOptions: ChartOptions<"bar"> = {
        responsive: true,
        plugins: {
            legend: {
                position: "top"
            },
            title: {
                display: false
            }
        }
    };

    // 가장 좋고 나쁜 대기질 계산
    const minPM10 = Math.min(...filteredData.map((item) => parseInt(item.PM10 || "0")));
    const maxPM10 = Math.max(...filteredData.map((item) => parseInt(item.PM10 || "0")));

    const minGrade = getPM10Grade(minPM10);
    const maxGrade = getPM10Grade(maxPM10);

    // 가장 좋은 장소와 가장 나쁜 장소 찾기
    const minPM10Row = filteredData.find((row) => parseInt(row.PM10 || "0") === minPM10);
    const maxPM10Row = filteredData.find((row) => parseInt(row.PM10 || "0") === maxPM10);

    return (
        <div className="p-4">
            {/* 제목 + 날짜 선택 + 대기질 박스 정렬 */}
            <div className="flex justify-between mb-6 items-start">
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold">서울시 일별 평균 대기오염도</h2>
                    <input
                        type="date"
                        value={`${selectedDate.slice(0, 4)}-${selectedDate.slice(4, 6)}-${selectedDate.slice(6, 8)}`}
                        onChange={(e) => {
                            const value = e.target.value.replace(/-/g, "");
                            setSelectedDate(value);
                        }}
                        className="border p-2 rounded w-48"
                    />
                </div>

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

            {/* 자치구 선택 버튼 */}
            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    onClick={showAllRegions}
                    className={`px-3 py-1 border rounded ${selectedRegions.length === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                    전체 보기
                </button>
                {uniqueRegions.map((region) => (
                    <button
                        key={region}
                        onClick={() => toggleRegion(region)}
                        className={`px-3 py-1 border rounded ${selectedRegions.includes(region) ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                    >
                        {region}
                    </button>
                ))}
            </div>

            {/* 표와 차트를 좌우로 배치 */}
            <div className="flex gap-8 mb-6">
                <div className="w-2/5">
                    {filteredData.length > 0 && (
                        <div className="max-h-[300px] overflow-y-auto">
                            <table className="w-full border border-gray-300 text-sm">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-3 py-2 text-left">측정소</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left">PM10</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left">PM2.5</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left">등급</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredData.map((row, idx) => {
                                    const pm10 = parseInt(row.PM10 || "0");
                                    const grade = getPM10Grade(pm10);
                                    let gradeClass = '';

                                    switch (grade) {
                                        case '좋음': gradeClass = 'text-green-600'; break;
                                        case '보통': gradeClass = 'text-yellow-600'; break;
                                        case '나쁨': gradeClass = 'text-orange-600'; break;
                                        case '매우나쁨': gradeClass = 'text-red-600'; break;
                                    }

                                    return (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-3 py-2">{row.MSRSTE_NM}</td>
                                            <td className="border border-gray-300 px-3 py-2">{row.PM10}</td>
                                            <td className="border border-gray-300 px-3 py-2">{row.PM25 || '-'}</td>
                                            <td className={`border border-gray-300 px-3 py-2 font-semibold ${gradeClass}`}>
                                                {grade}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

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

export default FineDustPage_Daily;
