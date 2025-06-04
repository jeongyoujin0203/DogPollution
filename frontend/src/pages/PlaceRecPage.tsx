// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import KakaoMap from '../data/KakaoMap';
//
// const PlaceRecPage: React.FC = () => {
//     const location = useLocation();
//     // location.state에 메시지가 없으면 localStorage에서 가져옴
//     const walkWarningMessage = location.state?.walkWarningMessage || localStorage.getItem('walkWarningMessage') || '정보 없음';
//
//     return (
//         <div className="relative w-screen bg-[#B9CAF5]">
//             <KakaoMap walkWarningMessage={walkWarningMessage} />
//         </div>
//     );
// };
//
// export default PlaceRecPage;
//
// import React, { useState } from "react";
// import Header from '../components/Header';
// import KakaoMap from '../components/Map';
// import ReviewComponent from '../components/ReviewComponent';
// import OlympicPark from "../assets/OlympicPark.png";
// import BauWauCafe from "../assets/BauWauCafe.png";
//
// interface Place {
//     id: number;
//     name: string;
//     image: string;
//     address: string;
//     rating: number;
//     distance: string;
//     airQuality: string;
//     airQualityColor: string;
//     location: { lat: number; lng: number }; // 위치 정보 추가
//     tags: { label: string; bgColor: string; textColor: string }[];
// }
//
// const mockPlaces: Place[] = [
//     {
//         id: 1,
//         name: "올림픽 공원",
//         image: "https://placehold.co/294x192",
//         address: "서울시 송파구 올림픽로 424",
//         rating: 4.8,
//         distance: "1.2km",
//         airQuality: "미세먼지 좋음",
//         airQualityColor: "#22C55E",
//         location: { lat: 37.5208, lng: 127.1240 }, // 올림픽 공원 위치
//         tags: [
//             { label: "넓은 공간", bgColor: "#DBEAFE", textColor: "#1D4ED8" },
//             { label: "산책로", bgColor: "#DCFCE7", textColor: "#15803D" },
//             { label: "반려견 급수대", bgColor: "#F3E8FF", textColor: "#7E22CE" },
//         ],
//     },
//     {
//         id: 2,
//         name: "바우와우 애견카페",
//         image: "https://placehold.co/294x192",
//         address: "서울시 강남구 도산대로 158",
//         rating: 4.6,
//         distance: "0.8km",
//         airQuality: "미세먼지 보통",
//         airQualityColor: "#EAB308",
//         location: { lat: 37.5248, lng: 127.0276 }, // 강남 위치
//         tags: [
//             { label: "실내", bgColor: "#FEE2E2", textColor: "#B91C1C" },
//             { label: "카페", bgColor: "#FFEDD5", textColor: "#C2410C" },
//             { label: "놀이공간", bgColor: "#FEF9C3", textColor: "#A16207" },
//         ],
//     },
//     {
//         id: 3,
//         name: "한강공원 뚝섬지구",
//         image: "https://placehold.co/294x192",
//         address: "서울시 광진구 자양동 704-1",
//         rating: 4.5,
//         distance: "3.5km",
//         airQuality: "미세먼지 좋음",
//         airQualityColor: "#22C55E",
//         location: { lat: 37.5304, lng: 127.0663 }, // 뚝섬 위치
//         tags: [
//             { label: "강변", bgColor: "#DBEAFE", textColor: "#1D4ED8" },
//             { label: "넓은 공간", bgColor: "#DCFCE7", textColor: "#15803D" },
//             { label: "자전거길", bgColor: "#E0E7FF", textColor: "#4338CA" },
//         ],
//     },
//     {
//         id: 4,
//         name: "월드컵공원 도그런",
//         image: "https://placehold.co/294x192",
//         address: "서울시 마포구 월드컵로 243-60",
//         rating: 4.7,
//         distance: "5.2km",
//         airQuality: "미세먼지 좋음",
//         airQualityColor: "#22C55E",
//         location: { lat: 37.5717, lng: 126.8974 }, // 월드컵공원 위치
//         tags: [
//             { label: "도그런", bgColor: "#DBEAFE", textColor: "#1D4ED8" },
//             { label: "울타리", bgColor: "#DCFCE7", textColor: "#15803D" },
//             { label: "넓은 공간", bgColor: "#F3E8FF", textColor: "#7E22CE" },
//         ],
//     },
//     {
//         id: 5,
//         name: "어린이대공원 반려견 놀이터",
//         image: "https://placehold.co/294x192",
//         address: "서울시 광진구 능동로 216",
//         rating: 4.4,
//         distance: "4.3km",
//         airQuality: "미세먼지 좋음",
//         airQualityColor: "#22C55E",
//         location: { lat: 37.5478, lng: 127.0796 }, // 어린이대공원 위치
//         tags: [
//             { label: "놀이터", bgColor: "#DBEAFE", textColor: "#1D4ED8" },
//             { label: "훈련시설", bgColor: "#DCFCE7", textColor: "#15803D" },
//             { label: "급수대", bgColor: "#F3E8FF", textColor: "#7E22CE" },
//         ],
//     },
//     {
//         id: 6,
//         name: "펫스테이 호텔 & 스파",
//         image: "https://placehold.co/400x192",
//         address: "서울시 강남구 테헤란로 152",
//         rating: 4.9,
//         distance: "1.5km",
//         airQuality: "실내 공간",
//         airQualityColor: "#22C55E",
//         location: { lat: 37.5038, lng: 127.0407 }, // 테헤란로 위치
//         tags: [
//             { label: "호텔", bgColor: "#FEE2E2", textColor: "#B91C1C" },
//             { label: "스파", bgColor: "#FFEDD5", textColor: "#C2410C" },
//             { label: "미용", bgColor: "#FEF9C3", textColor: "#A16207" },
//         ],
//     },
//     {
//         id: 7,
//         name: "북한산 둘레길",
//         image: "https://placehold.co/400x192",
//         address: "서울시 강북구 우이동",
//         rating: 4.7,
//         distance: "8.7km",
//         airQuality: "미세먼지 좋음",
//         airQualityColor: "#22C55E",
//         location: { lat: 37.6636, lng: 126.9895 }, // 북한산 위치
//         tags: [
//             { label: "산책로", bgColor: "#DBEAFE", textColor: "#1D4ED8" },
//             { label: "자연", bgColor: "#DCFCE7", textColor: "#15803D" },
//             { label: "경치", bgColor: "#E0E7FF", textColor: "#4338CA" },
//         ],
//     },
//     {
//         id: 8,
//         name: "테라스 펫 레스토랑",
//         image: "https://placehold.co/400x192",
//         address: "서울시 용산구 이태원로 120",
//         rating: 4.5,
//         distance: "4.1km",
//         airQuality: "미세먼지 보통",
//         airQualityColor: "#EAB308",
//         location: { lat: 37.5345, lng: 126.9946 }, // 이태원 위치
//         tags: [
//             { label: "레스토랑", bgColor: "#FEE2E2", textColor: "#B91C1C" },
//             { label: "테라스", bgColor: "#FFEDD5", textColor: "#C2410C" },
//             { label: "반려견 메뉴", bgColor: "#FEF9C3", textColor: "#A16207" },
//         ],
//     },
//     {
//         id: 9,
//         name: "도그 수영장 & 피트니스",
//         image: "https://placehold.co/400x192",
//         address: "서울시 서초구 서초대로 301",
//         rating: 4.6,
//         distance: "3.2km",
//         airQuality: "실내 공간",
//         airQualityColor: "#22C55E",
//         location: { lat: 37.4925, lng: 127.0276 }, // 서초 위치
//         tags: [
//             { label: "수영장", bgColor: "#DBEAFE", textColor: "#1D4ED8" },
//             { label: "피트니스", bgColor: "#DCFCE7", textColor: "#15803D" },
//             { label: "전문 트레이너", bgColor: "#F3E8FF", textColor: "#7E22CE" },
//         ],
//     },
//     {
//         id: 10,
//         name: "강동 해변공원",
//         image: "https://placehold.co/400x192",
//         address: "서울시 강동구 고덕동",
//         rating: 4.3,
//         distance: "9.5km",
//         airQuality: "미세먼지 보통",
//         airQualityColor: "#EAB308",
//         location: { lat: 37.5575, lng: 127.1585 }, // 강동 위치
//         tags: [
//             { label: "물놀이", bgColor: "#DBEAFE", textColor: "#1D4ED8" },
//             { label: "넓은 공간", bgColor: "#DCFCE7", textColor: "#15803D" },
//             { label: "강변", bgColor: "#E0E7FF", textColor: "#4338CA" },
//         ],
//     },
// ];
//
// const PlaceRecPage: React.FC = () => {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
//     // 지도 중심 및 선택한 장소를 위한 상태 추가
//     const [mapCenter, setMapCenter] = useState({ lat: 37.5208, lng: 127.1240 }); // 기본 중심은 올림픽 공원
//     const [activeTab, setActiveTab] = useState('info'); // 'info' 또는 'reviews' 탭
//
//     const openModal = (place: Place) => {
//         setSelectedPlace(place);
//         setIsModalOpen(true);
//         setMapCenter(place.location);
//         setActiveTab('info'); // 모달 열 때 info 탭으로 초기화
//     };
//
//     const closeModal = () => {
//         setIsModalOpen(false);
//         // 모달 닫을 때 중심은 그대로 유지
//     };
//
//     return (
//         <div className="relative w-screen bg-[#B9CAF5]">
//             <Header />
//
//             {/* Main Content */}
//             <div className="relative w-full bg-white pt-11 pb-20">
//                 <div className="max-w-[1280px] mx-auto px-4">
//
//
//                     {/* Main Content */}
//                     <div className="flex justify-between items-center mb-12">
//                         <div>
//                             <h1 className="text-2xl font-bold text-[#1F2937]">오늘의 추천 산책 장소</h1>
//                             <p className="text-base text-[#4B5563] mt-1">반려견과 함께 방문하기 좋은 장소들을 찾아보세요</p>
//                         </div>
//                         <div className="flex items-center">
//                             <input
//                                 type="text"
//                                 placeholder="장소 검색"
//                                 className="w-60 h-10 px-4 rounded-xl border border-[#E5E7EB] shadow-sm text-[#9CA3AF] text-sm"
//                             />
//                             <button className="ml-3 bg-[#3176FF] text-white px-4 py-2 rounded text-base">검색</button>
//                         </div>
//                     </div>
//
//                     {/* Featured Section */}
//                     <div className="flex gap-6 mb-16">
//                         {/* Big Card (KakaoMap with Marker) */}
//                         <div
//                             className="w-[612px] bg-white rounded-xl shadow-sm overflow-hidden"
//                         >
//                             <div className="relative h-[600px]">
//                                 {/* 수정된 부분: 선택된 장소가 있으면 그 위치를 중심으로, 없으면 기본 위치로 */}
//                                 <KakaoMap
//                                     center={mapCenter}
//                                     title={selectedPlace ? selectedPlace.name : mockPlaces[0].name}
//                                     markers={selectedPlace ? [selectedPlace] : []} // 선택된 장소만 마커로 표시
//                                 />
//                                 <div className="absolute top-4 right-4 bg-white p-3 rounded-xl shadow-md flex flex-col gap-2">
//                                     <div className="w-8 h-8 bg-white rounded-full shadow-sm"></div>
//                                     <div className="w-8 h-8 bg-white rounded-full shadow-sm"></div>
//                                     <div className="w-8 h-8 bg-white rounded-full shadow-sm"></div>
//                                 </div>
//                                 {/* 선택된 장소가 없을 때만 기본 정보 툴팁 표시 */}
//                                 {!selectedPlace && (
//                                     <div className="absolute bottom-1/2 translate-y-1/2 left-1/3 bg-white p-3 rounded-xl shadow-md flex items-center gap-3">
//                                         <img src="https://placehold.co/64x64" alt="Thumbnail" className="w-16 h-16 rounded-lg" />
//                                         <div>
//                                             <h2 className="text-sm font-bold text-[#1F2937]">{mockPlaces[0].name}</h2>
//                                             <div className="flex items-center mt-1">
//                                                 <span className="text-xs text-[#374151]">{mockPlaces[0].rating}</span>
//                                             </div>
//                                             <p className="text-xs text-[#6B7280] mt-1">{mockPlaces[0].address}</p>
//                                             <div className="flex justify-between mt-2 text-xs">
//                                                 <span style={{ color: mockPlaces[0].airQualityColor }}>{mockPlaces[0].airQuality}</span>
//                                                 <a href="#" className="text-[#3176FF]">자세히 보기</a>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//                                 {/* 선택된 장소가 있을 때는 해당 장소 정보 툴팁 표시 */}
//                                 {selectedPlace && (
//                                     <div className="absolute bottom-1/2 translate-y-1/2 left-1/3 bg-white p-3 rounded-xl shadow-md flex items-center gap-3">
//                                         <img src={selectedPlace.image} alt={selectedPlace.name} className="w-16 h-16 rounded-lg object-cover" />
//                                         <div>
//                                             <h2 className="text-sm font-bold text-[#1F2937]">{selectedPlace.name}</h2>
//                                             <div className="flex items-center mt-1">
//                                                 <span className="text-xs text-[#374151]">{selectedPlace.rating}</span>
//                                             </div>
//                                             <p className="text-xs text-[#6B7280] mt-1">{selectedPlace.address}</p>
//                                             <div className="flex justify-between mt-2 text-xs">
//                                                 <span style={{ color: selectedPlace.airQualityColor }}>{selectedPlace.airQuality}</span>
//                                                 <span className="text-[#3176FF]">자세히 보기</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//
//                         {/* Small Cards 영역과 모달 */}
//                         <div className="relative w-[612px]">
//                             {/* 모달 - Small Cards 위에 겹쳐서 표시됨 */}
//                             {isModalOpen && selectedPlace && (
//                                 <div
//                                     className="relative w-full h-[800px] bg-white rounded-xl shadow-lg flex flex-col overflow-y-auto border-2 border-[#3176FF]">
//                                     <button
//                                         onClick={closeModal}
//                                         className="absolute right-4 top-4 w-10 h-10 bg-gray-300 rounded-full flex justify-center items-center text-gray-800 hover:bg-gray-400 z-30"
//                                     >
//                                         <span className="text-2xl font-bold">×</span>
//                                     </button>
//                                     <div className="w-full h-[162px] overflow-hidden">
//                                         <img src={selectedPlace.image} alt={selectedPlace.name}
//                                              className="w-full h-[162px] object-cover"/>
//                                     </div>
//
//                                     {/* Tab Navigation 추가 */}
//                                     <div className="flex border-b border-gray-200">
//                                         <button
//                                             className={`py-4 px-6 text-base font-medium ${activeTab === 'info' ? 'text-[#3176FF] border-b-2 border-[#3176FF]' : 'text-[#6B7280]'}`}
//                                             onClick={() => setActiveTab('info')}
//                                         >
//                                             장소 정보
//                                         </button>
//                                         <button
//                                             className={`py-4 px-6 text-base font-medium ${activeTab === 'reviews' ? 'text-[#3176FF] border-b-2 border-[#3176FF]' : 'text-[#6B7280]'}`}
//                                             onClick={() => setActiveTab('reviews')}
//                                         >
//                                             리뷰
//                                         </button>
//                                     </div>
//
//                                     {/* 탭 내용 */}
//                                     {activeTab === 'info' ? (
//                                         <div className="p-6 flex flex-col overflow-y-auto">
//                                             {/* 기존 모달 내용 (info 탭) */}
//                                             <div className="pb-4 flex">
//                                                 <div className="w-full flex justify-between items-center">
//                                                     <h3 className="text-2xl font-bold text-[#1F2937]">{selectedPlace.name}</h3>
//                                                     <div className="flex items-center">
//                                                         <span
//                                                             className="text-base font-medium text-[#374151]">{selectedPlace.rating}</span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="w-full pb-6">
//                                                 <p className="text-[#4B5563] text-base">{selectedPlace.address}</p>
//                                             </div>
//                                             <div className="pb-6">
//                                                 <div className="flex flex-wrap gap-4">
//                                                     <div className="p-4 bg-[#F9FAFB] rounded-xl flex justify-between">
//                                                         <div className="flex items-center mr-4">
//                                                             <div className="text-[#6B7280] text-sm">거리</div>
//                                                         </div>
//                                                         <div className="text-[#374151] text-base font-medium">
//                                                             {selectedPlace.distance}
//                                                         </div>
//                                                     </div>
//                                                     <div className="p-4 bg-[#F9FAFB] rounded-xl flex">
//                                                         <div className="flex items-center mr-4">
//                                                             <div className="text-sm"
//                                                                  style={{color: selectedPlace.airQualityColor}}>미세먼지
//                                                             </div>
//                                                         </div>
//                                                         <div className="text-base font-medium"
//                                                              style={{color: selectedPlace.airQualityColor}}>
//                                                             {selectedPlace.airQuality.replace('미세먼지 ', '')}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="pt-[25px] pb-6 border-t border-[#F3F4F6]">
//                                                 <h4 className="text-lg font-bold text-[#1F2937] mb-4">시설 정보</h4>
//                                                 <div className="flex flex-wrap gap-4">
//                                                     <div className="flex items-center">
//                                                         <div
//                                                             className="w-8 h-8 bg-[#DBEAFE] rounded-xl flex justify-center items-center"></div>
//                                                         <div className="ml-3 text-[#4B5563] text-base">산책로</div>
//                                                     </div>
//                                                     <div className="flex items-center">
//                                                         <div
//                                                             className="w-8 h-8 bg-[#DCFCE7] rounded-xl flex justify-center items-center"></div>
//                                                         <div className="ml-3 text-[#4B5563] text-base">주차장</div>
//                                                     </div>
//                                                     <div className="flex items-center">
//                                                         <div
//                                                             className="w-8 h-8 bg-[#F3E8FF] rounded-xl flex justify-center items-center"></div>
//                                                         <div className="ml-3 text-[#4B5563] text-base">급수대</div>
//                                                     </div>
//                                                     <div className="flex items-center">
//                                                         <div
//                                                             className="w-8 h-8 bg-[#FFEDD5] rounded-xl flex justify-center items-center"></div>
//                                                         <div className="ml-3 text-[#4B5563] text-base">화장실</div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="pt-[25px] pb-6 border-t border-[#F3F4F6]">
//                                                 <h4 className="text-lg font-bold text-[#1F2937] mb-4">추가 정보</h4>
//                                                 <p className="text-[#4B5563] text-base mb-4">
//                                                     넓은 공원에 잘 정비된 산책로가 있어 반려견과 함께 여유로운 산책을 즐기기 좋습니다. 곳곳에 급수대와 휴식 공간이 마련되어
//                                                     있어 편리합니다.
//                                                 </p>
//                                                 <div className="flex flex-wrap gap-2">
//                                                     {selectedPlace.tags.map((tag, index) => (
//                                                         <span
//                                                             key={index}
//                                                             className="px-2 py-1 rounded-full text-xs"
//                                                             style={{backgroundColor: tag.bgColor, color: tag.textColor}}
//                                                         >
//                             {tag.label}
//                         </span>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <div className="p-6 overflow-y-auto">
//                                             {/* 새로운 리뷰 탭 내용 */}
//                                             <ReviewComponent placeName={selectedPlace.name}/>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//
//                             {/* Small Cards (2x2 Grid) */}
//                             <div className="w-full grid grid-cols-2 gap-6">
//                                 {mockPlaces.slice(1, 5).map((place) => (
//                                     <div
//                                         key={place.id}
//                                         className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-300 cursor-pointer"
//                                         onClick={() => openModal(place)}
//                                     >
//                                         <img src={place.image} alt={place.name} className="w-full h-48 object-cover"/>
//                                         <div className="p-4">
//                                             <div className="flex justify-between items-center mb-2">
//                                                 <h3 className="text-lg font-bold text-[#1F2937]">{place.name}</h3>
//                                                 <span className="text-base text-[#374151]">{place.rating}</span>
//                                             </div>
//                                             <p className="text-sm text-[#4B5563] mb-2">{place.address}</p>
//                                             <p className="text-sm text-[#6B7280] mb-2">{place.distance}</p>
//                                             <div className="flex flex-wrap gap-2">
//                                                 {place.tags.map((tag, index) => (
//                                                     <span
//                                                         key={index}
//                                                         className="px-2 py-1 rounded-full text-xs"
//                                                         style={{backgroundColor: tag.bgColor, color: tag.textColor}}
//                                                     >
//                                     {tag.label}
//                                 </span>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//         </div>
//     );
// };
//
// export default PlaceRecPage;
// import React, { useState, useEffect, useRef } from "react";
// import Header from '../components/Header';
// import ReviewComponent from '../components/ReviewComponent';
// import { useLocation } from 'react-router-dom';
//
// interface Place {
//     id: string; // Kakao API가 문자열 ID를 반환하므로 string으로 변경
//     name: string;
//     image?: string; // Kakao API는 이미지를 제공하지 않을 수 있음
//     address: string;
//     rating?: number; // Kakao API는 평점을 제공하지 않을 수 있음
//     distance?: string;
//     airQuality?: string;
//     airQualityColor?: string;
//     lat: number;
//     lng: number;
//     category?: string;
//     tags?: { label: string; bgColor: string; textColor: string }[];
//
//     phone?: string;
//     website?: string;
//     openingHours?: string[];
//     description?: string;
//     facilities?: string[];
//     reviews?: {
//         username: string;
//         rating: number;
//         comment: string;
//         date: string;
//     }[];
// }
//
// // 기본 태그 생성 함수
// const generateTags = (place: Place): { label: string; bgColor: string; textColor: string }[] => {
//     const tags = [];
//
//     // 카테고리에 따라 태그 생성
//     if (place.category) {
//         tags.push({ label: place.category, bgColor: "#DBEAFE", textColor: "#1D4ED8" });
//     }
//
//     // 주소에 따라 태그 생성
//     if (place.address.includes('공원')) {
//         tags.push({ label: "공원", bgColor: "#DCFCE7", textColor: "#15803D" });
//     } else if (place.address.includes('카페')) {
//         tags.push({ label: "카페", bgColor: "#FEE2E2", textColor: "#B91C1C" });
//     }
//
//     // 기본 태그 추가
//     if (place.name.includes('공원') || place.name.includes('산책')) {
//         tags.push({ label: "산책로", bgColor: "#DCFCE7", textColor: "#15803D" });
//     } else if (place.name.includes('카페') || place.name.includes('호텔')) {
//         tags.push({ label: "실내", bgColor: "#FEE2E2", textColor: "#B91C1C" });
//     }
//
//     return tags;
// };
//
// const PlaceRecPage: React.FC = () => {
//     const location = useLocation();
//     const walkWarningMessage = location.state?.walkWarningMessage || localStorage.getItem('walkWarningMessage') || '정보 없음';
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
//     const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 }); // 서울 중심
//     const [activeTab, setActiveTab] = useState('info');
//     const [searchKeyword, setSearchKeyword] = useState('');
//     const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
//
//     // 카카오맵 관련 상태 및 ref
//     const mapRef = useRef<HTMLDivElement>(null);
//     const mapInstanceRef = useRef<any>(null);
//     const [mapLoaded, setMapLoaded] = useState(false);
//     const [indoorRecommendedPlaces, setIndoorRecommendedPlaces] = useState<Place[]>([]);
//     const [outdoorRecommendedPlaces, setOutdoorRecommendedPlaces] = useState<Place[]>([]);
//
//     // 마커 표시 함수
//     const displayMarkers = (places: Place[]) => {
//         if (!mapInstanceRef.current || !window.kakao) return;
//
//         // 기존 마커 삭제
//         const map = mapInstanceRef.current;
//         map.getLevel();
//
//         // 새 마커 생성
//         places.forEach((place) => {
//             const markerPosition = new window.kakao.maps.LatLng(place.lat, place.lng);
//             const marker = new window.kakao.maps.Marker({
//                 position: markerPosition,
//                 map: map
//             });
//
//             // 인포윈도우 생성
//             const infowindow = new window.kakao.maps.InfoWindow({
//                 content: `<div style="padding:5px;font-size:12px;">${place.name}</div>`
//             });
//
//             // 마커 클릭 이벤트
//             window.kakao.maps.event.addListener(marker, 'click', function() {
//                 // 인포윈도우 표시
//                 infowindow.open(map, marker);
//
//                 // 장소 선택 및 모달 열기
//                 const placeWithTags = {
//                     ...place,
//                     tags: place.tags || generateTags(place),
//                     airQuality: place.airQuality || (walkWarningMessage.includes('주의') ? '미세먼지 나쁨' : '미세먼지 좋음'),
//                     airQualityColor: place.airQualityColor || (walkWarningMessage.includes('주의') ? '#EF4444' : '#22C55E'),
//                     rating: place.rating || 4.5,
//                     image: place.image || 'https://placehold.co/294x192',
//                     distance: place.distance || '알 수 없음'
//                 };
//                 setSelectedPlace(placeWithTags);
//                 setIsModalOpen(true);
//                 setMapCenter({ lat: place.lat, lng: place.lng });
//             });
//         });
//
//         // 지도 범위 재설정
//         if (places.length > 0) {
//             const bounds = new window.kakao.maps.LatLngBounds();
//             places.forEach(place => {
//                 bounds.extend(new window.kakao.maps.LatLng(place.lat, place.lng));
//             });
//             map.setBounds(bounds);
//         }
//     };
//
//     // 실내/실외 장소 검색 함수
//     const searchIndoorOutdoorPlaces = () => {
//         if (!window.kakao || !mapInstanceRef.current) return;
//         if (!window.kakao.maps.services || !window.kakao.maps.services.Places) {
//             console.error("Kakao Maps Places 라이브러리가 로드되지 않았습니다.");
//             return;
//         }
//
//         const ps = new window.kakao.maps.services.Places();
//
//         let indoorResults: Place[] = [];
//         let outdoorResults: Place[] = [];
//
//         const indoorKeywords = ['애견 카페', '애견 샵', '애견 호텔', '애견 미용', '반려동물 카페', '강아지 놀이터', '실내 놀이터', '펫 프렌들리 카페'];
//         const outdoorKeywords = ['공원', '강변공원', '반려견 산책', '도그런', '한강공원', '산책로', '숲길', '반려동물 공원'];
//
//         const searchKeywords = (keywords: string[], isIndoor: boolean) => {
//             return Promise.all(
//                 keywords.map(
//                     (keyword) =>
//                         new Promise<void>((resolve) => {
//                             ps.keywordSearch(keyword, (data: any[], status: string) => {
//                                 if (status === window.kakao.maps.services.Status.OK) {
//                                     const filtered = data
//                                         .filter((place) =>
//                                             (place.road_address_name || place.address_name).includes('서울')
//                                         )
//                                         .map((place) => ({
//                                             id: place.id,
//                                             name: place.place_name,
//                                             address: place.road_address_name || place.address_name,
//                                             category: place.category_group_name,
//                                             lat: parseFloat(place.y),
//                                             lng: parseFloat(place.x),
//                                             airQuality: isIndoor ? '실내 공간' : (walkWarningMessage.includes('주의') ? '미세먼지 나쁨' : '미세먼지 좋음'),
//                                             airQualityColor: isIndoor ? '#22C55E' : (walkWarningMessage.includes('주의') ? '#EF4444' : '#22C55E'),
//                                             rating: 4.5,
//                                             image: 'https://placehold.co/294x192',
//                                             distance: '알 수 없음',
//                                             tags: isIndoor ?
//                                                 [
//                                                     { label: "실내", bgColor: "#FEE2E2", textColor: "#B91C1C" },
//                                                     { label: keyword.includes('카페') ? "카페" : "반려견 시설", bgColor: "#FFEDD5", textColor: "#C2410C" }
//                                                 ] :
//                                                 [
//                                                     { label: "야외", bgColor: "#DBEAFE", textColor: "#1D4ED8" },
//                                                     { label: "산책로", bgColor: "#DCFCE7", textColor: "#15803D" }
//                                                 ]
//                                         }));
//                                     if (isIndoor) {
//                                         indoorResults = [...indoorResults, ...filtered];
//                                     } else {
//                                         outdoorResults = [...outdoorResults, ...filtered];
//                                     }
//                                 }
//                                 resolve();
//                             });
//                         })
//                 )
//             );
//         };
//
//         Promise.all([searchKeywords(indoorKeywords, true), searchKeywords(outdoorKeywords, false)]).then(() => {
//             // 중복 제거 후 상위 4개씩 선택
//             const uniqueIndoor = Array.from(new Map(indoorResults.map((i) => [i.id, i])).values()).slice(0, 4);
//             const uniqueOutdoor = Array.from(new Map(outdoorResults.map((i) => [i.id, i])).values()).slice(0, 4);
//
//             console.log("실내 장소:", uniqueIndoor);
//             console.log("실외 장소:", uniqueOutdoor);
//
//             setIndoorRecommendedPlaces(uniqueIndoor);
//             setOutdoorRecommendedPlaces(uniqueOutdoor);
//
//             // 미세먼지 상태에 따라 기본 표시 장소 결정
//             if (walkWarningMessage.includes('주의')) {
//                 // 미세먼지 나쁨 - 실내 장소 추천
//                 displayMarkers(uniqueIndoor);
//             } else {
//                 // 미세먼지 좋음 - 실외 장소 추천
//                 displayMarkers(uniqueOutdoor);
//             }
//         });
//     };
//
//     // Kakao 지도 스크립트 로드
//     useEffect(() => {
//         const script = document.createElement('script');
//         script.async = true;
//         script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&autoload=false&libraries=services`;
//         document.head.appendChild(script);
//
//         script.onload = () => {
//             window.kakao.maps.load(() => {
//                 console.log('Kakao Maps loaded successfully');
//                 setMapLoaded(true);
//             });
//         };
//
//         return () => {
//             // 스크립트 제거
//             if (script.parentNode) {
//                 document.head.removeChild(script);
//             }
//         };
//     }, []);
//
//     // 맵 초기화 및 추천 장소 검색
//     useEffect(() => {
//         if (!mapLoaded || !mapRef.current) return;
//
//         const kakao = window.kakao;
//         const map = new kakao.maps.Map(mapRef.current, {
//             center: new kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
//             level: 5,
//         });
//         mapInstanceRef.current = map;
//
//         searchIndoorOutdoorPlaces();
//     }, [mapLoaded]);
//
//     // 모달 관련 함수
//     const openModal = async (place: Place) => {
//         setSelectedPlace(place);
//         setIsModalOpen(true);
//         setMapCenter({ lat: place.lat, lng: place.lng });
//         setActiveTab('info');
//
//         try {
//             const details = await getPlaceDetails(place.id);
//             if (details) {
//                 // 상세 정보가 있으면 선택된 장소 업데이트
//                 const enhancedPlace: Place = {
//                     ...place,
//                     phone: details.phone || '정보 없음',
//                     website: details.homepage || '정보 없음',
//                     openingHours: details.opening_hours || [],
//                     description: details.description || '상세 설명이 없습니다.',
//                     // 추가 정보들...
//                     tags: place.tags || generateTags(place)
//                 };
//                 setSelectedPlace(enhancedPlace);
//             }
//         } catch (error) {
//             console.error("장소 상세 정보를 불러오는 중 오류 발생:", error);
//         }
//     };
//
//     const closeModal = () => {
//         setIsModalOpen(false);
//     };
//
//     // 장소 검색 함수
//     const handleSearch = () => {
//         if (!searchKeyword.trim() || !window.kakao || !window.kakao.maps.services) return;
//
//         const ps = new window.kakao.maps.services.Places();
//         ps.keywordSearch(searchKeyword, (data: any[], status: string) => {
//             if (status === window.kakao.maps.services.Status.OK) {
//                 const results = data.map(place => ({
//                     id: place.id,
//                     name: place.place_name,
//                     address: place.road_address_name || place.address_name,
//                     category: place.category_group_name,
//                     lat: parseFloat(place.y),
//                     lng: parseFloat(place.x),
//                     tags: generateTags({
//                         id: place.id,
//                         name: place.place_name,
//                         address: place.road_address_name || place.address_name,
//                         category: place.category_group_name,
//                         lat: parseFloat(place.y),
//                         lng: parseFloat(place.x)
//                     }),
//                     airQuality: walkWarningMessage.includes('주의') ? '미세먼지 나쁨' : '미세먼지 좋음',
//                     airQualityColor: walkWarningMessage.includes('주의') ? '#EF4444' : '#22C55E',
//                     rating: 4.5,
//                     image: 'https://placehold.co/294x192',
//                     distance: '알 수 없음'
//                 }));
//
//                 setFilteredPlaces(results);
//                 displayMarkers(results);
//             }
//         });
//     };
//
//     // 장소 상세 정보 가져오기 함수
//     const getPlaceDetails = async (placeId: string): Promise<any> => {
//         if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
//             console.error("Kakao Maps API가 로드되지 않았습니다.");
//             return null;
//         }
//
//         return new Promise((resolve) => {
//             const ps = new window.kakao.maps.services.Places();
//
//             ps.getDetails({ placeId: placeId }, (result: any, status: string) => {
//                 if (status === window.kakao.maps.services.Status.OK) {
//                     // 상세 정보 결과 처리
//                     resolve(result[0]);
//                 } else {
//                     console.error("장소 상세 정보를 가져오는데 실패했습니다:", status);
//                     resolve(null);
//                 }
//             });
//         });
//     };
//
//     // 추천 장소 표시
//     const recommendedPlaces = walkWarningMessage.includes('주의')
//         ? indoorRecommendedPlaces // 미세먼지 나쁨 - 실내 장소
//         : outdoorRecommendedPlaces; // 미세먼지 좋음 - 실외 장소
//
//     return (
//         <div className="relative w-screen bg-[#B9CAF5]">
//             <Header />
//
//             {/* Main Content */}
//             <div className="relative w-full bg-white pt-11 pb-20">
//                 <div className="max-w-[1280px] mx-auto px-4">
//
//                     {/* Main Content */}
//                     <div className="flex justify-between items-center mb-12">
//                         <div>
//                             <h1 className="text-2xl font-bold text-[#1F2937]">
//                                 {walkWarningMessage.includes('주의')
//                                     ? '미세먼지가 있어요! 오늘은 실내 장소를 추천합니다'
//                                     : '맑은 날씨! 오늘은 실외 산책 장소를 추천합니다'}
//                             </h1>
//                             <p className="text-base text-[#4B5563] mt-1">
//                                 {walkWarningMessage.includes('주의')
//                                     ? '반려견과 함께 방문하기 좋은 실내 장소들입니다'
//                                     : '반려견과 함께 산책하기 좋은 실외 장소들입니다'}
//                             </p>
//                         </div>
//                         <div className="flex items-center">
//                             <input
//                                 type="text"
//                                 placeholder="장소 검색"
//                                 className="w-60 h-10 px-4 rounded-xl border border-[#E5E7EB] shadow-sm text-[#9CA3AF] text-sm"
//                                 value={searchKeyword}
//                                 onChange={(e) => setSearchKeyword(e.target.value)}
//                                 onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//                             />
//                             <button
//                                 className="ml-3 bg-[#3176FF] text-white px-4 py-2 rounded text-base"
//                                 onClick={handleSearch}
//                             >
//                                 검색
//                             </button>
//                         </div>
//                     </div>
//
//                     {/* Featured Section */}
//                     <div className="flex gap-6 mb-16">
//                         {/* Big Card (KakaoMap with Marker) */}
//                         <div className="w-[612px] bg-white rounded-xl shadow-sm overflow-hidden">
//                             <div className="relative h-[600px]" ref={mapRef}>
//                                 {/* 맵이 여기에 렌더링됩니다 */}
//
//                                 <div className="absolute top-4 right-4 bg-white p-3 rounded-xl shadow-md flex flex-col gap-2">
//                                     <button
//                                         className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center"
//                                         onClick={() => walkWarningMessage.includes('주의')
//                                             ? displayMarkers(indoorRecommendedPlaces)
//                                             : displayMarkers(outdoorRecommendedPlaces)}
//                                     >
//                                         🔄
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//
//                         {/* Small Cards 영역과 모달 */}
//                         <div className="relative w-[612px]">
//                             {/* 모달 */}
//                             {isModalOpen && selectedPlace && (
//                                 <div className="relative w-full h-[800px] bg-white rounded-xl shadow-lg flex flex-col overflow-y-auto border-2 border-[#3176FF]">
//                                     {/* 모달 내용 (동일하게 유지) */}
//                                     <button
//                                         onClick={closeModal}
//                                         className="absolute right-4 top-4 w-10 h-10 bg-gray-300 rounded-full flex justify-center items-center text-gray-800 hover:bg-gray-400 z-30"
//                                     >
//                                         <span className="text-2xl font-bold">×</span>
//                                     </button>
//
//                                     <div className="w-full h-[162px] overflow-hidden">
//                                         <img src={selectedPlace.image} alt={selectedPlace.name}
//                                              className="w-full h-[162px] object-cover"/>
//                                     </div>
//
//                                     {/* Tab Navigation */}
//                                     <div className="flex border-b border-gray-200">
//                                         <button
//                                             className={`py-4 px-6 text-base font-medium ${activeTab === 'info' ? 'text-[#3176FF] border-b-2 border-[#3176FF]' : 'text-[#6B7280]'}`}
//                                             onClick={() => setActiveTab('info')}
//                                         >
//                                             장소 정보
//                                         </button>
//                                         <button
//                                             className={`py-4 px-6 text-base font-medium ${activeTab === 'reviews' ? 'text-[#3176FF] border-b-2 border-[#3176FF]' : 'text-[#6B7280]'}`}
//                                             onClick={() => setActiveTab('reviews')}
//                                         >
//                                             리뷰
//                                         </button>
//                                     </div>
//
//                                     {/* 탭 내용 */}
//                                     {activeTab === 'info' ? (
//                                         <div className="p-6 flex flex-col overflow-y-auto">
//                                             {/* 장소 정보 탭 내용 */}
//                                             <div className="pb-4 flex">
//                                                 <div className="w-full flex justify-between items-center">
//                                                     <h3 className="text-2xl font-bold text-[#1F2937]">{selectedPlace.name}</h3>
//                                                     <div className="flex items-center">
//                                                         <span className="text-base font-medium text-[#374151]">{selectedPlace.rating}</span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="w-full pb-6">
//                                                 <p className="text-[#4B5563] text-base">{selectedPlace.address}</p>
//                                                 {/* 전화번호 표시 */}
//                                                 {selectedPlace.phone && selectedPlace.phone !== '정보 없음' && (
//                                                     <p className="text-[#4B5563] text-base mt-2">
//                                                         <span className="font-medium">전화번호:</span> {selectedPlace.phone}
//                                                     </p>
//                                                 )}
//
//                                                 {/* 웹사이트 표시 */}
//                                                 {selectedPlace.website && selectedPlace.website !== '정보 없음' && (
//                                                     <p className="text-[#4B5563] text-base mt-2">
//                                                         <span className="font-medium">웹사이트:</span>{' '}
//                                                         <a
//                                                             href={selectedPlace.website}
//                                                             target="_blank"
//                                                             rel="noopener noreferrer"
//                                                             className="text-blue-600 hover:underline"
//                                                         >
//                                                             {selectedPlace.website}
//                                                         </a>
//                                                     </p>
//                                                 )}
//                                             </div>
//                                             {/* 영업시간 표시 */}
//                                             {selectedPlace.openingHours && selectedPlace.openingHours.length > 0 && (
//                                                 <div className="pb-6">
//                                                     <h4 className="text-lg font-bold text-[#1F2937] mb-2">영업시간</h4>
//                                                     <ul className="list-disc pl-5">
//                                                         {selectedPlace.openingHours.map((hours, index) => (
//                                                             <li key={index} className="text-[#4B5563] text-base">{hours}</li>
//                                                         ))}
//                                                     </ul>
//                                                 </div>
//                                             )}
//                                             <div className="pb-6">
//                                                 <div className="flex flex-wrap gap-4">
//                                                     {selectedPlace.distance && (
//                                                         <div className="p-4 bg-[#F9FAFB] rounded-xl flex justify-between">
//                                                             <div className="flex items-center mr-4">
//                                                                 <div className="text-[#6B7280] text-sm">거리</div>
//                                                             </div>
//                                                             <div className="text-[#374151] text-base font-medium">
//                                                                 {selectedPlace.distance}
//                                                             </div>
//                                                         </div>
//                                                     )}
//                                                     {selectedPlace.airQuality && (
//                                                         <div className="p-4 bg-[#F9FAFB] rounded-xl flex">
//                                                             <div className="flex items-center mr-4">
//                                                                 <div className="text-sm"
//                                                                      style={{color: selectedPlace.airQualityColor}}>미세먼지
//                                                                 </div>
//                                                             </div>
//                                                             <div className="text-base font-medium"
//                                                                  style={{color: selectedPlace.airQualityColor}}>
//                                                                 {selectedPlace.airQuality.includes('미세먼지')
//                                                                     ? selectedPlace.airQuality.replace('미세먼지 ', '')
//                                                                     : selectedPlace.airQuality}
//                                                             </div>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//
//                                             {/* 태그 표시 */}
//                                             <div className="pt-[25px] pb-6 border-t border-[#F3F4F6]">
//                                                 <h4 className="text-lg font-bold text-[#1F2937] mb-4">추가 정보</h4>
//                                                 <p className="text-[#4B5563] text-base mb-4">
//                                                     {walkWarningMessage.includes('주의') && selectedPlace.tags?.some(tag => tag.label === "실내")
//                                                         ? "실내 공간으로 미세먼지 걱정 없이 반려견과 함께 시간을 보낼 수 있습니다."
//                                                         : "넓은 공간에서 반려견과 함께 여유로운 산책을 즐기기 좋습니다."}
//                                                 </p>
//                                                 <div className="flex flex-wrap gap-2">
//                                                     {selectedPlace.tags?.map((tag, index) => (
//                                                         <span
//                                                             key={index}
//                                                             className="px-2 py-1 rounded-full text-xs"
//                                                             style={{backgroundColor: tag.bgColor, color: tag.textColor}}
//                                                         >
//                                                             {tag.label}
//                                                         </span>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <div className="p-6 overflow-y-auto">
//                                             <ReviewComponent placeName={selectedPlace.name}/>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//
//                             {/* Small Cards (2x2 Grid) - API에서 가져온 추천 장소 표시 */}
//                             <div className="w-full grid grid-cols-2 gap-6">
//                                 {recommendedPlaces.slice(0, 4).map((place) => (
//                                     <div
//                                         key={place.id}
//                                         className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-300 cursor-pointer"
//                                         onClick={() => openModal(place)}
//                                     >
//                                         <img src={place.image} alt={place.name} className="w-full h-48 object-cover"/>
//                                         <div className="p-4">
//                                             <div className="flex justify-between items-center mb-2">
//                                                 <h3 className="text-lg font-bold text-[#1F2937]">{place.name}</h3>
//                                                 <span className="text-base text-[#374151]">{place.rating}</span>
//                                             </div>
//                                             <p className="text-sm text-[#4B5563] mb-2">{place.address}</p>
//                                             <div className="flex flex-wrap gap-2">
//                                                 {place.tags?.map((tag, index) => (
//                                                     <span
//                                                         key={index}
//                                                         className="px-2 py-1 rounded-full text-xs"
//                                                         style={{backgroundColor: tag.bgColor, color: tag.textColor}}
//                                                     >
//                                                         {tag.label}
//                                                     </span>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default PlaceRecPage;

