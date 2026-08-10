import React, { useEffect, useState } from "react";
import { Users, RefreshCw, Monitor, Smartphone } from "lucide-react";
import { chatVisitService, ChatVisit } from "../services/supabaseService";

const timeAgo = (isoDate: string): string => {
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const isMobileUA = (ua: string | null): boolean =>
  !!ua && /Mobile|Android|iPhone|iPad/i.test(ua);

const AdminLiveVisitors: React.FC = () => {
  const [visits, setVisits] = useState<ChatVisit[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVisits = async () => {
    setLoading(true);
    const data = await chatVisitService.getAll();
    setVisits(data);
    setLoading(false);
  };

  useEffect(() => {
    loadVisits();
    const interval = setInterval(loadVisits, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-violet-500" />
            <h3 className="text-2xl font-bold text-gray-800">
              Live Visitors
            </h3>
          </div>
          <button
            onClick={loadVisits}
            className="flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Logged every time a visitor's chatbot opens. Auto-refreshes every 30 seconds.
          Contact numbers aren't shown here — browsers don't expose that automatically; it's
          only available if the visitor places an order or shares it in chat.
        </p>

        {loading && visits.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Loading visitors...</p>
        ) : visits.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No visits logged yet.</p>
        ) : (
          <div className="space-y-2">
            {visits.map((visit) => (
              <div
                key={visit.id}
                className="border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {isMobileUA(visit.user_agent) ? (
                    <Smartphone className="w-5 h-5 text-violet-500 flex-shrink-0" />
                  ) : (
                    <Monitor className="w-5 h-5 text-violet-500 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      Visited {visit.page_path || "/"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isMobileUA(visit.user_agent) ? "Mobile" : "Desktop"} · Session{" "}
                      {visit.session_id.slice(0, 8)}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 flex-shrink-0">
                  {timeAgo(visit.opened_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLiveVisitors;
