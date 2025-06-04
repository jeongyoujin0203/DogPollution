// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

// 유효한 사용자 정보 (예시)
const validUser = {
    username: "user123",
    password: "pass123"
};

export default function LoginPage() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (username === validUser.username && password === validUser.password) {
            // 로그인 성공 시 메인 페이지로 이동
            navigate('/main');
        } else {
            setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className="relative w-screen bg-[#B9CAF5]">
            <Header/>

            {/* 로그인 버튼 */}
            <div
                className="ml-auto mr-[30px] bg-[#3176FF] text-white px-4 py-2 rounded flex items-center cursor-pointer">
                <div className="w-5 h-5 mr-1 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         viewBox="0 0 16 16">
                        <path
                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c0-.001-.001-.001-.002-.002-.002-.002-.005-.005-.008-.008-.028-.025-.07-.06-.12-.097-.28-.203-.671-.445-1.17-.573-.498-.127-1.095-.199-1.7-.199s-1.202.072-1.7.199c-.499.128-.89.37-1.17.573a3.52 3.52 0 0 0-.12.097c-.003.003-.006.006-.008.008-.001.001-.002.001-.002.002l.004.001z"/>
                    </svg>
                </div>
                로그인
            </div>

            {/* 메인 콘텐츠 */}
            <main
                className="w-full min-h-[calc(100vh-72px)] bg-white rounded-t-[30px] flex justify-center items-center">
                <div className="w-[400px] p-10 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800">로그인</h2>

                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="mb-4 p-2 bg-red-50 text-red-500 text-sm rounded">
                                {error}
                            </div>
                        )}

                        <div className="mb-5">
                            <label htmlFor="username" className="block mb-2 text-sm text-gray-600">
                                아이디
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#3176FF]"
                                placeholder="아이디를 입력하세요"
                                required
                            />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="password" className="block mb-2 text-sm text-gray-600">
                                비밀번호
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#3176FF]"
                                placeholder="비밀번호를 입력하세요"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-[#3176FF] text-white rounded hover:bg-[#2759c7] transition-colors"
                        >
                            로그인
                        </button>

                        <div className="mt-5 text-center text-sm text-gray-600">
                            <p>계정이 없으신가요? <a href="#" className="text-[#3176FF] hover:underline">회원가입</a></p>
                            <p className="mt-2">
                                <a href="#" className="text-[#3176FF] hover:underline">아이디/비밀번호 찾기</a>
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};