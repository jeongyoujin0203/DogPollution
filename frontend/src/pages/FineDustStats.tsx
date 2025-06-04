import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import Header from "../components/Header";

// Chart.js 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// 타입 정의
interface MonthlyData {
    region: string;
    monthly: (number | null)[];
}

interface YearlyData {
    region: string;
    yearly: (number | null)[];
}

interface MonthlyResponse {
    year: string;
    pollutant: string;
    data: MonthlyData[];
}

interface YearlyResponse {
    start_year: string;
    end_year: string;
    pollutant: string;
    years: string[];
    data: YearlyData[];
}

const FineDustStats: React.FC = () => {
    // 상태 관리
    const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [startYear, setStartYear] = useState<string>((new Date().getFullYear() - 5).toString());
    const [endYear, setEndYear] = useState<string>(new Date().getFullYear().toString());
    const [pollutant, setPollutant] = useState<'PM10' | 'PM25'>('PM10');
    const [monthlyData, setMonthlyData] = useState<MonthlyResponse | null>(null);
    const [yearlyData, setYearlyData] = useState<YearlyResponse | null>(null);
    const [selectedRegions, setSelectedRegions] = useState<string[]>(['서울']);
    const [availableRegions, setAvailableRegions] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 색상 배열 (지역별 다른 색상 부여)
    const colors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)',
        'rgba(83, 102, 255, 0.7)',
        'rgba(40, 159, 64, 0.7)',
        'rgba(210, 199, 199, 0.7)',
    ];

    // 월별 데이터 가져오기
    const fetchMonthlyData = async () => {
        try {
            setLoading(true);
            setError(null);

            // 백엔드 서버가 실행 중인지 확인하기 위한 임시 데이터 (테스트용)
            // 실제 환경에서는 이 코드를 제거하고 아래 주석 처리된 fetch 코드를 사용하세요
            setTimeout(() => {
                const mockData = {
                    year: selectedYear,
                    pollutant: pollutant,
                    data: [
                        { region: '서울', monthly: [45, 48, 52, 40, 35, 30, 28, 27, 32, 38, 42, 46] },
                        { region: '강남구', monthly: [43, 46, 50, 38, 33, 29, 26, 25, 30, 36, 40, 44] },
                        { region: '강북구', monthly: [47, 50, 54, 42, 37, 32, 30, 29, 34, 40, 44, 48] },
                        { region: '강서구', monthly: [46, 49, 53, 41, 36, 31, 29, 28, 33, 39, 43, 47] },
                        { region: '관악구', monthly: [44, 47, 51, 39, 34, 30, 27, 26, 31, 37, 41, 45] }
                    ]
                };

                setMonthlyData(mockData as MonthlyResponse);
                setAvailableRegions(mockData.data.map(item => item.region));
                if (selectedRegions.length === 0) {
                    setSelectedRegions([mockData.data[0].region]);
                }

                setLoading(false);
            }, 1000);

            /*
            // 실제 API 호출 코드 (백엔드 서버가 준비되면 사용)
            const response = await fetch(`/api/dust/seoul/history/monthly?year=${selectedYear}&pollutant=${pollutant}`);

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || '서버 응답 오류');
            }

            const data = await response.json();
            setMonthlyData(data);

            // 사용 가능한 지역 목록 설정
            if (data.data && data.data.length > 0) {
              const regions = data.data.map((item: MonthlyData) => item.region);
              setAvailableRegions(regions);
              // 기본 선택 지역이 없으면 첫 번째 지역 선택
              if (selectedRegions.length === 0) {
                setSelectedRegions([regions[0]]);
              }
            }

            setLoading(false);
            */

        } catch (err: any) {
            console.error("API 오류:", err);
            setError(`데이터를 불러오는 중 오류가 발생했습니다: ${err.message}`);
            setLoading(false);
        }
    };

    // 연도별 데이터 가져오기
    const fetchYearlyData = async () => {
        try {
            setLoading(true);
            setError(null);

            // 백엔드 서버가 실행 중인지 확인하기 위한 임시 데이터 (테스트용)
            // 실제 환경에서는 이 코드를 제거하고 아래 주석 처리된 fetch 코드를 사용하세요
            setTimeout(() => {
                const years = Array.from({ length: parseInt(endYear) - parseInt(startYear) + 1 },
                    (_, i) => (parseInt(startYear) + i).toString());

                const mockData = {
                    start_year: startYear,
                    end_year: endYear,
                    pollutant: pollutant,
                    years: years,
                    data: [
                        { region: '서울', yearly: years.map(() => Math.floor(Math.random() * 20) + 30) },
                        { region: '강남구', yearly: years.map(() => Math.floor(Math.random() * 20) + 28) },
                        { region: '강북구', yearly: years.map(() => Math.floor(Math.random() * 20) + 32) },
                        { region: '강서구', yearly: years.map(() => Math.floor(Math.random() * 20) + 31) },
                        { region: '관악구', yearly: years.map(() => Math.floor(Math.random() * 20) + 29) }
                    ]
                };

                setYearlyData(mockData as YearlyResponse);
                setAvailableRegions(mockData.data.map(item => item.region));
                if (selectedRegions.length === 0) {
                    setSelectedRegions([mockData.data[0].region]);
                }

                setLoading(false);
            }, 1000);

            /*
            // 실제 API 호출 코드 (백엔드 서버가 준비되면 사용)
            const response = await fetch(`/api/dust/seoul/history/yearly?start_year=${startYear}&end_year=${endYear}&pollutant=${pollutant}`);

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || '서버 응답 오류');
            }

            const data = await response.json();
            setYearlyData(data);

            // 사용 가능한 지역 목록 설정
            if (data.data && data.data.length > 0) {
              const regions = data.data.map((item: YearlyData) => item.region);
              setAvailableRegions(regions);
              // 기본 선택 지역이 없으면 첫 번째 지역 선택
              if (selectedRegions.length === 0) {
                setSelectedRegions([regions[0]]);
              }
            }

            setLoading(false);
            */

        } catch (err: any) {
            console.error("API 오류:", err);
            setError(`데이터를 불러오는 중 오류가 발생했습니다: ${err.message}`);
            setLoading(false);
        }
    };

    // 선택한 지역 변경 핸들러
    const handleRegionChange = (region: string) => {
        if (selectedRegions.includes(region)) {
            setSelectedRegions(selectedRegions.filter(r => r !== region));
        } else {
            setSelectedRegions([...selectedRegions, region]);
        }
    };

    // 모드 변경 시 데이터 새로 불러오기
    useEffect(() => {
        if (viewMode === 'monthly') {
            fetchMonthlyData();
        } else {
            fetchYearlyData();
        }
    }, [viewMode, selectedYear, startYear, endYear, pollutant]);

    // 월별 차트 데이터 생성
    const getMonthlyChartData = () => {
        if (!monthlyData || !monthlyData.data) return { labels: [], datasets: [] };

        const labels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

        const datasets = selectedRegions.map((region, index) => {
            const regionData = monthlyData.data.find(d => d.region === region);
            return {
                label: region,
                data: regionData ? regionData.monthly : [],
                borderColor: colors[index % colors.length],
                backgroundColor: colors[index % colors.length].replace('0.7', '0.2'),
                borderWidth: 2,
                fill: false,
                tension: 0.1
            };
        });

        return { labels, datasets };
    };

    // 연도별 차트 데이터 생성
    const getYearlyChartData = () => {
        if (!yearlyData || !yearlyData.data) return { labels: [], datasets: [] };

        const labels = yearlyData.years;

        const datasets = selectedRegions.map((region, index) => {
            const regionData = yearlyData.data.find(d => d.region === region);
            return {
                label: region,
                data: regionData ? regionData.yearly : [],
                borderColor: colors[index % colors.length],
                backgroundColor: colors[index % colors.length],
                borderWidth: 1
            };
        });

        return { labels, datasets };
    };

    // 차트 옵션 설정 (타입 오류 수정)
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        size: 14
                    }
                }
            },
            title: {
                display: true,
                text: `${viewMode === 'monthly' ? selectedYear + '년' : startYear + '~' + endYear + '년'} ${pollutant === 'PM10' ? '미세먼지' : '초미세먼지'} 수치`,
                font: {
                    size: 18,
                    weight: 'bold' as const
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y + ' μg/m³';
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '농도 (μg/m³)',
                    font: {
                        size: 14,
                        weight: 'bold' as const
                    }
                },
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: viewMode === 'monthly' ? '월' : '연도',
                    font: {
                        size: 14,
                        weight: 'bold' as const
                    }
                },
                grid: {
                    color: 'rgba(200, 200, 200, 0.2)'
                }
            }
        },
        animation: {
            duration: 1000
        }
    };

    return (
        <div className="relative w-screen bg-[#B9CAF5]">
            <Header />

            <div style={{
                backgroundColor: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#1a1a1a' : 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                marginTop: '90px'
            }}>
                {/* 헤더 */}
                <div style={{
                    background: 'linear-gradient(to right, #3b82f6, #2563eb)',
                    padding: '1.5rem',
                    color: 'white'
                }}>
                    <h1 style={{fontSize: '1.875rem', fontWeight: 'bold', margin: 0}}>서울시 미세먼지 통계</h1>
                    <p style={{color: 'rgba(255, 255, 255, 0.8)', marginTop: '0.5rem'}}>서울 지역별 미세먼지 농도 통계 데이터</p>
                </div>

                {/* 컨트롤 패널 */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: window.matchMedia('(prefers-color-scheme: dark)').matches ? '1px solid #2d2d2d' : '1px solid #e5e7eb'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        {/* 뷰 모드 선택 */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                marginBottom: '0.5rem'
                            }}>보기 모드</label>
                            <select
                                value={viewMode}
                                onChange={(e) => setViewMode(e.target.value as 'monthly' | 'yearly')}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    backgroundColor: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#2a2a2a' : 'white',
                                    color: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'white' : '#333',
                                    border: window.matchMedia('(prefers-color-scheme: dark)').matches ? '1px solid #444' : '1px solid #e5e7eb',
                                    borderRadius: '6px'
                                }}
                            >
                                <option value="monthly">월별 보기</option>
                                <option value="yearly">연도별 보기</option>
                            </select>
                        </div>

                        {/* 오염물질 선택 */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                marginBottom: '0.5rem'
                            }}>오염물질</label>
                            <select
                                value={pollutant}
                                onChange={(e) => setPollutant(e.target.value as 'PM10' | 'PM25')}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    backgroundColor: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#2a2a2a' : 'white',
                                    color: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'white' : '#333',
                                    border: window.matchMedia('(prefers-color-scheme: dark)').matches ? '1px solid #444' : '1px solid #e5e7eb',
                                    borderRadius: '6px'
                                }}
                            >
                                <option value="PM10">미세먼지 (PM10)</option>
                                <option value="PM25">초미세먼지 (PM2.5)</option>
                            </select>
                        </div>

                        {/* 기간 선택 */}
                        {viewMode === 'monthly' ? (
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    marginBottom: '0.5rem'
                                }}>연도</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        backgroundColor: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#2a2a2a' : 'white',
                                        color: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'white' : '#333',
                                        border: window.matchMedia('(prefers-color-scheme: dark)').matches ? '1px solid #444' : '1px solid #e5e7eb',
                                        borderRadius: '6px'
                                    }}
                                >
                                    {Array.from({length: 10}, (_, i) => new Date().getFullYear() - i).map(year => (
                                        <option key={year} value={year}>{year}년</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        marginBottom: '0.5rem'
                                    }}>시작 연도</label>
                                    <select
                                        value={startYear}
                                        onChange={(e) => {
                                            const newStartYear = e.target.value;
                                            if (parseInt(newStartYear) > parseInt(endYear)) {
                                                setEndYear(newStartYear);
                                            }
                                            setStartYear(newStartYear);
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            backgroundColor: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#2a2a2a' : 'white',
                                            color: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'white' : '#333',
                                            border: window.matchMedia('(prefers-color-scheme: dark)').matches ? '1px solid #444' : '1px solid #e5e7eb',
                                            borderRadius: '6px'
                                        }}
                                    >
                                        {Array.from({length: 10}, (_, i) => new Date().getFullYear() - i).map(year => (
                                            <option key={year} value={year}>{year}년</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        marginBottom: '0.5rem'
                                    }}>종료 연도</label>
                                    <select
                                        value={endYear}
                                        onChange={(e) => setEndYear(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            backgroundColor: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#2a2a2a' : 'white',
                                            color: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'white' : '#333',
                                            border: window.matchMedia('(prefers-color-scheme: dark)').matches ? '1px solid #444' : '1px solid #e5e7eb',
                                            borderRadius: '6px'
                                        }}
                                    >
                                        {Array.from({length: 10}, (_, i) => new Date().getFullYear() - i)
                                            .filter(year => year >= parseInt(startYear))
                                            .map(year => (
                                                <option key={year} value={year}>{year}년</option>
                                            ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </div>

                    {/* 지역 선택기 */}
                    <div style={{marginTop: '1rem'}}>
                        <label
                            style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem'}}>지역
                            선택</label>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                            {availableRegions.map(region => (
                                <button
                                    key={region}
                                    onClick={() => handleRegionChange(region)}
                                    style={{
                                        backgroundColor: selectedRegions.includes(region)
                                            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? '#646cff' : '#3b82f6')
                                            : (window.matchMedia('(prefers-color-scheme: dark)').matches ? '#2a2a2a' : '#f3f4f6'),
                                        color: selectedRegions.includes(region)
                                            ? 'white'
                                            : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'rgba(255, 255, 255, 0.8)' : '#4b5563'),
                                        padding: '0.375rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        margin: '0.25rem',
                                        border: 'none'
                                    }}
                                >
                                    {region}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 차트 영역 */}
                <div style={{padding: '1.5rem'}}>
                    {loading && (
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px'}}>
                            <div style={{
                                border: '4px solid rgba(0, 0, 0, 0.1)',
                                borderRadius: '50%',
                                borderTop: '4px solid #3b82f6',
                                width: '40px',
                                height: '40px',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
                        </div>
                    )}

                    {error && (
                        <div style={{
                            padding: '1rem',
                            backgroundColor: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'rgba(220, 38, 38, 0.1)' : 'rgba(254, 226, 226, 0.5)',
                            color: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#ef4444' : '#b91c1c',
                            borderRadius: '6px',
                            marginBottom: '1rem',
                            borderLeft: '4px solid #ef4444'
                        }}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <div style={{flexShrink: 0}}>
                                    <svg style={{height: '20px', width: '20px', color: '#ef4444'}}
                                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                              clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <div style={{marginLeft: '0.75rem'}}>
                                    <p style={{fontSize: '0.875rem'}}>{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!loading && !error && (
                        <div style={{height: '400px'}}>
                            {viewMode === 'monthly' ? (
                                <Line data={getMonthlyChartData()} options={chartOptions}/>
                            ) : (
                                <Bar data={getYearlyChartData()} options={chartOptions}/>
                            )}
                        </div>
                    )}
                </div>

                {/* 정보 섹션 */}
                <div style={{
                    backgroundColor: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#2a2a2a' : '#f9fafb',
                    padding: '1rem 1.5rem',
                    borderTop: window.matchMedia('(prefers-color-scheme: dark)').matches ? '1px solid #2d2d2d' : '1px solid #e5e7eb'
                }}>
                    <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: '500',
                        color: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'white' : '#111827'
                    }}>
                        미세먼지 정보
                    </h3>
                    <div style={{
                        marginTop: '0.5rem',
                        fontSize: '0.875rem',
                        color: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'rgba(255, 255, 255, 0.7)' : '#4b5563'
                    }}>
                        <p>
                            <strong>미세먼지(PM10)</strong>: 지름이 10㎛ 이하인 입자상 물질로, 호흡기 질환을 유발할 수 있습니다.
                        </p>
                        <p style={{marginTop: '0.5rem'}}>
                            <strong>초미세먼지(PM2.5)</strong>: 지름이 2.5㎛ 이하인 입자상 물질로, 혈관을 통해 체내로 쉽게 침투하여 각종 질환을 일으킬 수 있습니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FineDustStats;