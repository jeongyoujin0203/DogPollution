import React, { useEffect, useRef, useState } from 'react';

interface MapProps {
    center: {
        lat: number;
        lng: number;
    };
    title: string;
    markers?: {
        id: number;
        name: string;
        location: { lat: number; lng: number };
    }[];
}

declare global {
    interface Window {
        kakao: any;
    }
}

const KakaoMap: React.FC<MapProps> = ({ center, title, markers = [] }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 카카오맵 스크립트 로드
    useEffect(() => {
        // 이미 스크립트가 로드되어 있는지 확인
        if (window.kakao && window.kakao.maps) {
            console.log('Kakao Maps already loaded');
            setMapLoaded(true);
            return;
        }

        const mapScript = document.createElement('script');
        mapScript.async = true;
        // Vite 환경 변수에서 API 키 가져오기
        const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;
        console.log('Using Kakao API Key from Vite env:', KAKAO_API_KEY ? '키가 설정됨' : '키가 없음');

        if (!KAKAO_API_KEY) {
            setError('카카오맵 API 키가 환경 변수에 설정되지 않았습니다.');
            return;
        }

        mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false`;

        mapScript.onload = () => {
            window.kakao.maps.load(() => {
                console.log('Kakao Maps loaded successfully');
                setMapLoaded(true);
            });
        };

        mapScript.onerror = () => {
            console.error('Failed to load Kakao Maps script');
            setError('카카오맵을 불러오는데 실패했습니다. API 키를 확인해주세요.');
        };

        document.head.appendChild(mapScript);

        return () => {
            // 클린업 함수
            if (document.head.contains(mapScript)) {
                document.head.removeChild(mapScript);
            }
        };
    }, []);

    // 지도 초기화 및 마커 설정
    useEffect(() => {
        if (!mapLoaded || !window.kakao || !mapRef.current) return;

        try {
            const kakao = window.kakao;

            // 지도 생성
            const options = {
                center: new kakao.maps.LatLng(center.lat, center.lng),
                level: 3
            };

            console.log('Creating map with center:', center);
            const mapInstance = new kakao.maps.Map(mapRef.current, options);
            mapInstanceRef.current = mapInstance;

            // 마커 삭제 로직 (이전 마커 제거)
            const existingMarkers = mapInstanceRef.current._markers || [];
            existingMarkers.forEach((marker: any) => {
                marker.setMap(null);
            });
            mapInstanceRef.current._markers = [];

            // 마커 생성 로직
            if (markers && markers.length > 0) {
                const newMarkers: any[] = [];

                markers.forEach(marker => {
                    const position = new kakao.maps.LatLng(marker.location.lat, marker.location.lng);
                    console.log('Adding marker at:', marker.location);

                    // 마커 생성
                    const mapMarker = new kakao.maps.Marker({
                        position: position,
                        map: mapInstance
                    });

                    // 인포윈도우 생성
                    const infoWindow = new kakao.maps.InfoWindow({
                        content: `<div style="padding:5px;font-size:12px;">${marker.name}</div>`
                    });

                    // 마커에 마우스오버 이벤트 등록
                    kakao.maps.event.addListener(mapMarker, 'mouseover', function() {
                        infoWindow.open(mapInstance, mapMarker);
                    });

                    // 마커에 마우스아웃 이벤트 등록
                    kakao.maps.event.addListener(mapMarker, 'mouseout', function() {
                        infoWindow.close();
                    });

                    newMarkers.push(mapMarker);
                });

                // 마커 저장 (나중에 제거하기 위함)
                mapInstanceRef.current._markers = newMarkers;
            }
        } catch (error) {
            console.error("Error initializing map:", error);
            setError('지도를 초기화하는데 문제가 발생했습니다.');
        }
    }, [center, markers, mapLoaded]);

    // center가 변경되면 지도 중심 위치 변경
    useEffect(() => {
        if (!mapLoaded || !mapInstanceRef.current || !window.kakao) return;

        try {
            const kakao = window.kakao;
            const moveLatLon = new kakao.maps.LatLng(center.lat, center.lng);
            console.log('Moving map center to:', center);
            mapInstanceRef.current.setCenter(moveLatLon);
        } catch (error) {
            console.error("Error updating map center:", error);
        }
    }, [center, mapLoaded]);

    return (
        <div ref={mapRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
            {!mapLoaded && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    background: '#f0f0f0',
                    position: 'absolute',
                    top: 0,
                    left: 0
                }}>
                    <p>지도를 불러오는 중...</p>
                </div>
            )}
            {error && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    background: '#fee2e2',
                    color: '#b91c1c',
                    position: 'absolute',
                    top: 0,
                    left: 0
                }}>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default KakaoMap;