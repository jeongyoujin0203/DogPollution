import React, { useState } from "react";
import Header from '../components/Header';
import KakaoMap from '../components/Map';
import ReviewComponent from '../components/ReviewComponent';
import OlympicPark from "../assets/OlympicPark.png";
import BauWauCafe from "../assets/BauWauCafe.png";

interface Place {
    id: number;
    name: string;
    image: string;
    address: string;
    rating: number;
    distance: string;
    airQuality: string;
    airQualityColor: string;
    location: { lat: number; lng: number }; // 위치 정보 추가
    tags: { label: string; bgColor: string; textColor: string }[];
}

const mockPlaces: Place[] = [
    {
        id: 1,
        name: "올림픽 공원",
        image: OlympicPark,
        address: "서울시 송파구 올림픽로 424",
        rating: 4.8,
        distance: "1.2km",
        airQuality: "미세먼지 좋음",
        airQualityColor: "#22C55E",
        location: { lat: 37.5208, lng: 127.1240 }, // 올림픽 공원 위치
        tags: [
            { label: "넓은 공간", bgColor: "#DBEAFE", textColor: "#1D4ED8" },
            { label: "산책로", bgColor: "#DCFCE7", textColor: "#15803D" },
            { label: "반려견 급수대", bgColor: "#F3E8FF", textColor: "#7E22CE" },
        ],
    },
    {
        id: 2,
        name: "바우와우 애견카페",
        image: BauWauCafe,
        address: "서울시 강남구 도산대로 158",
        rating: 4.6,
        distance: "0.8km",
        airQuality: "미세먼지 보통",
        airQualityColor: "#EAB308",
        location: { lat: 37.5248, lng: 127.0276 }, // 강남 위치
        tags: [
            { label: "실내", bgColor: "#FEE2E2", textColor: "#B91C1C" },
            { label: "카페", bgColor: "#FFEDD5", textColor: "#C2410C" },
            { label: "놀이공간", bgColor: "#FEF9C3", textColor: "#A16207" },
        ],
    },
    {
        id: 3,
        name: "한강공원 뚝섬지구",
        image: "https://placehold.co/294x192",
        address: "서울시 광진구 자양동 704-1",
        rating: 4.5,
        distance: "3.5km",
        airQuality: "미세먼지 좋음",
        airQualityColor: "#22C55E",
        location: { lat: 37.5304, lng: 127.0663 }, // 뚝섬 위치
        tags: [
            { label: "강변", bgColor: "#DBEAFE", textColor: "#1D4ED8" },
            { label: "넓은 공간", bgColor: "#DCFCE7", textColor: "#15803D" },
            { label: "자전거길", bgColor: "#E0E7FF", textColor: "#4338CA" },
        ],
    },
    {
        id: 4,
        name: "월드컵공원 도그런",
        image: "https://placehold.co/294x192",
        address: "서울시 마포구 월드컵로 243-60",
        rating: 4.7,
        distance: "5.2km",
        airQuality: "미세먼지 좋음",
        airQualityColor: "#22C55E",
        location: { lat: 37.5717, lng: 126.8974 }, // 월드컵공원 위치
        tags: [
            { label: "도그런", bgColor: "#DBEAFE", textColor: "#1D4ED8" },
            { label: "울타리", bgColor: "#DCFCE7", textColor: "#15803D" },
            { label: "넓은 공간", bgColor: "#F3E8FF", textColor: "#7E22CE" },
        ],
    },
    {
        id: 5,
        name: "어린이대공원 반려견 놀이터",
        image: "https://placehold.co/294x192",
        address: "서울시 광진구 능동로 216",
        rating: 4.4,
        distance: "4.3km",
        airQuality: "미세먼지 좋음",
        airQualityColor: "#22C55E",
        location: { lat: 37.5478, lng: 127.0796 }, // 어린이대공원 위치
        tags: [
            { label: "놀이터", bgColor: "#DBEAFE", textColor: "#1D4ED8" },
            { label: "훈련시설", bgColor: "#DCFCE7", textColor: "#15803D" },
            { label: "급수대", bgColor: "#F3E8FF", textColor: "#7E22CE" },
        ],
    },
    {
        id: 6,
        name: "펫스테이 호텔 & 스파",
        image: "https://placehold.co/400x192",
        address: "서울시 강남구 테헤란로 152",
        rating: 4.9,
        distance: "1.5km",
        airQuality: "실내 공간",
        airQualityColor: "#22C55E",
        location: { lat: 37.5038, lng: 127.0407 }, // 테헤란로 위치
        tags: [
            { label: "호텔", bgColor: "#FEE2E2", textColor: "#B91C1C" },
            { label: "스파", bgColor: "#FFEDD5", textColor: "#C2410C" },
            { label: "미용", bgColor: "#FEF9C3", textColor: "#A16207" },
        ],
    },
    {
        id: 7,
        name: "북한산 둘레길",
        image: "https://placehold.co/400x192",
        address: "서울시 강북구 우이동",
        rating: 4.7,
        distance: "8.7km",
        airQuality: "미세먼지 좋음",
        airQualityColor: "#22C55E",
        location: { lat: 37.6636, lng: 126.9895 }, // 북한산 위치
        tags: [
            { label: "산책로", bgColor: "#DBEAFE", textColor: "#1D4ED8" },
            { label: "자연", bgColor: "#DCFCE7", textColor: "#15803D" },
            { label: "경치", bgColor: "#E0E7FF", textColor: "#4338CA" },
        ],
    },
    {
        id: 8,
        name: "테라스 펫 레스토랑",
        image: "https://placehold.co/400x192",
        address: "서울시 용산구 이태원로 120",
        rating: 4.5,
        distance: "4.1km",
        airQuality: "미세먼지 보통",
        airQualityColor: "#EAB308",
        location: { lat: 37.5345, lng: 126.9946 }, // 이태원 위치
        tags: [
            { label: "레스토랑", bgColor: "#FEE2E2", textColor: "#B91C1C" },
            { label: "테라스", bgColor: "#FFEDD5", textColor: "#C2410C" },
            { label: "반려견 메뉴", bgColor: "#FEF9C3", textColor: "#A16207" },
        ],
    },
    {
        id: 9,
        name: "도그 수영장 & 피트니스",
        image: "https://placehold.co/400x192",
        address: "서울시 서초구 서초대로 301",
        rating: 4.6,
        distance: "3.2km",
        airQuality: "실내 공간",
        airQualityColor: "#22C55E",
        location: { lat: 37.4925, lng: 127.0276 }, // 서초 위치
        tags: [
            { label: "수영장", bgColor: "#DBEAFE", textColor: "#1D4ED8" },
            { label: "피트니스", bgColor: "#DCFCE7", textColor: "#15803D" },
            { label: "전문 트레이너", bgColor: "#F3E8FF", textColor: "#7E22CE" },
        ],
    },
    {
        id: 10,
        name: "강동 해변공원",
        image: "https://placehold.co/400x192",
        address: "서울시 강동구 고덕동",
        rating: 4.3,
        distance: "9.5km",
        airQuality: "미세먼지 보통",
        airQualityColor: "#EAB308",
        location: { lat: 37.5575, lng: 127.1585 }, // 강동 위치
        tags: [
            { label: "물놀이", bgColor: "#DBEAFE", textColor: "#1D4ED8" },
            { label: "넓은 공간", bgColor: "#DCFCE7", textColor: "#15803D" },
            { label: "강변", bgColor: "#E0E7FF", textColor: "#4338CA" },
        ],
    },
];

const PlaceRecPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    // 지도 중심 및 선택한 장소를 위한 상태 추가
    const [mapCenter, setMapCenter] = useState({ lat: 37.5208, lng: 127.1240 }); // 기본 중심은 올림픽 공원
    const [activeTab, setActiveTab] = useState('info'); // 'info' 또는 'reviews' 탭

    const openModal = (place: Place) => {
        setSelectedPlace(place);
        setIsModalOpen(true);
        setMapCenter(place.location);
        setActiveTab('info'); // 모달 열 때 info 탭으로 초기화
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // 모달 닫을 때 중심은 그대로 유지
    };

    return (
        <div className="relative w-screen bg-[#B9CAF5]">
            <Header />

            {/* Main Content */}
            <div className="relative w-full bg-white pt-36 pb-20">
                <div className="max-w-[1280px] mx-auto px-4">


                    {/* Main Content */}
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h1 className="text-2xl font-bold text-[#1F2937]">오늘의 추천 산책 장소</h1>
                            <p className="text-base text-[#4B5563] mt-1">반려견과 함께 방문하기 좋은 장소들을 찾아보세요</p>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="장소 검색"
                                className="w-60 h-10 px-4 rounded-xl border border-[#E5E7EB] shadow-sm text-[#9CA3AF] text-sm"
                            />
                            <button className="ml-3 bg-[#3176FF] text-white px-4 py-2 rounded text-base">검색</button>
                        </div>
                    </div>

                    {/* Featured Section */}
                    <div className="flex gap-6 mb-16">
                        {/* Big Card (KakaoMap with Marker) */}
                        <div
                            className="w-[612px] bg-white rounded-xl shadow-sm overflow-hidden"
                        >
                            <div className="relative h-[600px]">
                                {/* 수정된 부분: 선택된 장소가 있으면 그 위치를 중심으로, 없으면 기본 위치로 */}
                                <KakaoMap
                                    center={mapCenter}
                                    title={selectedPlace ? selectedPlace.name : mockPlaces[0].name}
                                    markers={selectedPlace ? [selectedPlace] : []} // 선택된 장소만 마커로 표시
                                />
                                <div className="absolute top-4 right-4 bg-white p-3 rounded-xl shadow-md flex flex-col gap-2">
                                    <div className="w-8 h-8 bg-white rounded-full shadow-sm"></div>
                                    <div className="w-8 h-8 bg-white rounded-full shadow-sm"></div>
                                    <div className="w-8 h-8 bg-white rounded-full shadow-sm"></div>
                                </div>
                                {/* 선택된 장소가 없을 때만 기본 정보 툴팁 표시 */}
                                {!selectedPlace && (
                                    <div className="absolute bottom-1/2 translate-y-1/2 left-1/3 bg-white p-3 rounded-xl shadow-md flex items-center gap-3">
                                        <img src="https://placehold.co/64x64" alt="Thumbnail" className="w-16 h-16 rounded-lg" />
                                        <div>
                                            <h2 className="text-sm font-bold text-[#1F2937]">{mockPlaces[0].name}</h2>
                                            <div className="flex items-center mt-1">
                                                <span className="text-xs text-[#374151]">{mockPlaces[0].rating}</span>
                                            </div>
                                            <p className="text-xs text-[#6B7280] mt-1">{mockPlaces[0].address}</p>
                                            <div className="flex justify-between mt-2 text-xs">
                                                <span style={{ color: mockPlaces[0].airQualityColor }}>{mockPlaces[0].airQuality}</span>
                                                <a href="#" className="text-[#3176FF]">자세히 보기</a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* 선택된 장소가 있을 때는 해당 장소 정보 툴팁 표시 */}
                                {selectedPlace && (
                                    <div className="absolute bottom-1/2 translate-y-1/2 left-1/3 bg-white p-3 rounded-xl shadow-md flex items-center gap-3">
                                        <img src={selectedPlace.image} alt={selectedPlace.name} className="w-16 h-16 rounded-lg object-cover" />
                                        <div>
                                            <h2 className="text-sm font-bold text-[#1F2937]">{selectedPlace.name}</h2>
                                            <div className="flex items-center mt-1">
                                                <span className="text-xs text-[#374151]">{selectedPlace.rating}</span>
                                            </div>
                                            <p className="text-xs text-[#6B7280] mt-1">{selectedPlace.address}</p>
                                            <div className="flex justify-between mt-2 text-xs">
                                                <span style={{ color: selectedPlace.airQualityColor }}>{selectedPlace.airQuality}</span>
                                                <span className="text-[#3176FF]">자세히 보기</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Small Cards 영역과 모달 */}
                        <div className="relative w-[612px]">
                            {/* 모달 - Small Cards 위에 겹쳐서 표시됨 */}
                            {isModalOpen && selectedPlace && (
                                <div
                                    className="relative w-full h-[800px] bg-white rounded-xl shadow-lg flex flex-col overflow-y-auto border-2 border-[#3176FF]">
                                    <button
                                        onClick={closeModal}
                                        className="absolute right-4 top-4 w-10 h-10 bg-gray-300 rounded-full flex justify-center items-center text-gray-800 hover:bg-gray-400 z-30"
                                    >
                                        <span className="text-2xl font-bold">×</span>
                                    </button>
                                    <div className="w-full h-[162px] overflow-hidden">
                                        <img src={selectedPlace.image} alt={selectedPlace.name}
                                             className="w-full h-[162px] object-cover"/>
                                    </div>

                                    {/* Tab Navigation 추가 */}
                                    <div className="flex border-b border-gray-200">
                                        <button
                                            className={`py-4 px-6 text-base font-medium ${activeTab === 'info' ? 'text-[#3176FF] border-b-2 border-[#3176FF]' : 'text-[#6B7280]'}`}
                                            onClick={() => setActiveTab('info')}
                                        >
                                            장소 정보
                                        </button>
                                        <button
                                            className={`py-4 px-6 text-base font-medium ${activeTab === 'reviews' ? 'text-[#3176FF] border-b-2 border-[#3176FF]' : 'text-[#6B7280]'}`}
                                            onClick={() => setActiveTab('reviews')}
                                        >
                                            리뷰
                                        </button>
                                    </div>

                                    {/* 탭 내용 */}
                                    {activeTab === 'info' ? (
                                        <div className="p-6 flex flex-col overflow-y-auto">
                                            {/* 기존 모달 내용 (info 탭) */}
                                            <div className="pb-4 flex">
                                                <div className="w-full flex justify-between items-center">
                                                    <h3 className="text-2xl font-bold text-[#1F2937]">{selectedPlace.name}</h3>
                                                    <div className="flex items-center">
                                                        <span
                                                            className="text-base font-medium text-[#374151]">{selectedPlace.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full pb-6">
                                                <p className="text-[#4B5563] text-base">{selectedPlace.address}</p>
                                            </div>
                                            <div className="pb-6">
                                                <div className="flex flex-wrap gap-4">
                                                    <div className="p-4 bg-[#F9FAFB] rounded-xl flex justify-between">
                                                        <div className="flex items-center mr-4">
                                                            <div className="text-[#6B7280] text-sm">거리</div>
                                                        </div>
                                                        <div className="text-[#374151] text-base font-medium">
                                                            {selectedPlace.distance}
                                                        </div>
                                                    </div>
                                                    <div className="p-4 bg-[#F9FAFB] rounded-xl flex">
                                                        <div className="flex items-center mr-4">
                                                            <div className="text-sm"
                                                                 style={{color: selectedPlace.airQualityColor}}>미세먼지
                                                            </div>
                                                        </div>
                                                        <div className="text-base font-medium"
                                                             style={{color: selectedPlace.airQualityColor}}>
                                                            {selectedPlace.airQuality.replace('미세먼지 ', '')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pt-[25px] pb-6 border-t border-[#F3F4F6]">
                                                <h4 className="text-lg font-bold text-[#1F2937] mb-4">시설 정보</h4>
                                                <div className="flex flex-wrap gap-4">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="w-8 h-8 bg-[#DBEAFE] rounded-xl flex justify-center items-center"></div>
                                                        <div className="ml-3 text-[#4B5563] text-base">산책로</div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div
                                                            className="w-8 h-8 bg-[#DCFCE7] rounded-xl flex justify-center items-center"></div>
                                                        <div className="ml-3 text-[#4B5563] text-base">주차장</div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div
                                                            className="w-8 h-8 bg-[#F3E8FF] rounded-xl flex justify-center items-center"></div>
                                                        <div className="ml-3 text-[#4B5563] text-base">급수대</div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div
                                                            className="w-8 h-8 bg-[#FFEDD5] rounded-xl flex justify-center items-center"></div>
                                                        <div className="ml-3 text-[#4B5563] text-base">화장실</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pt-[25px] pb-6 border-t border-[#F3F4F6]">
                                                <h4 className="text-lg font-bold text-[#1F2937] mb-4">추가 정보</h4>
                                                <p className="text-[#4B5563] text-base mb-4">
                                                    넓은 공원에 잘 정비된 산책로가 있어 반려견과 함께 여유로운 산책을 즐기기 좋습니다. 곳곳에 급수대와 휴식 공간이 마련되어
                                                    있어 편리합니다.
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedPlace.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 rounded-full text-xs"
                                                            style={{backgroundColor: tag.bgColor, color: tag.textColor}}
                                                        >
                            {tag.label}
                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-6 overflow-y-auto">
                                            {/* 새로운 리뷰 탭 내용 */}
                                            <ReviewComponent placeName={selectedPlace.name}/>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Small Cards (2x2 Grid) */}
                            <div className="w-full grid grid-cols-2 gap-6">
                                {mockPlaces.slice(1, 5).map((place) => (
                                    <div
                                        key={place.id}
                                        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-300 cursor-pointer"
                                        onClick={() => openModal(place)}
                                    >
                                        <img src={place.image} alt={place.name} className="w-full h-48 object-cover"/>
                                        <div className="p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-lg font-bold text-[#1F2937]">{place.name}</h3>
                                                <span className="text-base text-[#374151]">{place.rating}</span>
                                            </div>
                                            <p className="text-sm text-[#4B5563] mb-2">{place.address}</p>
                                            <p className="text-sm text-[#6B7280] mb-2">{place.distance}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {place.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 rounded-full text-xs"
                                                        style={{backgroundColor: tag.bgColor, color: tag.textColor}}
                                                    >
                                    {tag.label}
                                </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* More Recommendations */}
                    <div>
                        <h2 className="text-xl font-bold text-[#1F2937] mb-6">더 많은 추천 장소</h2>
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            {mockPlaces.slice(5).map((place) => (
                                <div
                                    key={place.id}
                                    className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
                                    onClick={() => openModal(place)}
                                >
                                    <img src={place.image} alt={place.name} className="w-full h-48 object-cover"/>
                                    <div className="p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-lg font-bold text-[#1F2937]">{place.name}</h3>
                                            <span className="text-base text-[#374151]">{place.rating}</span>
                                        </div>
                                        <p className="text-sm text-[#4B5563] mb-2">{place.address}</p>
                                        <div className="flex gap-3 mb-2">
                                            <span className="text-sm text-[#6B7280]">{place.distance}</span>
                                            <span className="text-sm" style={{color: place.airQualityColor}}>
                                                {place.airQuality}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {place.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 rounded-full text-xs"
                                                    style={{backgroundColor: tag.bgColor, color: tag.textColor}}
                                                >
                                                    {tag.label}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center mb-8">
                            <div className="flex gap-2">
                                <button
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-[#6B7280]">-
                                </button>
                                <button className="w-10 h-10 bg-[#3176FF] text-white rounded-full">1</button>
                                <button className="w-10 h-10 rounded-full text-[#374151]">2</button>
                                <button className="w-10 h-10 rounded-full text-[#374151]">3</button>
                                <button className="w-10 h-10 rounded-full text-[#374151]">4</button>
                                <button className="w-10 h-10 rounded-full text-[#374151]">5</button>
                                <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#6B7280]">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="w-full bg-[#1F2937] text-white py-12 px-20">
                <div className="max-w-[1280px] mx-auto flex justify-between">
                    <div className="w-1/4">
                        <div className="mb-4">
                            <span className="text-2xl font-bold">미세멍지</span>
                        </div>
                        <p className="text-sm text-[#9CA3AF]">반려견과 함께하는 건강한 산책</p>
                    </div>
                    <div className="w-1/4">
                        <h3 className="text-lg font-bold mb-4">서비스</h3>
                        <ul className="text-sm text-[#9CA3AF] space-y-2">
                            <li>미세먼지 정보</li>
                            <li>장소 추천</li>
                            <li>관리 가이드</li>
                            <li>통계</li>
                        </ul>
                    </div>
                    <div className="w-1/4">
                        <h3 className="text-lg font-bold mb-4">고객지원</h3>
                        <ul className="text-sm text-[#9CA3AF] space-y-2">
                            <li>자주 묻는 질문</li>
                            <li>문의하기</li>
                            <li>이용약관</li>
                            <li>개인정보처리방침</li>
                        </ul>
                    </div>
                    <div className="w-1/4">
                        <h3 className="text-lg font-bold mb-4">뉴스레터 구독</h3>
                        <p className="text-sm text-[#9CA3AF] mb-4">최신 미세먼지 정보와 강아지 건강 팁을 받아보세요.</p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="이메일 주소"
                                className="px-4 py-2 bg-[#374151] text-[#9CA3AF] rounded-l text-sm"
                            />
                            <button className="px-4 py-2 bg-[#3176FF] text-white rounded-r">구독</button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-[#374151] mt-8 pt-8 flex justify-between max-w-[1280px] mx-auto">
                    <p className="text-sm text-[#9CA3AF]">© 2025 멍멍이 미세먼지. All rights reserved.</p>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 bg-[#9CA3AF] rounded-full"></div>
                        <div className="w-8 h-8 bg-[#9CA3AF] rounded-full"></div>
                        <div className="w-8 h-8 bg-[#9CA3AF] rounded-full"></div>
                        <div className="w-8 h-8 bg-[#9CA3AF] rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceRecPage;