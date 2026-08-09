import React, { useEffect, useRef, useState } from "react";
import { Bot, X, Send, MessageCircle } from "lucide-react";
import { chatbotFaqService, ChatbotFaq } from "../services/supabaseService";

const QUICK_TOPICS = [
  "Rental vs Purchase",
  "How rentals work",
  "Refund policy",
  "PS Plus subscriptions",
  "Contact support",
];

interface Message {
  sender: "bot" | "user";
  text: string;
}

const WHATSAPP_URL =
  "https://wa.me/919266514434?text=" +
  encodeURIComponent("Hi! I have a question about your gaming services.");

const FALLBACK_ANSWER =
  "I can only help with common questions right now (rentals, purchases, refunds, warranty, subscriptions, contact). For anything else, please chat with us directly on WhatsApp.";

function findAnswer(input: string, faqs: ChatbotFaq[]): string {
  const normalized = input.toLowerCase();
  let best: ChatbotFaq | null = null;
  let bestScore = 0;

  for (const faq of faqs) {
    const score = faq.keywords.reduce(
      (acc, kw) => acc + (normalized.includes(kw.toLowerCase()) ? 1 : 0),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      best = faq;
    }
  }

  return best ? best.answer : FALLBACK_ANSWER;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [faqs, setFaqs] = useState<ChatbotFaq[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hi! I'm the Gaming Community assistant. I can answer common questions about rentals, purchases, refunds, warranty, and subscriptions. Pick a topic below or type your question.",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatbotFaqService.getAll().then(setFaqs);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isOpen]);

  const respondTo = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { sender: "user", text },
      { sender: "bot", text: findAnswer(text, faqs) },
    ]);
  };

  const handleQuickTopic = (topic: string) => {
    respondTo(topic);
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    respondTo(trimmed);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 left-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-40"
        title={isOpen ? "Close chat" : "Chat with us"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 w-[calc(100vw-3rem)] max-w-sm h-[28rem] max-h-[70vh] bg-slate-900 light:bg-white border border-white/10 light:border-gray-200 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3">
            <Bot className="w-5 h-5 text-white" />
            <div>
              <p className="text-white font-semibold text-sm leading-tight">
                Gaming Community Assistant
              </p>
              <p className="text-white/70 text-xs leading-tight">
                Answers common questions only
              </p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                      : "bg-white/10 light:bg-gray-100 text-slate-100 light:text-gray-900"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleQuickTopic(topic)}
                    className="text-xs bg-white/10 light:bg-gray-100 hover:bg-white/20 light:hover:bg-gray-200 text-slate-200 light:text-gray-800 border border-white/15 light:border-gray-300 rounded-full px-3 py-1.5 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            )}

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs bg-green-500 hover:bg-green-600 text-white rounded-full px-3 py-2 transition-colors w-fit mx-auto mt-2"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Talk to a human on WhatsApp
            </a>
          </div>

          <div className="flex items-center gap-2 border-t border-white/10 light:border-gray-200 p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your question..."
              className="flex-1 bg-white/10 light:bg-gray-100 text-slate-100 light:text-gray-900 placeholder-slate-400 light:placeholder-gray-500 text-sm rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full p-2.5 hover:opacity-90 transition-opacity flex-shrink-0"
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
