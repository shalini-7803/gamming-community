import React from 'react';
import { ArrowLeft, Gift, Share2, MessageCircle, Users, Sparkles } from 'lucide-react';

interface ReferAndEarnPageProps {
  onBackToHome: () => void;
}

const steps = [
  {
    number: '1',
    icon: <Share2 className="w-5 h-5" />,
    title: 'Share with a friend',
    description:
      'Tell a friend about Gaming Community, or forward them a game you’re rented/bought from us.',
  },
  {
    number: '2',
    icon: <Users className="w-5 h-5" />,
    title: 'They mention you',
    description:
      'When your friend places their first order, they just let us know your name or mobile number on WhatsApp.',
  },
  {
    number: '3',
    icon: <Gift className="w-5 h-5" />,
    title: 'You both save',
    description:
      'We apply a referral discount to your friend’s order and a thank-you discount to your next one.',
  },
];

const ReferAndEarnPage: React.FC<ReferAndEarnPageProps> = ({ onBackToHome }) => {
  const handleWhatsAppContact = () => {
    const phoneNumber = '919266514434';
    const message = "Hi! I'd like to refer a friend and ask about the referral discount.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <button
          onClick={onBackToHome}
          className="flex items-center space-x-1 sm:space-x-2 text-cyan-600 hover:text-orange-500 transition-colors mb-6 sm:mb-8 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-lg text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Back to Home</span>
        </button>

        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-2 sm:p-3 rounded-full">
              <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Refer &amp; Earn
            </h1>
          </div>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Invite your friends to Gaming Community — when they order, you both get a discount.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/20 space-y-6 sm:space-y-8">
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              How it works
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-cyan-100"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-3">
                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                      {step.number}
                    </div>
                    <div className="text-cyan-600">{step.icon}</div>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-200">
            <h3 className="font-bold text-orange-800 mb-2 text-sm sm:text-base">
              A couple of things to know
            </h3>
            <div className="text-orange-700 text-xs sm:text-sm leading-relaxed space-y-1.5">
              <p>• The referral discount is applied manually once your friend’s order comes through — there’s no separate referral code to track.</p>
              <p>• Your friend just needs to mention your name or mobile number when they message us to order.</p>
              <p>• There’s no limit on how many friends you can refer.</p>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              Ready to invite someone?
            </h2>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base max-w-xl mx-auto">
              Message us on WhatsApp and we’ll walk you through it — or just have your friend
              mention you when they place their order.
            </p>

            <button
              onClick={handleWhatsAppContact}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Ask About Referrals on WhatsApp</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReferAndEarnPage;
