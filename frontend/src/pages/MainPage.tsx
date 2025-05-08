import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import happyDog from '../assets/happy_dog.png';
import normalDog from '../assets/normal_dog.png';
import sadDog from '../assets/sad_dog.png';

const SEOUL_CENTER = [37.5665, 126.978];
const API_KEY = '5067505a71776b643633616f65486a';
const ENDPOINT = 'http://openAPI.seoul.go.kr:8088';
const KAKAO_REST_API_KEY = 'ef223701d7a1605b81b70e9beae40dc3';

async function fetchAirData() {
    const url = `${ENDPOINT}/${API_KEY}/json/ListAirQualityByDistrictService/1/25/`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('API 요청 실패');
    const data = await res.json();
    return data.ListAirQualityByDistrictService.row;
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
    const url = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lng}&y=${lat}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
    });
    if (!response.ok) throw new Error('카카오 주소 API 요청 실패');
    const data = await response.json();
    return data.documents[0]?.region_2depth_name || '강남구';
}

function getColor(value: number, type: string): string {
    if (type === 'PM10') {
        if (value <= 20) return '#2c7bb6';
        if (value <= 45) return '#00b231';
        if (value <= 75) return '#ffdc00';
        if (value <= 1000) return '#d7191c';
        return '#4f4f5b';
    } else {
        if (value <= 10) return '#2c7bb6';
        if (value <= 15) return '#00b231';
        if (value <= 37) return '#ffdc00';
        if (value <= 1000) return '#d7191c';
        return '#4f4f5b';
    }
}

type WalkWarningResult = {
    message: string;
    image: string;
};

function getWalkWarningLevel(pm10: number | null, pm25: number | null): WalkWarningResult {
    if (pm10 === null || pm25 === null) {
        return {
            message: '데이터 없음',
            image: normalDog,
        } as WalkWarningResult;
    }

    const isPM10Caution = pm10 >= 46;
    const isPM25Caution = pm25 >= 16;

    if (isPM10Caution && isPM25Caution) {
        return {
            message: '⚠️ 산책 시 주의가 필요합니다.',
            image: sadDog,
        } as WalkWarningResult;
    }

    return {
        message: '✅ 산책하기 좋은 날이에요!',
        image: happyDog,
    } as WalkWarningResult;
}

// 지도 강제 리사이즈 컴포넌트
const ResizeMap = () => {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 200);
    }, [map]);
    return null;
};

