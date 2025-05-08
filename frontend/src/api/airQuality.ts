import axios from 'axios';
import { AirQualityRow } from '../types/AirQuality.d.ts';

const API_KEY = '5067505a71776b643633616f65486a'; // 실제 발급받은 키로 변경
const BASE_URL = 'http://openAPI.seoul.go.kr:8088';

export const fetchAirQuality = async (year: string): Promise<AirQualityRow[]> => {
    const url = `${BASE_URL}/${API_KEY}/json/YearlyAverageAirQuality/1/1000/${year}`;
    const response = await axios.get(url);
    return response.data?.YearlyAverageAirQuality?.row || [];
};
