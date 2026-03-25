import React from 'react';
import { Star, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  comment?: string;
  createdAt: string;
}

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center opacity-40">
        <Star className="w-8 h-8 mb-4 stroke-[1px]" />
        <span className="text-[10px] uppercase font-black tracking-widest">No Records in the Archive</span>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-12 flex items-center gap-4">
        <span>Verified Testimonials</span>
        <div className="flex-1 h-px bg-gray-50"></div>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {reviews.map((review, idx) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group space-y-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-all transform group-hover:rotate-12">
                  <User className="w-4 h-4" />
                </div>
                <div>
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-black">{review.user?.name || 'Anonymous Clientele'}</h4>
                   <p className="text-[8px] text-gray-400 font-extrabold uppercase tracking-widest pt-1">{new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex space-x-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= review.rating ? 'fill-black text-black' : 'text-gray-100'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <p className="text-sm text-gray-500 font-bold leading-relaxed uppercase tracking-widest pl-14 opacity-60 group-hover:opacity-100 transition-opacity">
               {review.comment || 'The clientele provided zero additional commentary for this purchase record.'}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
