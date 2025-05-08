// src/utils/airUtils.ts

const API_KEY = '5067505a71776b643633616f65486a'; // 실제 발급받은 키를 사용하세요

const getGrade = (pm10: number): string => {
    if (pm10 <= 30) return '좋음';
    if (pm10 <= 80) return '보통';
    if (pm10 <= 150) return '나쁨';
    return '매우나쁨';
};

const getSeason = (month: number): string => {
    if ([3, 4, 5].includes(month)) return '봄';
    if ([6, 7, 8].includes(month)) return '여름';
    if ([9, 10, 11].includes(month)) return '가을';
    return '겨울';
};

// 자치구 → 권역명 매핑 (서울시 기준)
const districtToRegion: { [district: string]: string } = {
    '종로구': '도심권',
    '중구': '도심권',
    '용산구': '도심권',
    '성동구': '동북권',
    '광진구': '동북권',
    '동대문구': '동북권',
    '중랑구': '동북권',
    '성북구': '동북권',
    '강북구': '동북권',
    '도봉구': '동북권',
    '노원구': '동북권',
    '은평구': '서북권',
    '서대문구': '서북권',
    '마포구': '서북권',
    '양천구': '서남권',
    '강서구': '서남권',
    '구로구': '서남권',
    '금천구': '서남권',
    '영등포구': '서남권',
    '동작구': '서남권',
    '관악구': '서남권',
    '서초구': '동남권',
    '강남구': '동남권',
    '송파구': '동남권',
    '강동구': '동남권',
};

const GRADES = ['좋음', '보통', '나쁨', '매우나쁨'];

export const fetchSeasonalDustData = async (
    year: number,
    district: string
): Promise<{ [season: string]: { [grade: string]: number } }> => {
    const seasonalData: { [season: string]: { [grade: string]: number } } = {};
    const region = districtToRegion[district];
    if (!region) {
        console.warn(`❌ Unknown district: ${district}`);
        return seasonalData;
    }

    for (let month = 1; month <= 12; month++) {
        for (let day = 1; day <= 28; day++) {
            const date = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
            const url = `http://openapi.seoul.go.kr:8088/${API_KEY}/json/DailyAverageCityAir/1/5/${date}/${encodeURIComponent(region)}/${encodeURIComponent(district)}`;

            try {
                const res = await fetch(url);
                const json = await res.json();
                const rows = json?.DailyAverageCityAir?.row;

                if (Array.isArray(rows)) {
                    const item = rows.find((r: any) => r.MSRSTE_NM === district && r.PM10 !== undefined);

                    if (item) {
                        const season = getSeason(month);
                        const grade = getGrade(Number(item.PM10));

                        // 등급별 초기화
                        if (!seasonalData[season]) {
                            seasonalData[season] = {};
                            GRADES.forEach(g => seasonalData[season][g] = 0);
                        }

                        seasonalData[season][grade]++;
                    }
                }
            } catch (e) {
                console.warn(`⚠️ Failed to fetch ${date} for ${district}:`, e);
            }
        }
    }

    return seasonalData;
};
