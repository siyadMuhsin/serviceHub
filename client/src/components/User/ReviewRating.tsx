// RatingsReviews.tsx
import { getReviewsByExpertId } from '@/services/User/expert.service';
import { useEffect, useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function RatingsReviews({ expertId }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReview, setTotalReview] = useState(0);
  const [reviews, setReviews] = useState([]);

  const displayStars = (ratingValue) => {
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-500" size={20} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" size={20} />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" size={20} />);
      }
    }
    return stars;
  };

  const fetchReviews = async () => {
    try {
      const response = await getReviewsByExpertId(expertId, currentPage, 5);
      setReviews(response.review || []);
      setTotalPages(response.totalPages || 1);
      setAverageRating(response.avgRating);
      setTotalReview(response.total);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [expertId, currentPage]);

  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Ratings & Reviews</h2>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="text-center md:text-left">
          <div className="text-5xl font-bold text-gray-800">{averageRating}</div>
          <div className="flex mt-2 justify-center md:justify-start gap-1">
            {displayStars(averageRating)}
          </div>
          <div className="text-gray-500 mt-2">Based on {totalReview} verified reviews</div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">User Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex items-start gap-3">
                  {review.userId?.profile_image && (
                    <img
                      src={review.userId.profile_image}
                      alt={review.userId.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-gray-800">{review.userId?.name || 'Anonymous'}</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) =>
                          star <= review.rating ? (
                            <FaStar key={star} className="text-yellow-500" size={16} />
                          ) : (
                            <FaRegStar key={star} className="text-gray-300" size={16} />
                          )
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 mt-2">{review.reviewText}</p>
                    {review.createdAt && (
                      <p className="text-gray-500 text-sm mt-2">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => {
            const page = idx + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded border ${
                  page === currentPage ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
