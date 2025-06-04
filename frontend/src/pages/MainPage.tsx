import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngTuple } from 'leaflet';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import happyDog from '../assets/happy_dog.png';
import normalDog from '../assets/normal_dog.png';
import sadDog from '../assets/sad_dog.png';
import KakaoMap from "../components/KakaoMap";

const SEOUL_CENTER: LatLngTuple = [37.5665, 126.978];
const API_KEY = import.meta.env.VITE_AIR_QUALITY_API_KEY;
const ENDPOINT = 'http://openAPI.seoul.go.kr:8088';
const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

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
        if (value <= 15) return '#2c7bb6';
        if (value <= 45) return '#00b231';
        if (value <= 75) return '#ffdc00';
        if (value <= 1000) return '#d7191c';
        return '#4f4f5b';
    } else {
        if (value <= 5) return '#2c7bb6';
        if (value <= 15) return '#00b231';
        if (value <= 25) return '#ffdc00';
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

const ResizeMap = () => {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 200);
    }, [map]);
    return null;
};

const Legend = () => {
    const levels = [
        { label: '좋음', color: '#2c7bb6' },
        { label: '보통', color: '#00b231' },
        { label: '나쁨', color: '#ffdc00' },
        { label: '매우나쁨', color: '#d7191c' },
        { label: '데이터 없음', color: '#4f4f5b' },
    ];

    return (
        <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            fontSize: '0.9rem',
            zIndex: 1000,
        }}>
            {levels.map((level) => (
                <div key={level.label} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: level.color,
                        marginRight: '8px',
                        border: '1px solid #ccc',
                    }} />
                    {level.label}
                </div>
            ))}
        </div>
    );
};