const MainPage: React.FC = () => {
    const [geoData, setGeoData] = useState<any>(null);
    const [airData, setAirData] = useState<any[]>([]);
    const [selectedPollutant, setSelectedPollutant] = useState<'PM10' | 'PM25'>('PM10');
    const [currentDistrict, setCurrentDistrict] = useState<string>('강남구');
    const [currentPM10, setCurrentPM10] = useState<number | null>(null);
    const [currentPM25, setCurrentPM25] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/seoul.geojson')
            .then((resp) => resp.json())
            .then(setGeoData)
            .catch(() => alert('GeoJSON 데이터를 불러올 수 없습니다.'));

        fetchAirData()
            .then(setAirData)
            .catch(() => alert('미세먼지 데이터를 불러올 수 없습니다.'));
    }, []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const district = await reverseGeocode(latitude, longitude);
                    setCurrentDistrict(district);
                } catch {
                    setCurrentDistrict('강남구');
                }
            },
            () => {
                setCurrentDistrict('강남구');
            }
        );
    }, []);

    useEffect(() => {
        if (airData.length === 0 || !currentDistrict) return;
        const current = airData.find((d) => d.MSRSTENAME === currentDistrict);
        if (current) {
            setCurrentPM10(parseInt(current.PM10, 10));
            setCurrentPM25(parseInt(current.PM25, 10));
        }
    }, [airData, currentDistrict]);

    const styleFeature = (feature: any) => {
        const districtName = feature.properties.SIG_KOR_NM;
        const air = airData.find((item) => item.MSRSTENAME === districtName);
        let value = 0;
        if (air) {
            value = selectedPollutant === 'PM10'
                ? parseInt(air.PM10, 10)
                : parseInt(air.PM25, 10);
        }
        return {
            fillColor: getColor(value, selectedPollutant),
            weight: 1,
            color: 'white',
            fillOpacity: 0.6,
        };
    };

    const walkWarning = getWalkWarningLevel(currentPM10, currentPM25);

    return (
        <div className="relative w-screen bg-[#B9CAF5]">
            <Header />
            <div className="relative w-full bg-white pt-36 pb-20">
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
                    서울시 행정구역 미세먼지 지도
                </h2>

                {/* 메인 콘텐츠 영역: 플렉스 레이아웃 적용 */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: '20px',
                    alignItems: 'flex-start'
                }}>
                    {/* 왼쪽 정보 패널 */}
                    <div style={{
                        flex: '1',
                        minWidth: '300px',
                        maxWidth: '400px'
                    }}>
                        {/* 항목 선택 */}
                        <div style={{ marginBottom: '16px' }}>
                            <label htmlFor="pollutant" style={{ marginRight: '8px', fontWeight: 'bold' }}>
                                항목 선택:
                            </label>
                            <select
                                id="pollutant"
                                value={selectedPollutant}
                                onChange={(e) => setSelectedPollutant(e.target.value as 'PM10' | 'PM25')}
                                style={{ padding: '6px 10px', borderRadius: '4px' }}
                            >
                                <option value="PM10">미세먼지 (PM10)</option>
                                <option value="PM25">초미세먼지 (PM2.5)</option>
                            </select>
                        </div>

                        {/* 현재 위치 정보 박스 */}
                        <div
                            style={{
                                padding: '12px 16px',
                                marginBottom: '12px',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '8px',
                                width: '100%',
                                lineHeight: '1.6',
                                fontSize: '0.95rem',
                            }}
                        >
                            <strong>현재 위치:</strong> {currentDistrict}<br />
                            <strong>미세먼지 (PM10):</strong> {currentPM10 !== null ? `${currentPM10} ㎍/㎥` : '데이터 없음'}<br />
                            <strong>초미세먼지 (PM2.5):</strong> {currentPM25 !== null ? `${currentPM25} ㎍/㎥` : '데이터 없음'}
                        </div>

                        {/* 산책 지수 박스 */}
                        <div
                            style={{
                                padding: '12px 16px',
                                marginBottom: '20px',
                                backgroundColor: walkWarning.message.includes('주의') ? '#fff4e5' : '#e6f7ff',
                                borderRadius: '8px',
                                width: '100%',
                                border: walkWarning.message.includes('주의') ? '1px solid #ffa940' : '1px solid #91d5ff',
                                color: walkWarning.message.includes('주의') ? '#d48806' : '#0050b3',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                            }}
                        >
                            <div>산책 지수: {walkWarning.message}</div>
                            <img src={walkWarning.image} alt="산책 지수" width="60" />
                        </div>

                        {/* 추천/가이드 버튼 */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexDirection: 'column' }}>
                            <button
                                onClick={() => navigate('/placerec')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#1890ff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    width: '100%',
                                }}
                            >
                                장소 추천 바로가기
                            </button>
                            <button
                                onClick={() => navigate('/manageguide')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#52c41a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    width: '100%',
                                }}
                            >
                                미세먼지 관리 가이드
                            </button>
                        </div>
                    </div>

                    {/* 오른쪽 지도 영역 */}
                    <div style={{
                        flex: '2',
                        minWidth: '300px',
                        height: '600px',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}>
                        <MapContainer center={SEOUL_CENTER} zoom={11} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; OpenStreetMap contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <ResizeMap />
                            {geoData && <GeoJSON data={geoData} style={styleFeature} />}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;