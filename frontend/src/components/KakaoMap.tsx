import React, { useEffect, useRef, useState } from 'react';

interface Place {
    id: string;
    name: string;
    address: string;
    category: string;
    lat: number;
    lng: number;
}

interface KakaoMapProps {
    walkWarningMessage: string;
}

const KakaoMap: React.FC<KakaoMapProps> = ({ walkWarningMessage }) => {
    console.log(walkWarningMessage);

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
    const [indoorRecommendedPlaces, setIndoorRecommendedPlaces] = useState<Place[]>([]);
    const [outdoorRecommendedPlaces, setOutdoorRecommendedPlaces] = useState<Place[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [reviews, setReviews] = useState<Record<string, string>>({});
    const [reviewInput, setReviewInput] = useState('');
    const [error, setError] = useState<string | null>(null);

    // 카카오맵 스크립트 동적 로드
    const loadKakaoMapScript = () => {
        if (document.getElementById('kakao-map-script')) return;
        const script = document.createElement('script');
        script.id = 'kakao-map-script';
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&libraries=services&autoload=false`;
        script.async = true;
        script.onload = () => {
            window.kakao.maps.load(() => {
                setMapLoaded(true);
            });
        };
        script.onerror = () => {
            setError('카카오맵을 불러오는데 실패했습니다.');
        };
        document.head.appendChild(script);
    };

    useEffect(() => {
        if (!window.kakao || !window.kakao.maps) {
            loadKakaoMapScript();
        } else {
            setMapLoaded(true);
        }
    }, []);

    // 실내/실외 추천 장소 검색
    const searchIndoorOutdoorPlaces = () => {
        if (!window.kakao || !mapInstanceRef.current) return;
        const ps = new window.kakao.maps.services.Places();

        let indoorResults: Place[] = [];
        let outdoorResults: Place[] = [];

        const indoorKeywords = ['애견 카페', '애견 샵', '애견 호텔', '애견 미용'];
        const outdoorKeywords = ['공원', '캠핑장'];

        const searchKeywords = (keywords: string[], isIndoor: boolean) => {
            return Promise.all(
                keywords.map(
                    (keyword) =>
                        new Promise<void>((resolve) => {
                            ps.keywordSearch(keyword, (data: any[], status: string) => {
                                if (status === window.kakao.maps.services.Status.OK) {
                                    const filtered = data
                                        .filter((place) =>
                                            (place.road_address_name || place.address_name).includes('서울')
                                        )
                                        .map((place) => ({
                                            id: place.id,
                                            name: place.place_name,
                                            address: place.road_address_name || place.address_name,
                                            category: place.category_group_name,
                                            lat: parseFloat(place.y),
                                            lng: parseFloat(place.x),
                                        }));
                                    if (isIndoor) {
                                        indoorResults = [...indoorResults, ...filtered];
                                    } else {
                                        outdoorResults = [...outdoorResults, ...filtered];
                                    }
                                }
                                resolve();
                            });
                        })
                )
            );
        };

        Promise.all([searchKeywords(indoorKeywords, true), searchKeywords(outdoorKeywords, false)]).then(() => {
            // 중복 제거 후 상위 3개씩 선택
            const uniqueIndoor = Array.from(new Map(indoorResults.map((i) => [i.id, i])).values()).slice(0, 4);
            const uniqueOutdoor = Array.from(new Map(outdoorResults.map((i) => [i.id, i])).values()).slice(0, 4);

            console.log("실내 장소:");
            uniqueIndoor.forEach(place => console.log(place));

            console.log("실외 장소:");
            uniqueOutdoor.forEach(place => console.log(place));

            setIndoorRecommendedPlaces(uniqueIndoor);
            setOutdoorRecommendedPlaces(uniqueOutdoor);
        });
    };

    // 맵 초기화 및 추천 장소 검색
    useEffect(() => {
        if (!mapLoaded || !mapRef.current) return;

        const kakao = window.kakao;
        const map = new kakao.maps.Map(mapRef.current, {
            center: new kakao.maps.LatLng(37.5665, 126.978),
            level: 3,
        });
        mapInstanceRef.current = map;

        searchIndoorOutdoorPlaces();
    }, [mapLoaded]);

    // 추천 장소 혹은 검색 결과 마커 표시
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        if (searchKeyword.trim() === '') {
            // 검색어 없으면 walkWarningMessage에 따라 마커 표시 분리
            if (walkWarningMessage.includes('주의')) {
                // 실내 추천만
                displayMarkers(indoorRecommendedPlaces);
            } else if (walkWarningMessage.includes('좋은')) {
                // 실외 추천만
                displayMarkers(outdoorRecommendedPlaces);
            } else {
                // 둘 다 표시하고 싶으면 아래처럼
                displayMarkers([...indoorRecommendedPlaces, ...outdoorRecommendedPlaces]);
            }
        } else {
            // 검색어 있으면 검색 결과 마커 표시
            displayMarkers(filteredPlaces);
        }
    }, [indoorRecommendedPlaces, outdoorRecommendedPlaces, filteredPlaces, searchKeyword, walkWarningMessage]);


    // 키워드 검색 처리
    const handleSearch = () => {
        if (!searchKeyword || !window.kakao || !mapInstanceRef.current) return;

        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(searchKeyword, (data: any[], status: string) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const seoulPlaces = data
                    .filter((place) => (place.road_address_name || place.address_name).includes('서울'))
                    .map((place) => ({
                        id: place.id,
                        name: place.place_name,
                        address: place.road_address_name || place.address_name,
                        category: place.category_group_name,
                        lat: parseFloat(place.y),
                        lng: parseFloat(place.x),
                    }));

                setFilteredPlaces(seoulPlaces);
            } else {
                setFilteredPlaces([]);
            }
        });
    };

    // 마커 표시 함수
    const displayMarkers = (places: Place[]) => {
        const kakao = window.kakao;
        const map = mapInstanceRef.current;
        if (!map) return;

        // 기존 마커 제거
        if (map._markers) {
            map._markers.forEach((m: any) => m.setMap(null));
        }

        if (places.length === 0) {
            map._markers = [];
            return;
        }

        const bounds = new kakao.maps.LatLngBounds();
        const markers = places.map((place) => {
            const pos = new kakao.maps.LatLng(place.lat, place.lng);
            const marker = new kakao.maps.Marker({ map, position: pos });

            kakao.maps.event.addListener(marker, 'click', () => {
                setSelectedPlace(place);
                setReviewInput(reviews[place.id] || '');
            });

            bounds.extend(pos);
            return marker;
        });

        map.setBounds(bounds);
        map._markers = markers;
    };

    // 즐겨찾기 토글
    const toggleFavorite = (placeId: string) => {
        setFavorites((prev) =>
            prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]
        );
    };

    // 리뷰 저장
    const saveReview = () => {
        if (selectedPlace) {
            setReviews((prev) => ({
                ...prev,
                [selectedPlace.id]: reviewInput,
            }));
        }
    };

    // 장소 카드 공통 스타일
    const placeCardStyle: React.CSSProperties = {
        marginBottom: '15px',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        background: '#fff',
        position: 'relative',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* 검색창 */}
            <div style={{ padding: '10px', background: '#eee', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="검색어 입력"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                    style={{
                        flex: 1,
                        padding: '8px',
                        fontSize: '1rem',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                    }}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        padding: '8px 15px',
                        fontSize: '1rem',
                        borderRadius: '5px',
                        border: 'none',
                        background: '#007bff',
                        color: '#fff',
                        cursor: 'pointer',
                    }}
                >
                    검색
                </button>
            </div>

            {/* 지도 + 추천 장소/검색 결과 패널 */}
            <div style={{ display: 'flex', flex: 1 }}>
                <div ref={mapRef} style={{ flex: 3, height: '100%' }} />
                <div
                    style={{
                        flex: 2,
                        overflowY: 'auto',
                        padding: '10px',
                        background: '#fafafa',
                        boxSizing: 'border-box',
                    }}
                >
                    {searchKeyword === '' && (
                        <>
                            {walkWarningMessage?.includes('주의') && indoorRecommendedPlaces.length > 0 && (
                                <>
                                    <h3>🏠 실내 추천 장소</h3>
                                    {indoorRecommendedPlaces.map((place) => (
                                        <div key={place.id} style={placeCardStyle}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <strong style={{ fontSize: '1.1rem' }}>{place.name}</strong>
                                                <button
                                                    onClick={() => toggleFavorite(place.id)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        fontSize: '1.2rem',
                                                        cursor: 'pointer',
                                                        color: favorites.includes(place.id) ? 'gold' : '#999',
                                                    }}
                                                    aria-label="즐겨찾기 토글"
                                                >
                                                    {favorites.includes(place.id) ? '★' : '☆'}
                                                </button>
                                            </div>
                                            <p style={{ margin: '5px 0' }}>{place.address}</p>
                                            <small style={{ color: '#555' }}>{place.category}</small>
                                            <div style={{ marginTop: '10px' }}>
                                                <button
                                                    onClick={() => setSelectedPlace(place)}
                                                    style={{
                                                        padding: '5px 10px',
                                                        background: '#007bff',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    상세보기
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                            {!walkWarningMessage?.includes('주의') && outdoorRecommendedPlaces.length > 0 && (
                                <>
                                    <h3>🏞️ 실외 추천 장소</h3>
                                    {outdoorRecommendedPlaces.map((place) => (
                                        <div key={place.id} style={placeCardStyle}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <strong style={{ fontSize: '1.1rem' }}>{place.name}</strong>
                                                <button
                                                    onClick={() => toggleFavorite(place.id)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        fontSize: '1.2rem',
                                                        cursor: 'pointer',
                                                        color: favorites.includes(place.id) ? 'gold' : '#999',
                                                    }}
                                                    aria-label="즐겨찾기 토글"
                                                >
                                                    {favorites.includes(place.id) ? '★' : '☆'}
                                                </button>
                                            </div>
                                            <p style={{ margin: '5px 0' }}>{place.address}</p>
                                            <small style={{ color: '#555' }}>{place.category}</small>
                                            <div style={{ marginTop: '10px' }}>
                                                <button
                                                    onClick={() => setSelectedPlace(place)}
                                                    style={{
                                                        padding: '5px 10px',
                                                        background: '#007bff',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    상세보기
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </>
                    )}

                    {/* 검색어 있을 때 검색 결과 리스트 */}
                    {searchKeyword !== '' && (
                        <>
                            <h3>검색 결과 ({filteredPlaces.length}건)</h3>
                            {filteredPlaces.length === 0 && <p>검색 결과가 없습니다.</p>}
                            {filteredPlaces.map((place) => (
                                <div key={place.id} style={placeCardStyle}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <strong style={{ fontSize: '1.1rem' }}>{place.name}</strong>
                                        <button
                                            onClick={() => toggleFavorite(place.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                fontSize: '1.2rem',
                                                cursor: 'pointer',
                                                color: favorites.includes(place.id) ? 'gold' : '#999',
                                            }}
                                            aria-label="즐겨찾기 토글"
                                        >
                                            {favorites.includes(place.id) ? '★' : '☆'}
                                        </button>
                                    </div>
                                    <p style={{ margin: '5px 0' }}>{place.address}</p>
                                    <small style={{ color: '#555' }}>{place.category}</small>
                                    <div style={{ marginTop: '10px' }}>
                                        <button
                                            onClick={() => setSelectedPlace(place)}
                                            style={{
                                                padding: '5px 10px',
                                                background: '#007bff',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            상세보기
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* 선택된 장소 상세 & 리뷰 */}
                    {selectedPlace && (
                        <div
                            style={{
                                marginTop: '20px',
                                padding: '15px',
                                background: '#fff',
                                borderRadius: '10px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            }}
                        >
                            <h3>{selectedPlace.name}</h3>
                            <p>{selectedPlace.address}</p>
                            <p>{selectedPlace.category}</p>
                            <textarea
                                rows={4}
                                value={reviewInput}
                                onChange={(e) => setReviewInput(e.target.value)}
                                placeholder="리뷰를 작성하세요"
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '5px',
                                    border: '1px solid #ccc',
                                    marginTop: '10px',
                                    resize: 'vertical',
                                }}
                            />
                            <button
                                onClick={saveReview}
                                style={{
                                    marginTop: '10px',
                                    padding: '8px 12px',
                                    background: '#28a745',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                리뷰 저장
                            </button>
                            <button
                                onClick={() => setSelectedPlace(null)}
                                style={{
                                    marginTop: '10px',
                                    marginLeft: '10px',
                                    padding: '8px 12px',
                                    background: '#dc3545',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                닫기
                            </button>
                        </div>
                    )}

                    {error && (
                        <div style={{ color: 'red', marginTop: '10px' }}>
                            <strong>에러:</strong> {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KakaoMap;
