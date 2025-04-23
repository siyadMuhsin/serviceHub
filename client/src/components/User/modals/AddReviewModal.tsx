import { useState, FormEvent, MouseEvent } from 'react';
import { reviewSubmit } from '@/services/User/expert.service';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface AddReviewModalProps {
  expertId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddReviewModal({
  expertId,
  onClose,
  onSuccess,
}: AddReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmitReview = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await reviewSubmit(rating, reviewText, expertId);
      toast.success('Review submitted successfully');
      setRating(0);
      setReviewText('');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  const handleMouseEnter = (star: number) => {
    setHoverRating(star);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Write a Review</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmitReview}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleMouseEnter(star)}
                  onMouseLeave={handleMouseLeave}
                  className="focus:outline-none"
                >
                  {(hoverRating || rating) >= star ? (
                    <FaStar className="text-yellow-500" size={24} />
                  ) : (
                    <FaRegStar className="text-gray-300" size={24} />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="review" className="block text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              id="review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className={`px-4 py-2 rounded-md ${
                isSubmitting || rating === 0
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
