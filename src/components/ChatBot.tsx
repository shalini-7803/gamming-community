import React, { useEffect, useRef, useState } from "react";
import { Bot, X, Send, MessageCircle } from "lucide-react";
import { chatbotFaqService, ChatbotFaq, gamesService } from "../services/supabaseService";
import { Game, getPlatformsForGame, getStartingPrice } from "../config/supabase";

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

const NOT_FOUND_ANSWER =
  "Sorry! 😔 I couldn't find that in our current catalog. We add new titles all the time — browse everything on our Games page, or message us on WhatsApp and we'll try to arrange it for you.";

const AVAILABILITY_HINTS = [
  "available",
  "availability",
  "in stock",
  "stock",
  "do you have",
  "have this",
  "is there",
  "hai kya",
  "kya hai",
  "milega",
  "milegi",
];

const STOPWORDS = new Set([
  "the", "is", "this", "that", "game", "games", "available", "availability",
  "buy", "rent", "purchase", "price", "cost", "for", "and", "of", "a", "an",
  "in", "on", "to", "do", "you", "have", "has", "it", "kya", "hai", "kaise",
  "how", "what", "when", "where", "which", "does", "are", "can", "i", "get",
  "want", "need", "looking", "there", "with", "please", "pls", "hi", "hii",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

function findGameMatch(input: string, games: Game[]): Game | null {
  const inputTokens = tokenize(input);
  if (inputTokens.length === 0) return null;

  let best: Game | null = null;
  let bestScore = 0;

  for (const game of games) {
    const titleTokens = tokenize(game.title);
    const overlap = titleTokens.filter((t) => inputTokens.includes(t)).length;
    if (overlap > bestScore) {
      bestScore = overlap;
      best = game;
    }
  }

  return best;
}

function describeGame(game: Game): string {
  const platforms = getPlatformsForGame(game).join(", ") || "multiple platforms";
  const price = getStartingPrice(game);
  const path = game.category === "subscription" ? "subscriptions" : "games";
  const link = `${window.location.origin}/${path}/${game.id}`;

  return (
    `Yes! 🎮 "${game.title}" is available.\n` +
    `💰 Starting from ₹${price.toLocaleString("en-IN")}\n` +
    `🖥️ Platforms: ${platforms}\n\n` +
    `Check full details here: ${link}`
  );
}

function looksLikeAvailabilityQuery(input: string): boolean {
  const normalized = input.toLowerCase();
  return AVAILABILITY_HINTS.some((hint) => normalized.includes(hint));
}

function findAnswer(input: string, faqs: ChatbotFaq[], games: Game[]): string {
  const gameMatch = findGameMatch(input, games);
  if (gameMatch) {
    return describeGame(gameMatch);
  }

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

  if (best) return best.answer;

  return looksLikeAvailabilityQuery(input) ? NOT_FOUND_ANSWER : FALLBACK_ANSWER;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [faqs, setFaqs] = useState<ChatbotFaq[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hii! 👋 How are you? What product are you looking for today? Pick a topic below or type your question, and I'll help however I can.",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatbotFaqService.getAll().then(setFaqs);
    gamesService.getAll({ limit: 1000 }).then((res) => setGames(res.data));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isOpen]);

  const respondTo = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { sender: "user", text },
      { sender: "bot", text: findAnswer(text, faqs, games) },
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
        className="fixed bottom-36 right-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-40"
        title={isOpen ? "Close chat" : "Chat with us"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-52 right-6 w-[calc(100vw-3rem)] max-w-sm h-[28rem] max-h-[70vh] bg-slate-900 light:bg-white border border-white/10 light:border-gray-200 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden transition-colors duration-300">
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