const MainPage: React.FC = () => {
    const [geoData, setGeoData] = useState<any>(null);
    const [airData, setAirData] = useState<any[]>([]);
    const [selectedPollutant, setSelectedPollutant] = useState<'PM10' | 'PM25'>('PM10');
    const [currentDistrict, setCurrentDistrict] = useState<string>('강남구');
    const [currentPM10, setCurrentPM10] = useState<number | null>(null);
    const [currentPM25, setCurrentPM25] = useState<number | null>(null);
    const navigate = useNavigate();
    const walkWarning = getWalkWarningLevel(currentPM10, currentPM25);
    const [walkWarningMessage, setWalkWarningMessage] = useState<string>('');

    // 로컬스토리지 저장용 useEffect 추가
    useEffect(() => {
        localStorage.setItem('walkWarningMessage', walkWarning.message);
    }, [walkWarning.message]);


    useEffect(() => {
        setWalkWarningMessage(walkWarning.message);
    }, [walkWarning.message]);

    // 1. GeoJSON 및 대기정보 불러오기
    useEffect(() => {
        fetch('/seoul.geojson')
            .then((resp) => resp.json())
            .then(setGeoData)
            .catch(() => alert('GeoJSON 데이터를 불러올 수 없습니다.'));

        fetchAirData()
            .then((data) => {
                setAirData(data);
                // airData가 로드되면 현재 위치도 초기화 (첫 렌더 때 미리 default 설정)
                // 위치 정보가 없으면 강남구가 기본
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
            })
            .catch(() => alert('미세먼지 데이터를 불러올 수 없습니다.'));
    }, []);

    // 2. currentDistrict 또는 airData 변경 시, PM10/PM25 상태 업데이트
    useEffect(() => {
        if (airData.length === 0 || !currentDistrict) return;
        const current = airData.find((d) => d.MSRSTENAME === currentDistrict);
        if (current) {
            setCurrentPM10(parseInt(current.PM10, 10));
            setCurrentPM25(parseInt(current.PM25, 10));
        } else {
            setCurrentPM10(null);
            setCurrentPM25(null);
        }
    }, [airData, currentDistrict]);

    const normalizeName = (name: string) => name.replace(/\s/g, '').toLowerCase();

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

    const onEachFeature = (feature: any, layer: any) => {
        const districtName = feature.properties.SIG_KOR_NM;
        const normalizedDistrictName = normalizeName(districtName);
        const air = airData.find((item) => normalizeName(item.MSRSTENAME) === normalizedDistrictName);
        if (!air) return;

        const value = selectedPollutant === 'PM10' ? air.PM10 : air.PM25;

        layer.bindTooltip(`${districtName}<br>${selectedPollutant}: ${value}`, {
            permanent: true,
            direction: 'center',
            className: 'district-label',
        });
    };

    return (
        <div className="relative w-screen bg-[#B9CAF5]">
            <Header/>
            <div className="relative w-full bg-white pt-11 pb-20">
                <div className="max-w-[1280px] mx-auto px-4">
                    <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px'}}>
                        서울시 행정구역 미세먼지 지도
                    </h2>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: '20px',
                        alignItems: 'flex-start'
                    }}>
                        <div style={{flex: '1', minWidth: '300px', maxWidth: '400px'}}>
                            <div style={{marginBottom: '16px'}}>
                                <label htmlFor="pollutant" style={{marginRight: '8px', fontWeight: 'bold'}}>
                                    항목 선택:
                                </label>
                                <select
                                    id="pollutant"
                                    value={selectedPollutant}
                                    onChange={(e) => setSelectedPollutant(e.target.value as 'PM10' | 'PM25')}
                                    style={{padding: '6px 10px', borderRadius: '4px'}}
                                >
                                    <option value="PM10">미세먼지 (PM10)</option>
                                    <option value="PM25">초미세먼지 (PM2.5)</option>
                                </select>
                            </div>

                            <div style={{
                                padding: '12px 16px',
                                marginBottom: '12px',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '8px',
                                width: '100%',
                                lineHeight: '1.6',
                                fontSize: '0.95rem',
                            }}>
                                <strong>현재 위치:</strong> {currentDistrict}<br/>
                                <strong>미세먼지
                                    (PM10):</strong> {currentPM10 !== null ? `${currentPM10} ㎍/㎥` : '데이터 없음'}<br/>
                                <strong>초미세먼지 (PM2.5):</strong> {currentPM25 !== null ? `${currentPM25} ㎍/㎥` : '데이터 없음'}
                            </div>

                            <div style={{
                                padding: '20px 16px',
                                marginBottom: '20px',
                                backgroundColor: walkWarning.message.includes('주의') ? '#fff4e5' : '#e6f7ff',
                                borderRadius: '12px',
                                width: '100%',
                                border: walkWarning.message.includes('주의') ? '1px solid #ffa940' : '1px solid #40a9ff',
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                            }}>
                                <img
                                    src={walkWarning.image}
                                    alt="반려견 상태"
                                    style={{
                                        width: '200px',
                                        height: '200px',
                                        objectFit: 'contain',
                                        marginBottom: '12px'
                                    }}
                                />
                                <span>{walkWarning.message}</span>
                            </div>

                            <button
                                onClick={() => navigate('/manageguide', {state: {walkWarningMessage: walkWarning.message}})}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#3050f0',
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '1.05rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    border: 'none',
                                }}
                            >
                                반려견 산책하기 좋은 장소 추천받기
                            </button>
                        </div>

                        <div
                            style={{
                                flex: 2,
                                minWidth: '300px',
                                height: '600px',
                                borderRadius: '12px',
                                overflow: 'hidden'
                            }}>
                            {geoData && airData.length > 0 && (
                                <MapContainer
                                    center={SEOUL_CENTER}
                                    zoom={11}
                                    style={{height: '100%', width: '100%'}}
                                    scrollWheelZoom={true}
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                                    <GeoJSON
                                        key={selectedPollutant}
                                        data={geoData}
                                        style={styleFeature}
                                        onEachFeature={onEachFeature}
                                    />
                                    <ResizeMap/>
                                </MapContainer>
                            )}
                        </div>
                    </div>
                    <Legend/>
                </div>
            </div>
            </div>
            );
            };

            export default MainPage;
