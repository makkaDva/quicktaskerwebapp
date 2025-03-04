"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Star, Send, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type RatingPageProps = {
  id: string;
  workerId: string;
  workerName: string;
  jobTitle: string;
  isModal?: boolean;
  onClose?: () => void;
};

export default function RatingPage({
  id,
  workerId,
  workerName,
  jobTitle,
  isModal = false,
  onClose
}: RatingPageProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Check if this job has already been rated
    const checkExistingRating = async () => {
      const { data, error } = await supabase
        .from('job_ratings')
        .select('rating, comment')
        .eq('job_id', id)
        .single();
      
      if (data && !error) {
        setRating(data.rating);
        setComment(data.comment || '');
        setIsSubmitted(true);
      }
    };

    checkExistingRating();
  }, [id, supabase]);

  const handleSubmitRating = async () => {
    if (rating === null) return;
    
    setIsSubmitting(true);
    
    // Insert or update the rating in Supabase
    const { error } = await supabase
      .from('job_ratings')
      .upsert({
        job_id: id,
        worker_id: workerId,
        rating: rating,
        comment: comment,
        created_at: new Date().toISOString()
      });
    
    setIsSubmitting(false);
    
    if (!error) {
      setIsSubmitted(true);
      
      // If it's a modal, close it after a delay
      if (isModal && onClose) {
        setTimeout(onClose, 2000);
      } else {
        // If it's a standalone page, redirect after a delay
        setTimeout(() => router.push('/jobs'), 2000);
      }
    }
  };

  const containerClass = isModal
    ? "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    : "min-h-screen bg-gradient-to-b from-green-50/20 to-white flex items-center justify-center py-12 px-4";

  const contentClass = isModal
    ? "bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-auto p-8 relative"
    : "bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-auto p-8";

  return (
    <div className={containerClass}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={contentClass}
      >
        {isModal && (
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Star className="w-10 h-10 text-emerald-600" />
          </div>
          
          {!isSubmitted ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Rate Your Experience</h1>
              <p className="text-gray-600 mb-2">How was your experience with {workerName}?</p>
              <p className="text-sm text-gray-500">Job: {jobTitle}</p>
            </>
          ) : (
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You for Your Feedback!</h1>
          )}
        </div>

        {!isSubmitted ? (
          <>
            <div className="flex justify-center space-x-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-12 h-12 ${
                      (hoveredRating !== null ? star <= hoveredRating : star <= (rating || 0))
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </motion.button>
              ))}
            </div>

            <div className="mb-8">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                id="comment"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Share more details about your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={rating === null || isSubmitting}
              onClick={handleSubmitRating}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white
                ${rating === null 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg hover:shadow-emerald-100/40'
                }`}
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Rating
                </>
              )}
            </motion.button>
          </>
        ) : (
          <div className="text-center">
            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-10 h-10 ${
                    star <= (rating || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            
            {comment && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-600 italic">"{comment}"</p>
              </div>
            )}
            
            <p className="text-gray-600">Your feedback helps improve our community!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}