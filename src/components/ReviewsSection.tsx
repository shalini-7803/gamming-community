import React, { useEffect, useState } from "react";
import { Star, Send, MessageSquarePlus, X, Quote } from "lucide-react";
import { toast } from "react-toastify";
import { reviewService, Review } from "../services/reviewService";

const REVIEW_LIMIT_KEY = "last_review_submitted_at";
const ONE_HOUR = 60 * 60 * 1000;

const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("9999999999");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = async () => {
    const data = await reviewService.getApprovedReviews();
    setReviews(data || []);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    if (!showModal) return;

    const scrollY = window.scrollY;

    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;

      window.scrollTo(0, scrollY);
    };
  }, [showModal]);

  const canSubmitReview = () => {
    const lastSubmittedAt = localStorage.getItem(REVIEW_LIMIT_KEY);

    if (!lastSubmittedAt) return true;

    const timePassed = Date.now() - Number(lastSubmittedAt);
    return timePassed >= ONE_HOUR;
  };

  const getRemainingMinutes = () => {
    const lastSubmittedAt = localStorage.getItem(REVIEW_LIMIT_KEY);

    if (!lastSubmittedAt) return 0;

    const remaining = ONE_HOUR - (Date.now() - Number(lastSubmittedAt));
    return Math.max(1, Math.ceil(remaining / 60000));
  };

  const submitReview = async () => {
    if (!canSubmitReview()) {
      toast.error(
        `You can add another review after ${getRemainingMinutes()} minute(s).`
      );
      return;
    }

    if (!customerName.trim()) return toast.error("Please enter your name");

    if (!customerContact.trim()) {
      return toast.error("Please enter mobile or email");
    }

    if (!message.trim()) {
      return toast.error("Please write your review");
    }

    setSubmitting(true);

    const result = await reviewService.submitReview({
      customer_name: customerName.trim(),
      customer_contact: customerContact.trim(),
      rating,
      message: message.trim(),
    });

    setSubmitting(false);

    if (!result.success) {
      toast.error(result.error || "Failed to submit review");
      return;
    }

    localStorage.setItem(REVIEW_LIMIT_KEY, String(Date.now()));

    toast.success("Review submitted! It will appear within 24 hours.", {
      icon: "🎮",
      style: {
        background: "linear-gradient(to right, #7c3aed, #d946ef)",
        color: "#fff",
        borderRadius: "12px",
        boxShadow: "0 0 20px rgba(217,70,239,0.35)",
      },
      progressStyle: { background: "rgba(255,255,255,0.8)" },
    });

    setCustomerName("");
    setCustomerContact("");
    setRating(5);
    setMessage("");
    setShowModal(false);
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : null;

  return (
    <section className="relative py-12 sm:py-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Ambient glow, hero-style */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl animate-loader-drift" />
        <div
          className="absolute bottom-0 right-1/3 w-80 h-80 bg-fuchsia-600/15 rounded-full blur-3xl animate-loader-drift"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-1.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-fuchsia-500/25 mb-4">
            🎮 CUSTOMER REVIEWS
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
            <span className="text-white">Built on Trust,</span>
            <br className="sm:hidden" />{" "}
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-orange-300 bg-clip-text text-transparent">
              Backed by Gamers
            </span>
          </h2>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto px-4 mb-5">
            Real feedback from our gaming community.
          </p>

          {reviews.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-xs sm:text-sm font-bold text-yellow-300">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                {averageRating} Average Rating
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-xs sm:text-sm font-bold text-lime-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime-400" />
                </span>
                {reviews.length}+ Verified Reviews
              </span>
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-105 text-white px-6 py-3.5 rounded-full font-black text-sm sm:text-base shadow-2xl shadow-orange-500/25 transition-all duration-300 active:scale-95"
          >
            <MessageSquarePlus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            Share Your Experience
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-slate-900/70 rounded-2xl p-8 text-center shadow-lg border border-white/10">
            <p className="text-slate-400">
              No reviews yet. Be the first to add one.
            </p>
          </div>
        ) : (
          <div className="relative overflow-hidden min-h-[230px] sm:min-h-[260px]">
            <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none" />

            <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none" />

            <div
              className="flex gap-4 py-3 sm:gap-6 w-max animate-review-scroll will-change-transform transform-gpu"
              style={{
                animationDuration: `${Math.max(reviews.length * 5, 20)}s`,
              }}
            >
              {[...reviews, ...reviews].map((review, index) => (
                <div
                  key={`${review.id}-${index}`}
                  className="w-[280px] sm:w-[340px] shrink-0"
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 h-dvh bg-black/70 flex items-end sm:items-center justify-center z-[90] p-0 sm:p-4 overflow-hidden overscroll-none touch-none">
          <div className="bg-slate-900 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-2xl border border-white/10 touch-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Add Your Review
                </h3>

                <p className="text-sm text-slate-400">
                  It will appear within 24 hours.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Your Name
                </label>

                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>

              {/* <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile or Email
                </label>

                <input
                  type="text"
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                  placeholder="Mobile or email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div> */}

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Rating
                </label>

                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const value = index + 1;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className="p-1"
                      >
                        <Star
                          className={`w-8 h-8 transition-all ${
                            value <= rating
                              ? "text-yellow-400 fill-yellow-400 scale-110"
                              : "text-slate-600"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Review
                </label>

                <div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your experience..."
                    rows={5}
                    maxLength={160}
                    className="w-full px-4 py-3 text-sm sm:text-base bg-slate-800 border border-white/10 text-white placeholder-slate-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 resize-none shadow-sm"
                  />

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[11px] sm:text-xs text-slate-500">
                      Keep it short and helpful.
                    </p>

                    <span
                      className={`text-[11px] sm:text-xs font-semibold px-2 py-1 rounded-full ${
                        message.length > 145
                          ? "bg-orange-500/10 text-orange-400"
                          : "bg-white/5 text-slate-400"
                      }`}
                    >
                      {message.length}/160
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={submitReview}
                disabled={submitting}
                className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Submitting..." : "Submit Review"}
              </button>

              <p className="text-xs text-slate-500 text-center">
                One review allowed every 1 hour on this device. Reviews will
                appear after 24 hours.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <div className="group relative bg-slate-900/70 backdrop-blur-sm rounded-3xl p-4 sm:p-6 shadow-md sm:shadow-lg border border-white/10 md:hover:border-fuchsia-500/40 md:hover:shadow-[0_0_25px_rgba(217,70,239,0.2)] md:hover:-translate-y-1 transition-all duration-300 min-h-[210px] sm:min-h-[230px] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400" />
      <Quote className="absolute -top-1 right-3 w-14 h-14 text-white/5 rotate-6" fill="currentColor" />

      <div className="relative flex items-start gap-3 mb-4">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white flex items-center justify-center font-extrabold shadow-md shrink-0">
          {review.customer_name?.charAt(0)?.toUpperCase() || "G"}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-bold text-white truncate text-sm sm:text-base">
                {review.customer_name}
              </h3>

              <p className="text-[11px] sm:text-xs text-lime-400 font-bold mt-0.5">
                Verified Customer
              </p>
            </div>

            <span className="text-[10px] sm:text-[11px] text-slate-500 shrink-0">
              {new Date(review.created_at).toLocaleString([], {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              index < review.rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-slate-700"
            }`}
          />
        ))}
      </div>

      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-5">
        “{review.message}”
      </p>
    </div>
  );
};

export default ReviewsSection;