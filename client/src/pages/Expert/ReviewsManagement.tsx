import React, { useEffect, useState } from 'react';
import { FaStar, FaRegStar, FaQuoteLeft } from 'react-icons/fa';
import { getReviewsByExpertId } from '@/services/Expert/review.service';
import { Pagination } from '@mui/material';

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await getReviewsByExpertId(page, limit);

      setReviews(response.review || []);
      setAvgRating(response.avgRating || 0);
      setTotalReviews(response.total || 0);

      if (response.totalPages) {
        setTotalPages(response.totalPages);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) =>
          star <= rounded ? (
            <FaStar key={star} className="text-yellow-400" size={16} />
          ) : (
            <FaRegStar key={star} className="text-gray-300" size={16} />
          )
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-[#0d2e20] flex items-center">
          <span className="bg-[#0d2e20] p-2 rounded-lg mr-3">
            <svg className="w-6 h-6 text-indigo-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </span>
          Review Management
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-[#0d2e20] text-white rounded-lg p-4 flex items-center justify-center w-16 h-16">
              <span className="text-3xl font-bold">{avgRating.toFixed(1)}</span>
            </div>
            <div className="ml-4">
              <div className="mb-1">{renderStars(avgRating)}</div>
              <p className="text-gray-600 font-medium">{totalReviews} total reviews</p>
            </div>
          </div>
          <div className="bg-indigo-50 rounded-lg px-4 py-2">
            <div className="flex gap-2 items-center text-[#0d2e20]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="font-medium">Verified Reviews</span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-4 text-gray-400">
            <svg className="mx-auto w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p className="text-gray-500 text-lg">No reviews available yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="mr-4">
                    {review.userId?.profile_image ? (
                      <img
                        src={review.userId.profile_image}
                        alt={review.userId.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-bold text-lg">
                          {review.userId?.name?.charAt(0) || 'A'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {review.userId?.name || 'Anonymous'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        {renderStars(review.rating)}
                      </div>
                    </div>

                    <div className="mt-4 text-gray-700 relative pl-6">
                      <FaQuoteLeft className="absolute left-0 top-0 text-indigo-100 text-lg" />
                      <p className="italic">{review.reviewText}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
            className="bg-white px-4 py-2 rounded-lg shadow-sm"
          />
        </div>
      )}
    </div>
  );
};

export default ReviewsManagement;