// src/components/YearSelector.tsx
import React from 'react';

interface Props {
    year: number;
    setYear: (year: number) => void;
}

export const YearSelector: React.FC<Props> = ({ year, setYear }) => {
    const years = [2024, 2023, 2022, 2021, 2020, 2019];

    return (
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map((y) => (
                <option key={y} value={y}>{y}년</option>
            ))}
        </select>
    );
};
