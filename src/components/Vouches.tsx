import React from 'react';
import { Star } from 'lucide-react';
import { useTestimonials } from '../hooks/useSupabaseData';
import Loader from './Loader';

const SectionHeading: React.FC = () => (
  <div className="flex items-center justify-center gap-3 mb-3">
    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.45)] flex-shrink-0">
      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" />
    </div>
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-300 via-fuchsia-300 to-orange-300 light:from-violet-600 light:via-fuchsia-600 light:to-orange-600 bg-clip-text text-transparent">
      Customer Screenshots
    </h2>
  </div>
);

const Vouches: React.FC = () => {
  const { testimonials, loading, error } = useTestimonials();

  if (loading) {
    return (
      <section className="relative py-8 sm:py-12 md:py-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 light:from-slate-50 light:via-blue-50 light:to-orange-50 overflow-hidden transition-colors duration-300">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-8">
            <SectionHeading />
            <p className="text-slate-400 light:text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
              Real phone screenshots from our satisfied gaming community
            </p>
          </div>
          <Loader size="large" message="Loading customer testimonials..." />
        </div>
      </section>
    );
  }

  if (error || testimonials.length === 0) {
    return (
      <section className="relative py-8 sm:py-12 md:py-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 light:from-slate-50 light:via-blue-50 light:to-orange-50 overflow-hidden transition-colors duration-300">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-8">
            <SectionHeading />
            <p className="text-slate-400 light:text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
              Real phone screenshots from our satisfied gaming community
            </p>
          </div>
          <div className="text-center py-8">
            <p className="text-slate-400 light:text-gray-500">No testimonials available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-8 sm:py-12 md:py-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 light:from-slate-50 light:via-blue-50 light:to-orange-50 overflow-hidden transition-colors duration-300">
      {/* Ambient neon glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl animate-loader-drift" />
        <div
          className="absolute bottom-0 right-1/4 w-72 h-72 bg-fuchsia-600/15 rounded-full blur-3xl animate-loader-drift"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="relative container mx-auto px-3 sm:px-4">
        <div className="text-center mb-8">
          <SectionHeading />
          <p className="text-slate-400 light:text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
            Real phone screenshots from our satisfied gaming community
          </p>
        </div>

        {/* Infinite Scrolling Section */}
        <div className="relative max-w-7xl mx-auto overflow-hidden">
          <div className="flex space-x-4 sm:space-x-6 animate-scroll-fast w-max">
            {/* Duplicate testimonials for seamless scroll */}
            {[...testimonials, ...testimonials].map((vouch, index) => (
              <div key={`${vouch.id ?? index}-${index}`} className="flex-shrink-0">
                <div className="relative bg-gradient-to-b from-violet-950 to-black rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 shadow-[0_0_25px_rgba(139,92,246,0.25)] border border-fuchsia-500/20 transform hover:scale-105 hover:shadow-[0_0_35px_rgba(217,70,239,0.4)] hover:border-fuchsia-400/40 transition-all duration-300">
                  <div className="bg-black rounded-xl sm:rounded-2xl p-0.5 sm:p-1">
                    <div className="relative overflow-hidden rounded-lg sm:rounded-xl">
                      <img
                        src={vouch.image}
                        alt="Customer testimonial screenshot"
                        loading="lazy"
                        decoding="async"
                        className="w-48 sm:w-56 md:w-64 h-auto max-h-80 sm:max-h-96 md:max-h-[28rem] object-cover rounded-lg sm:rounded-xl"
                        style={{ aspectRatio: '9/16' }}
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-0.5 sm:h-1 bg-fuchsia-500/60 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <div className="bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-fuchsia-500/20">
            <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-300 to-fuchsia-300 light:from-violet-600 light:to-fuchsia-600 bg-clip-text text-transparent mb-3">
              Join Thousands of Happy Gamers! 🎮
            </h3>
            <p className="text-slate-300 light:text-gray-700 text-sm sm:text-base">
              Game Smarter, Save Bigger
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vouches;