import React, { useState, useEffect, useRef } from "react";
import Header from '../components/Header';
import ReviewComponent from '../components/ReviewComponent';
import { useLocation } from 'react-router-dom';

interface Place {
    id: string;
    name: string;
    image?: string;
    address: string;
    rating?: number;
    distance?: string;
    airQuality?: string;
    airQualityColor?: string;
    lat: number;
    lng: number;
    category?: string;
    tags?: { label: string; bgColor: string; textColor: string }[];
    phone?: string;
    website?: string;
    openingHours?: string[];
    description?: string;
    facilities?: string[];
    reviews?: {
        username: string;
        rating: number;
        comment: string;
        date: string;
    }[];
}

// 병원 및 의료시설 필터링을 위한 키워드
const MEDICAL_KEYWORDS = ['병원', '의원', '클리닉', '치료', '수의', '동물병원', '의료'];

// 부적절한 장소 키워드 (산책과 관련 없는 곳들)
const INAPPROPRIATE_KEYWORDS = ['마트', '편의점', '은행', '약국', '주유소', '세차장', '정비소', '교', '백화점', '미용'];

// 기본 태그 생성 함수
const generateTags = (place: Place): { label: string; bgColor: string; textColor: string }[] => {
    const tags = [];

    // 카테고리에 따라 태그 생성
    if (place.category) {
        tags.push({ label: place.category, bgColor: "#DBEAFE", textColor: "#1D4ED8" });
    }

    // 주소에 따라 태그 생성
    if (place.address.includes('공원')) {
        tags.push({ label: "공원", bgColor: "#DCFCE7", textColor: "#15803D" });
    } else if (place.address.includes('카페')) {
        tags.push({ label: "카페", bgColor: "#FEE2E2", textColor: "#B91C1C" });
    }

    // 기본 태그 추가
    if (place.name.includes('공원') || place.name.includes('산책')) {
        tags.push({ label: "산책로", bgColor: "#DCFCE7", textColor: "#15803D" });
    } else if (place.name.includes('카페') || place.name.includes('호텔')) {
        tags.push({ label: "실내", bgColor: "#FEE2E2", textColor: "#B91C1C" });
    }

    return tags;
};

