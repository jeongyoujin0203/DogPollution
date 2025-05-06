import React, { useState, useEffect } from 'react';

// 리뷰 인터페이스 정의
interface Review {
    rating: number;
    review: string;
    created_at: string;
}

// 컴포넌트 props 인터페이스 정의
interface ReviewComponentProps {
    placeName: string;
}

const ReviewComponent: React.FC<ReviewComponentProps> = ({ placeName }) => {
    // 상태 관리
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // 컴포넌트 마운트 시 또는 placeName 변경 시 리뷰 가져오기
    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);
            try {
                // 실제 API 엔드포인트 사용
                const response = await fetch(`/api/cafe_reviews/${encodeURIComponent(placeName)}`);

                if (!response.ok) {
                    throw new Error('리뷰를 불러오는 데 실패했습니다.');
                }

                const data = await response.json();
                setReviews(data.reviews || []);
                setError(null);
            } catch (err) {
                console.error('리뷰 불러오기 오류:', err);
                setError('리뷰를 불러오는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
                // API 호출 실패 시 데모 목적으로 가짜 데이터 설정
                setReviews([
                    { rating: 5, review: "반려견과 함께 방문했는데 시설이 너무 좋았어요. 특히 넓은 공간이 마음에 들었습니다.", created_at: "2025-04-28T12:00:00" },
                    { rating: 4, review: "강아지용 간식이 맛있었나 봐요. 저희 댕댕이가 정말 좋아했어요!", created_at: "2025-04-25T15:30:00" },
                    { rating: 5, review: "직원분들이 친절하고 반려견도 편안하게 쉴 수 있는 공간이 있어서 좋았습니다.", created_at: "2025-04-22T09:15:00" }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        if (placeName) {
            fetchReviews();
        }
    }, [placeName]);

    // 새 리뷰 제출
    const handleSubmitReview = async () => {
        if (!newReview.trim()) {
            setError('리뷰 내용을 입력해 주세요.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // 실제 API 엔드포인트 사용
            const response = await fetch(`/api/cafe_reviews/${encodeURIComponent(placeName)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rating,
                    review: newReview
                }),
            });

            if (!response.ok) {
                throw new Error('리뷰 제출에 실패했습니다.');
            }

            // 새 리뷰를 목록에 추가
            setReviews([
                {
                    rating,
                    review: newReview,
                    created_at: new Date().toISOString()
                },
                ...reviews
            ]);

            setNewReview('');
            setRating(5);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('리뷰 제출 오류:', err);
            setError('리뷰를 제출하는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 날짜 형식 지정
    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date);
        } catch (e) {
            return dateString;
        }
    };

    // 별점 렌더링
    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`text-xl ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
          ★
        </span>
            );
        }
        return stars;
    };

    // 별점 선택기 렌더링
    const renderRatingSelector = () => {
        return (
            <div className="flex items-center mb-4">
                <p className="text-sm text-gray-600 mr-2">별점:</p>
                <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-xl focus:outline-none ${
                                star <= rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                        >
                            ★
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-xl font-bold text-[#1F2937] mb-6">방문자 리뷰</h3>

            {/* 리뷰 작성 폼 */}
            <div className="mb-8 border-b border-gray-200 pb-6">
                <h4 className="text-lg font-medium text-[#374151] mb-4">리뷰 작성하기</h4>
                {renderRatingSelector()}
                <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="이 장소에 대한 리뷰를 작성해주세요."
                    className="w-full p-3 border border-gray-300 rounded-lg min-h-24 mb-4"
                    disabled={isSubmitting}
                />

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                {success && <p className="text-green-600 text-sm mb-3">리뷰가 성공적으로 등록되었습니다!</p>}

                <button
                    type="button"
                    onClick={handleSubmitReview}
                    className="bg-[#3176FF] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? '제출 중...' : '리뷰 등록하기'}
                </button>
            </div>

            {/* 리뷰 목록 */}
            <div>
                <h4 className="text-lg font-medium text-[#374151] mb-4">
                    리뷰 ({reviews.length})
                </h4>

                {isLoading ? (
                    <p className="text-center py-4 text-gray-500">리뷰를 불러오는 중...</p>
                ) : reviews.length === 0 ? (
                    <p className="text-center py-4 text-gray-500">아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!</p>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review, index) => (
                            <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex">
                                        {renderStars(review.rating)}
                                    </div>
                                    <span className="text-sm text-gray-500">
                    {formatDate(review.created_at)}
                  </span>
                                </div>
                                <p className="text-[#4B5563]">{review.review}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewComponent;