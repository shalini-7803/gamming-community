import React from "react";
import { Gift, Sparkles } from "lucide-react";

const FlashSaleStrip: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-violet-700 via-fuchsia-600 to-violet-700 animate-strip-gradient-flow text-white py-3 shadow-[0_2px_20px_rgba(217,70,239,0.35)]">
      {/* Shimmer sweep */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fuchsia-300/70 to-transparent" />

      <div className="relative z-10 w-full overflow-hidden">
        {/* Scrolling Track */}
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          <MarqueeContent />
          <MarqueeContent /> {/* duplicate for seamless loop */}
        </div>
      </div>
    </div>
  );
};

export default FlashSaleStrip;

/* ---------------- Sub Components ---------------- */

const MarqueeContent = () => (
  <div className="flex items-center gap-x-6 px-4 text-sm sm:text-base">
    <Title />
    <Separator />
    <Offer title="Buy 2 Games" benefit="+10 Days Free" code="PLAY10MORE" />
    <Separator />
    <Offer title="Buy 3 Games" benefit="+20 Days Free" code="PLAY20MORE" />
    <Separator />
  </div>
);

const Title = () => (
  <div className="flex items-center gap-2 font-bold uppercase tracking-wide text-white">
    <Sparkles className="h-4 w-4 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-300 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-300" />
    </span>
    Limited-Time Offers
  </div>
);

const Separator = () => (
  <span className="hidden lg:block text-white/30">|</span>
);

interface OfferProps {
  title: string;
  benefit: string;
  code: string;
}

const Offer: React.FC<OfferProps> = ({ title, benefit, code }) => {
  return (
    <div className="group flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-105">
      <Gift className="h-4 w-4 text-yellow-300 animate-icon-wiggle" />
      <span className="font-medium text-white/90">{title}</span>
      <span className="text-white/50 inline-block animate-arrow-bounce-x">→</span>
      <span className="font-semibold text-white">{benefit}</span>
      <span className="ml-1 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-2.5 py-0.5 text-xs font-bold text-orange-950 shadow-[0_0_10px_rgba(251,191,36,0.5)] animate-loader-breathe">
        {code}
      </span>
    </div>
  );
};