// 장소가 적절한 산책 장소인지 확인하는 함수
const isAppropriatePlace = (placeName: string, category: string, address: string): boolean => {
    const fullText = `${placeName} ${category} ${address}`.toLowerCase();

    // 의료시설 필터링
    if (MEDICAL_KEYWORDS.some(keyword => fullText.includes(keyword.toLowerCase()))) {
        return false;
    }

    // 부적절한 장소 필터링
    if (INAPPROPRIATE_KEYWORDS.some(keyword => fullText.includes(keyword.toLowerCase()))) {
        return false;
    }

    return true;
};

const PlaceRecPage: React.FC = () => {
    const location = useLocation();
    const walkWarningMessage = location.state?.walkWarningMessage || localStorage.getItem('walkWarningMessage') || '정보 없음';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 }); // 기본값: 서울 중심
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [activeTab, setActiveTab] = useState('info');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);

    // 카카오맵 관련 상태 및 ref
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [indoorRecommendedPlaces, setIndoorRecommendedPlaces] = useState<Place[]>([]);
    const [outdoorRecommendedPlaces, setOutdoorRecommendedPlaces] = useState<Place[]>([]);

    // 사용자 위치 가져오기
    const getUserLocation = (): Promise<{ lat: number; lng: number }> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser.'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    resolve(coords);
                },
                (error) => {
                    console.error('Error getting user location:', error);
                    // 위치 가져오기 실패시 서울 중심으로 기본값 설정
                    resolve({ lat: 37.5665, lng: 126.978 });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5분
                }
            );
        });
    };

    // 두 지점 간의 거리 계산 (km)
    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
        const R = 6371; // 지구의 반지름 (km)
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    // 마커 표시 함수
    const displayMarkers = (places: Place[]) => {
        if (!mapInstanceRef.current || !window.kakao) return;

        // 기존 마커 삭제
        const map = mapInstanceRef.current;
        map.getLevel();

        // 새 마커 생성
        places.forEach((place) => {
            const markerPosition = new window.kakao.maps.LatLng(place.lat, place.lng);
            const marker = new window.kakao.maps.Marker({
                position: markerPosition,
                map: map
            });

            // 인포윈도우 생성
            const infowindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:5px;font-size:12px;">${place.name}</div>`
            });

            // 마커 클릭 이벤트
            window.kakao.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);

                const placeWithTags = {
                    ...place,
                    tags: place.tags || generateTags(place),
                    airQuality: place.airQuality || (walkWarningMessage.includes('주의') ? '미세먼지 나쁨' : '미세먼지 좋음'),
                    airQualityColor: place.airQualityColor || (walkWarningMessage.includes('주의') ? '#EF4444' : '#22C55E'),
                    rating: place.rating || 4.5,
                    image: place.image || 'https://placehold.co/294x192'
                };
                setSelectedPlace(placeWithTags);
                setIsModalOpen(true);
                setMapCenter({ lat: place.lat, lng: place.lng });
            });
        });

        // 지도 범위 재설정
        if (places.length > 0) {
            const bounds = new window.kakao.maps.LatLngBounds();
            places.forEach(place => {
                bounds.extend(new window.kakao.maps.LatLng(place.lat, place.lng));
            });
            map.setBounds(bounds);
        }
    };

    // 실내/실외 장소 검색 함수 (사용자 위치 기반)
    const searchIndoorOutdoorPlaces = async () => {
        if (!window.kakao || !mapInstanceRef.current) return;
        if (!window.kakao.maps.services || !window.kakao.maps.services.Places) {
            console.error("Kakao Maps Places 라이브러리가 로드되지 않았습니다.");
            return;
        }

        const ps = new window.kakao.maps.services.Places();
        const currentLocation = userLocation || mapCenter;

        let indoorResults: Place[] = [];
        let outdoorResults: Place[] = [];

        const indoorKeywords = ['애견 카페', '애견호텔', '반려동물 카페', '강아지 놀이터', '펫 카페', '애견카페', '애견유치원', '강아지유치원'];
        const outdoorKeywords = ['공원', '강변공원', '반려견 산책', '도그런', '한강공원', '산책로', '숲길', '반려동물 공원', '놀이터', '도그파크', '강아지 수영장'];

        const searchKeywords = (keywords: string[], isIndoor: boolean) => {
            return Promise.all(
                keywords.map(
                    (keyword) =>
                        new Promise<void>((resolve) => {
                            // 사용자 위치 기반으로 반경 5km 내 검색
                            const options = {
                                location: new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
                                radius: 5000, // 5km 반경
                                sort: window.kakao.maps.services.SortBy.DISTANCE // 거리순 정렬
                            };

                            ps.keywordSearch(keyword, (data: any[], status: string) => {
                                if (status === window.kakao.maps.services.Status.OK) {
                                    const filtered = data
                                        .filter((place) => {
                                            // 적절한 장소인지 확인
                                            return isAppropriatePlace(
                                                place.place_name,
                                                place.category_group_name || place.category_name || '',
                                                place.road_address_name || place.address_name
                                            );
                                        })
                                        .map((place) => {
                                            const distance = calculateDistance(
                                                currentLocation.lat,
                                                currentLocation.lng,
                                                parseFloat(place.y),
                                                parseFloat(place.x)
                                            );

                                            return {
                                                id: place.id,
                                                name: place.place_name,
                                                address: place.road_address_name || place.address_name,
                                                category: place.category_group_name || place.category_name,
                                                lat: parseFloat(place.y),
                                                lng: parseFloat(place.x),
                                                distance: `${distance.toFixed(1)}km`,
                                                airQuality: isIndoor ? '실내 공간' : (walkWarningMessage.includes('주의') ? '미세먼지 나쁨' : '미세먼지 좋음'),
                                                airQualityColor: isIndoor ? '#22C55E' : (walkWarningMessage.includes('주의') ? '#EF4444' : '#22C55E'),
                                                rating: 4.5,
                                                image: 'https://placehold.co/294x192',
                                                tags: isIndoor ?
                                                    [
                                                        { label: "실내", bgColor: "#FEE2E2", textColor: "#B91C1C" },
                                                        { label: keyword.includes('카페') ? "카페" : "반려견 시설", bgColor: "#FFEDD5", textColor: "#C2410C" }
                                                    ] :
                                                    [
                                                        { label: "야외", bgColor: "#DBEAFE", textColor: "#1D4ED8" },
                                                        { label: "산책로", bgColor: "#DCFCE7", textColor: "#15803D" }
                                                    ]
                                            };
                                        })
                                        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)); // 거리순 정렬

                                    if (isIndoor) {
                                        indoorResults = [...indoorResults, ...filtered];
                                    } else {
                                        outdoorResults = [...outdoorResults, ...filtered];
                                    }
                                }
                                resolve();
                            }, options);
                        })
                )
            );
        };

        Promise.all([searchKeywords(indoorKeywords, true), searchKeywords(outdoorKeywords, false)]).then(() => {
            // 중복 제거 후 거리순으로 정렬하여 상위 4개씩 선택
            const uniqueIndoor = Array.from(new Map(indoorResults.map((i) => [i.id, i])).values())
                .sort((a, b) => parseFloat(a.distance || '999') - parseFloat(b.distance || '999'))
                .slice(0, 8);

            const uniqueOutdoor = Array.from(new Map(outdoorResults.map((i) => [i.id, i])).values())
                .sort((a, b) => parseFloat(a.distance || '999') - parseFloat(b.distance || '999'))
                .slice(0, 8);

            console.log("실내 장소:", uniqueIndoor);
            console.log("실외 장소:", uniqueOutdoor);

            setIndoorRecommendedPlaces(uniqueIndoor);
            setOutdoorRecommendedPlaces(uniqueOutdoor);

            // 미세먼지 상태에 따라 기본 표시 장소 결정
            if (walkWarningMessage.includes('주의')) {
                displayMarkers(uniqueIndoor);
            } else {
                displayMarkers(uniqueOutdoor);
            }
        });
    };

    // Kakao 지도 스크립트 로드
    useEffect(() => {
        const script = document.createElement('script');
        script.async = true;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&autoload=false&libraries=services`;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                console.log('Kakao Maps loaded successfully');
                setMapLoaded(true);
            });
        };

        return () => {
            if (script.parentNode) {
                document.head.removeChild(script);
            }
        };
    }, []);

    // 사용자 위치 가져오기
    useEffect(() => {
        getUserLocation().then((coords) => {
            setUserLocation(coords);
            setMapCenter(coords);
            console.log('User location:', coords);
        }).catch((error) => {
            console.error('Failed to get user location:', error);
        });
    }, []);

    // 맵 초기화 및 추천 장소 검색
    useEffect(() => {
        if (!mapLoaded || !mapRef.current) return;

        const kakao = window.kakao;
        const map = new kakao.maps.Map(mapRef.current, {
            center: new kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
            level: 5,
        });
        mapInstanceRef.current = map;

        // 사용자 위치 마커 표시
        if (userLocation) {
            const userMarker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
                map: map,
                image: new kakao.maps.MarkerImage(
                    'data:image/svg+xml;base64,' + btoa(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#3176FF">
                            <circle cx="12" cy="12" r="8"/>
                            <circle cx="12" cy="12" r="3" fill="white"/>
                        </svg>
                    `),
                    new kakao.maps.Size(24, 24)
                )
            });

            const userInfoWindow = new kakao.maps.InfoWindow({
                content: '<div style="padding:5px;font-size:12px;">현재 위치</div>'
            });

            kakao.maps.event.addListener(userMarker, 'click', function() {
                userInfoWindow.open(map, userMarker);
            });
        }

        searchIndoorOutdoorPlaces();
    }, [mapLoaded, userLocation]);

    // 모달 관련 함수
    const openModal = async (place: Place) => {
        setSelectedPlace(place);
        setIsModalOpen(true);
        setMapCenter({ lat: place.lat, lng: place.lng });
        setActiveTab('info');

        try {
            const details = await getPlaceDetails(place.id);
            if (details) {
                const enhancedPlace: Place = {
                    ...place,
                    phone: details.phone || '정보 없음',
                    website: details.homepage || '정보 없음',
                    openingHours: details.opening_hours || [],
                    description: details.description || '상세 설명이 없습니다.',
                    tags: place.tags || generateTags(place)
                };
                setSelectedPlace(enhancedPlace);
            }
        } catch (error) {
            console.error("장소 상세 정보를 불러오는 중 오류 발생:", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // 장소 검색 함수 (사용자 위치 기반)
    const handleSearch = () => {
        if (!searchKeyword.trim() || !window.kakao || !window.kakao.maps.services) return;

        const ps = new window.kakao.maps.services.Places();
        const currentLocation = userLocation || mapCenter;

        const options = {
            location: new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
            radius: 10000, // 검색시에는 반경 10km로 확장
            sort: window.kakao.maps.services.SortBy.DISTANCE
        };

        ps.keywordSearch(searchKeyword, (data: any[], status: string) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const results = data
                    .filter((place) => {
                        return isAppropriatePlace(
                            place.place_name,
                            place.category_group_name || place.category_name || '',
                            place.road_address_name || place.address_name
                        );
                    })
                    .map(place => {
                        const distance = calculateDistance(
                            currentLocation.lat,
                            currentLocation.lng,
                            parseFloat(place.y),
                            parseFloat(place.x)
                        );

                        return {
                            id: place.id,
                            name: place.place_name,
                            address: place.road_address_name || place.address_name,
                            category: place.category_group_name || place.category_name,
                            lat: parseFloat(place.y),
                            lng: parseFloat(place.x),
                            distance: `${distance.toFixed(1)}km`,
                            tags: generateTags({
                                id: place.id,
                                name: place.place_name,
                                address: place.road_address_name || place.address_name,
                                category: place.category_group_name || place.category_name,
                                lat: parseFloat(place.y),
                                lng: parseFloat(place.x)
                            }),
                            airQuality: walkWarningMessage.includes('주의') ? '미세먼지 나쁨' : '미세먼지 좋음',
                            airQualityColor: walkWarningMessage.includes('주의') ? '#EF4444' : '#22C55E',
                            rating: 4.5,
                            image: 'https://placehold.co/294x192'
                        };
                    })
                    .sort((a, b) => parseFloat(a.distance || '999') - parseFloat(b.distance || '999'));

                setFilteredPlaces(results);
                displayMarkers(results);
            }
        }, options);
    };

    // 장소 상세 정보 가져오기 함수
    const getPlaceDetails = async (placeId: string): Promise<any> => {
        if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
            console.error("Kakao Maps API가 로드되지 않았습니다.");
            return null;
        }

        return new Promise((resolve) => {
            const ps = new window.kakao.maps.services.Places();

            ps.getDetails({ placeId: placeId }, (result: any, status: string) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    resolve(result[0]);
                } else {
                    console.error("장소 상세 정보를 가져오는데 실패했습니다:", status);
                    resolve(null);
                }
            });
        });
    };

    // 추천 장소 표시
    const recommendedPlaces = walkWarningMessage.includes('주의')
        ? indoorRecommendedPlaces
        : outdoorRecommendedPlaces;

    return (
        <div className="relative w-screen bg-[#B9CAF5]">
            <Header />

            {/* Main Content */}
            <div className="relative w-full bg-white pt-36 pb-20">
                <div className="max-w-[1280px] mx-auto px-4">

                    {/* Main Content */}
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h1 className="text-2xl font-bold text-[#1F2937]">
                                {walkWarningMessage.includes('주의')
                                    ? '미세먼지가 있어요! 오늘은 실내 장소를 추천합니다'
                                    : '맑은 날씨! 오늘은 실외 산책 장소를 추천합니다'}
                            </h1>
                            <p className="text-base text-[#4B5563] mt-1">
                                {walkWarningMessage.includes('주의')
                                    ? '현재 위치 주변의 반려견과 함께 방문하기 좋은 실내 장소들입니다'
                                    : '현재 위치 주변의 반려견과 함께 산책하기 좋은 실외 장소들입니다'}
                            </p>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="장소 검색"
                                className="w-60 h-10 px-4 rounded-xl border border-[#E5E7EB] shadow-sm text-[#9CA3AF] text-sm"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button
                                className="ml-3 bg-[#3176FF] text-white px-4 py-2 rounded text-base"
                                onClick={handleSearch}
                            >
                                검색
                            </button>
                        </div>
                    </div>

                    {/* Featured Section */}
                    <div className="flex gap-6 mb-16">
                        {/* Big Card (KakaoMap with Marker) */}
                        <div className="w-[612px] bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="relative h-[600px]" ref={mapRef}>
                                <div className="absolute top-4 right-4 bg-white p-3 rounded-xl shadow-md flex flex-col gap-2">
                                    <button
                                        className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center"
                                        onClick={() => walkWarningMessage.includes('주의')
                                            ? displayMarkers(indoorRecommendedPlaces)
                                            : displayMarkers(outdoorRecommendedPlaces)}
                                    >
                                        🔄
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Small Cards 영역과 모달 */}
                        <div className="relative w-[612px]">
                            {/* 모달 */}
                            {isModalOpen && selectedPlace && (
                                <div className="relative w-full h-[800px] bg-white rounded-xl shadow-lg flex flex-col overflow-y-auto border-2 border-[#3176FF]">
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

                                    {/* Tab Navigation */}
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
                                            <div className="pb-4 flex">
                                                <div className="w-full flex justify-between items-center">
                                                    <h3 className="text-2xl font-bold text-[#1F2937]">{selectedPlace.name}</h3>
                                                    <div className="flex items-center">
                                                        <span className="text-base font-medium text-[#374151]">{selectedPlace.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full pb-6">
                                                <p className="text-[#4B5563] text-base">{selectedPlace.address}</p>
                                                {selectedPlace.phone && selectedPlace.phone !== '정보 없음' && (
                                                    <p className="text-[#4B5563] text-base mt-2">
                                                        <span className="font-medium">전화번호:</span> {selectedPlace.phone}
                                                    </p>
                                                )}
                                                {selectedPlace.website && selectedPlace.website !== '정보 없음' && (
                                                    <p className="text-[#4B5563] text-base mt-2">
                                                        <span className="font-medium">웹사이트:</span>{' '}
                                                        <a
                                                            href={selectedPlace.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {selectedPlace.website}
                                                        </a>
                                                    </p>
                                                )}
                                            </div>
                                            {selectedPlace.openingHours && selectedPlace.openingHours.length > 0 && (
                                                <div className="pb-6">
                                                    <h4 className="text-lg font-bold text-[#1F2937] mb-2">영업시간</h4>
                                                    <ul className="list-disc pl-5">
                                                        {selectedPlace.openingHours.map((hours, index) => (
                                                            <li key={index} className="text-[#4B5563] text-base">{hours}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            <div className="pb-6">
                                                <div className="flex flex-wrap gap-4">
                                                    {selectedPlace.distance && (
                                                        <div className="p-4 bg-[#F9FAFB] rounded-xl flex justify-between">
                                                            <div className="flex items-center mr-4">
                                                                <div className="text-[#6B7280] text-sm">거리</div>
                                                            </div>
                                                            <div className="text-[#374151] text-base font-medium">
                                                                {selectedPlace.distance}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {selectedPlace.airQuality && (
                                                        <div className="p-4 bg-[#F9FAFB] rounded-xl flex">
                                                            <div className="flex items-center mr-4">
                                                                <div className="text-sm"
                                                                     style={{color: selectedPlace.airQualityColor}}>미세먼지
                                                                </div>
                                                            </div>
                                                            <div className="text-base font-medium"
                                                                 style={{color: selectedPlace.airQualityColor}}>
                                                                {selectedPlace.airQuality.includes('미세먼지')
                                                                    ? selectedPlace.airQuality.replace('미세먼지 ', '')
                                                                    : selectedPlace.airQuality}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* 태그 표시 */}
                                            <div className="pt-[25px] pb-6 border-t border-[#F3F4F6]">
                                                <h4 className="text-lg font-bold text-[#1F2937] mb-4">추가 정보</h4>
                                                <p className="text-[#4B5563] text-base mb-4">
                                                    {walkWarningMessage.includes('주의') && selectedPlace.tags?.some(tag => tag.label === "실내")
                                                        ? "실내 공간으로 미세먼지 걱정 없이 반려견과 함께 시간을 보낼 수 있습니다."
                                                        : "넓은 공간에서 반려견과 함께 여유로운 산책을 즐기기 좋습니다."}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedPlace.tags?.map((tag, index) => (
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
                                            <ReviewComponent placeName={selectedPlace.name}/>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Small Cards (2x2 Grid) - API에서 가져온 추천 장소 표시 */}
                            <div className="w-full grid grid-cols-2 gap-6">
                                {recommendedPlaces.slice(0, 8).map((place) => (
                                    <div
                                        key={place.id}
                                        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-300 cursor-pointer"
                                        onClick={() => openModal(place)}
                                    >
                                        {/*<img src={place.image} alt={place.name} className="w-full h-48 object-cover"/>*/}
                                        <div className="p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-lg font-bold text-[#1F2937]">{place.name}</h3>
                                                <span className="text-base text-[#374151]">{place.rating}</span>
                                            </div>
                                            <p className="text-sm text-[#4B5563] mb-2">{place.address}</p>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-[#6B7280]">거리: {place.distance}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {place.tags?.map((tag, index) => (
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
                </div>
            </div>
        </div>
    );
};

export default PlaceRecPage;