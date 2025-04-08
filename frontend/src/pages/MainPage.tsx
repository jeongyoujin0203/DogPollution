// src/pages/MainPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/Topbar'
import Map from '../components/Map'
import AOS from 'aos'
import 'aos/dist/aos.css'
import DogPerson from '../assets/Dog_Person.png'

const MainPage = () => {
    const [selectedDustType, setSelectedDustType] = useState<'PM10' | 'PM2.5'>('PM10')
    const navigate = useNavigate()

    useEffect(() => {
        AOS.init({ duration: 1000, easing: 'ease-out', once: true })
    }, [])

    return (
        <div className="relative w-screen h-screen bg-[#E6F4FF] overflow-hidden">
            <TopBar />

            {/* 도봉구 대기질 정보 */}
            <div className="absolute top-[160px] left-[50px] w-[330px] h-[178px] bg-white rounded-[11px] border border-black p-4 shadow-md">
                <p className="text-[25px] font-[Itim] text-left">도봉구 대기질 정보</p>
                <p className="text-[15px] text-[#8A8A8A] text-left mt-1">2025년 3월 27일 23시</p>
                <hr className="my-2 border-black" />
                <div className="flex justify-between px-2">
                    <span className="text-[16px] font-itim">미세먼지</span>
                    <span className="text-[13px] text-[#5F5F5F]">PM-10</span>
                    <span className="text-[14px] text-[#0AA811]">31㎥/m³</span>
                    <span className="text-[14px] text-[#0AA811]">보통</span>
                </div>
                <div className="flex justify-between px-2 mt-2">
                    <span className="text-[16px] font-itim">초미세먼지</span>
                    <span className="text-[13px] text-[#5F5F5F]">PM-2.5</span>
                    <span className="text-[14px] text-[#0AA811]">75㎥/m³</span>
                    <span className="text-[14px] text-[#0AA811]">보통</span>
                </div>
            </div>

            {/* 미세먼지 예보 */}
            <div className="absolute top-[360px] left-[50px] w-[330px] h-[341px] bg-white rounded-[11px] border border-black p-4 shadow-md">
                <p className="text-[25px] font-[Itim] text-left">미세먼지 예보</p>
                <p className="text-[15px] text-[#8A8A8A] text-left">2025년 3월 27일 23시</p>
                <hr className="my-2 border-black" />
                <div className="bg-yellow-200/50 shadow p-3 rounded-md mt-3">
                    <p className="text-center font-itim text-[18px]">오늘은 미세먼지가 ‘나쁨'이에요</p>
                    <p className="text-center font-itim text-[18px]">실외 산책은 자제해주세요</p>
                </div>
                <img
                    src={DogPerson}
                    alt="미세먼지 안내"
                    className="absolute right-4 bottom-4 w-[116px] h-[171px] rounded-[10px]"
                />
            </div>

            {/* 오늘의 추천 장소 버튼 */}
            <div
                onClick={() => navigate('/todayrec')}
                className="absolute top-[720px] left-[50px] w-[330px] h-[97px] bg-white rounded-[11px] border border-black shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-100"
            >
                <p className="text-[20px] font-bold text-center">오늘의 추천 장소 바로보기</p>
            </div>

            {/* 미세먼지 위험 버튼 */}
            <div
                onClick={() => navigate('/finedustimpact')}
                className="absolute top-[830px] left-[50px] w-[330px] h-[97px] bg-white rounded-[11px] border border-black shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-100"
            >
                <p className="text-[20px] font-bold text-center">미세먼지 얼마나 위험할까?</p>
            </div>

            {/* 지도 */}
            <div
                className="absolute top-[160px] left-[414px] w-[1200px] h-[900px] border-2 border-black rounded-[12px] overflow-hidden">
                <Map center={{ lat: 37.5665, lng: 126.978 }} />
            </div>
        </div>
    )
}

export default MainPage
