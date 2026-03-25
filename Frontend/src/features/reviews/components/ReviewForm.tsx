import React, { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { reviewService } from '../services/review.service';

interface ReviewFormProps {
  productId: string;
  onSuccess: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hover, setHover] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await reviewService.createReview({ product: productId, rating, comment });
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-10 shadow-sm mb-12">
      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8 leading-none">Record Your Experience</h3>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col space-y-4">
          <label className="text-[9px] font-black uppercase tracking-widest text-black">Product Rating</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="focus:outline-none transition-transform hover:scale-125"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= (hover || rating) ? 'fill-black text-black' : 'text-gray-100'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-black block">Detailed Description (Optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl p-6 text-sm font-bold focus:bg-white focus:ring-1 focus:ring-black transition-all outline-none min-h-[120px]"
            placeholder="Share your perspective on material quality and utility..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white h-16 rounded-full font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center space-x-4 hover:bg-gray-800 transition-all disabled:opacity-20"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Publish Review</span>}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
