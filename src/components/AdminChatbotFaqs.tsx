import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Bot, Pencil, Trash2, Plus, X } from "lucide-react";
import {
  chatbotFaqService,
  ChatbotFaq,
  ChatbotFaqInput,
} from "../services/supabaseService";

const emptyForm: ChatbotFaqInput = {
  question: "",
  keywords: [],
  answer: "",
  sort_order: 0,
};

const AdminChatbotFaqs: React.FC = () => {
  const [faqs, setFaqs] = useState<ChatbotFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ChatbotFaqInput>(emptyForm);
  const [keywordsText, setKeywordsText] = useState("");

  const loadFaqs = async () => {
    setLoading(true);
    const data = await chatbotFaqService.getAll();
    setFaqs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm, sort_order: faqs.length });
    setKeywordsText("");
    setIsFormOpen(true);
  };

  const openEditForm = (faq: ChatbotFaq) => {
    setEditingId(faq.id);
    setForm({
      question: faq.question,
      keywords: faq.keywords,
      answer: faq.answer,
      sort_order: faq.sort_order,
    });
    setKeywordsText(faq.keywords.join(", "));
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setKeywordsText("");
  };

  const handleSave = async () => {
    if (!form.question.trim()) {
      toast.error("Question is required");
      return;
    }
    if (!form.answer.trim()) {
      toast.error("Answer is required");
      return;
    }

    const keywords = keywordsText
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    if (keywords.length === 0) {
      toast.error("Add at least one keyword (comma-separated) so the bot can match this question");
      return;
    }

    const payload: ChatbotFaqInput = { ...form, keywords };

    try {
      if (editingId) {
        await chatbotFaqService.update(editingId, payload);
        toast.success("FAQ updated");
      } else {
        await chatbotFaqService.add(payload);
        toast.success("FAQ created");
      }
      closeForm();
      await loadFaqs();
    } catch (error) {
      console.error("Error saving chatbot FAQ:", error);
      toast.error("Failed to save FAQ. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this chatbot FAQ?")) return;

    try {
      await chatbotFaqService.delete(id);
      toast.success("FAQ deleted");
      await loadFaqs();
    } catch (error) {
      console.error("Error deleting chatbot FAQ:", error);
      toast.error("Failed to delete FAQ. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8 text-violet-500" />
            <h3 className="text-2xl font-bold text-gray-800">
              Chatbot FAQ Management
            </h3>
          </div>
          <button
            onClick={openAddForm}
            className="flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add FAQ</span>
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          These questions and answers power the website's chatbot. Keywords are comma-separated words/phrases —
          if a customer's message contains any of them, this answer is shown.
        </p>

        {isFormOpen && (
          <div className="border border-violet-200 bg-violet-50/60 rounded-2xl p-6 mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-800">
                {editingId ? "Edit FAQ" : "New FAQ"}
              </h4>
              <button onClick={closeForm} className="text-gray-500 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Question
              </label>
              <input
                type="text"
                placeholder="e.g. How do I purchase a game?"
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. purchase, buy, how to buy"
                value={keywordsText}
                onChange={(e) => setKeywordsText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              />
              <p className="text-xs text-gray-500 mt-1">
                Include common ways customers might phrase it, in English and Hindi if relevant.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Answer
              </label>
              <textarea
                placeholder="Bot's reply..."
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeForm}
                className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90"
              >
                {editingId ? "Save Changes" : "Create FAQ"}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 text-center py-8">Loading FAQs...</p>
        ) : faqs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No FAQs yet. Add one to get started.</p>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800">{faq.question}</p>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{faq.answer}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {faq.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => openEditForm(faq)}
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatbotFaqs;
