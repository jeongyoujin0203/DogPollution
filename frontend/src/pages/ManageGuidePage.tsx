// ManageGuidePage.tsx
import React from 'react';
import Header from "../components/Header";

// 가이드 카드 타입 정의
interface GuideCard {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    link: string;
}

// 건강 가이드 데이터
const healthGuides: GuideCard[] = [
    {
        id: 1,
        title: "미세먼지가 강아지에게 미치는 영향",
        description: "미세먼지는 강아지의 호흡기 건강에 심각한 영향을 미칠 수 있습니다. 특히 노견이나 기존 호흡기 질환이 있는 강아지는 더 취약합니다.",
        imageUrl: "https://i.ytimg.com/vi/u62ZSQuaLPc/hqdefault.jpg", // 유튜브 썸네일 URL 형식 사용
        link: "https://youtu.be/u62ZSQuaLPc?si=KhuX7Ncs9hKVKJZB"
    },
    {
        id: 2,
        title: "미세먼지 많은 날 강아지 산책, 어떻게 해야 할까요?",
        description: "미세먼지가 많은 날 산책 후에는 반드시 발바닥과 피모를 깨끗이 닦아주세요. 미세먼지 입자가 피부와 호흡기에 남아있을 수 있습니다.",
        imageUrl: "https://i.ytimg.com/vi/Mi1ahS9kcSs/maxresdefault.jpg",
        link: "https://www.youtube.com/watch?v=Mi1ahS9kcSs"
    },
    {
        id: 3,
        title: "강아지 스트레스 해소법, 집에서 할 수 있는 활동",
        description: "미세먼지가 심한 날에는 실외 활동을 줄이고 실내에서 할 수 있는 다양한 활동으로 강아지의 스트레스를 해소해 주세요.",
        imageUrl: "https://i.ytimg.com/vi/rQMwmfRxv8E/maxresdefault.jpg",
        link: "https://www.youtube.com/watch?v=rQMwmfRxv8E&pp=ygUQI-qwleyVhOyngO2ZqeyCrA%3D%3D"
    }
];

// 가이드 카드 컴포넌트
const GuideCard: React.FC<GuideCard> = ({ title, description, imageUrl, link }) => {
    const handleCardClick = () => {
        window.open(link, '_blank');
    };

    return (
        <div
            className="w-full sm:w-full md:w-full lg:w-[400px] h-[324px] bg-white rounded-xl shadow-sm border border-opacity-40 border-black flex flex-col overflow-hidden cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
            onClick={handleCardClick}
        >
            <div className="w-full h-40 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-2 leading-7">{title}</h3>
                <p className="text-sm text-gray-600 leading-5 mb-4 flex-grow">{description}</p>
                <div className="text-sm text-blue-600 flex items-center">
                    <span>자세히 보기</span>
                    <span className="ml-1 text-base">›</span>
                </div>
            </div>
        </div>
    );
};

// 건강 가이드 페이지 컴포넌트
const ManageGuidePage: React.FC = () => {
    return (
        <div className="relative w-screen bg-[#B9CAF5]">
            <Header/>

            {/* 메인 콘텐츠 */}
            <div className="relative w-full bg-white pt-36 pb-20">
                <div className="max-w-[1280px] mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 leading-8">오늘의 건강 가이드</h2>
                        <div className="flex items-center text-blue-600 text-base cursor-pointer">
                            <span>모든 가이드 보기</span>
                            <span className="ml-1 text-xl">›</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                        {healthGuides.map(guide => (
                            <GuideCard
                                key={guide.id}
                                id={guide.id}
                                title={guide.title}
                                description={guide.description}
                                imageUrl={guide.imageUrl}
                                link={guide.link}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ManageGuidePage;