// src/components/SeasonPieChart.tsx
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchSeasonalDustData } from '../utils/airUtils';

Chart.register(ArcElement, Tooltip, Legend);

interface Props {
    year: number;
    district: string;
}

export const SeasonPieChart: React.FC<Props> = ({ year, district }) => {
    const [data, setData] = useState<{ [season: string]: { [grade: string]: number } }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchSeasonalDustData(year, district).then((result) => {
            setData(result);
            setLoading(false);
        });
    }, [year, district]);

    if (loading) return <p className="text-center">데이터 불러오는 중...</p>;

    const seasonColors: any = {
        '좋음': '#4CAF50',
        '보통': '#FFC107',
        '나쁨': '#FF5722',
        '매우나쁨': '#9C27B0',
    };

    return (
        <div className="grid grid-cols-2 gap-6">
            {Object.entries(data).map(([season, gradeCount]) => (
                <div key={season}>
                    <h2 className="text-center font-semibold mb-2">{season}</h2>
                    <Pie
                        data={{
                            labels: Object.keys(gradeCount),
                            datasets: [
                                {
                                    data: Object.values(gradeCount),
                                    backgroundColor: Object.keys(gradeCount).map((g) => seasonColors[g]),
                                },
                            ],
                        }}
                        options={{ plugins: { legend: { position: 'bottom' } } }}
                    />
                </div>
            ))}
        </div>
    );
};
