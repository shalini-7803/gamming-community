import React, { useState } from "react";
import { Lock, Mail, AlertCircle, X, Gamepad2 } from "lucide-react";
import { toast } from "react-toastify";
import { authService } from "../services/authService";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError("");
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const result = await authService.login(email.trim(), password);

      if (!result.success) {
        setError(result.error || "Login failed");
        return;
      }

      toast.success("Admin login successful");
      resetForm();
      onLogin();
      onClose();
    } catch (error) {
      console.error("Login submit error:", error);
      setError("Something went wrong during login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-modal-backdrop-in">
      <div className="relative w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 light:bg-white border border-white/10 light:border-gray-200 shadow-[0_0_50px_rgba(139,92,246,0.25)] animate-modal-pop-in">
        {/* Ambient glow */}
        <div className="absolute -top-16 -left-10 w-40 h-40 bg-violet-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-10 w-40 h-40 bg-fuchsia-600/25 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 light:text-gray-500 hover:text-white light:hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-white/10 light:hover:bg-gray-100 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-md opacity-60 animate-loader-breathe" />
              <div className="relative w-16 h-16 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-slate-900 light:bg-white rounded-full p-1 border border-white/10 light:border-gray-200">
                <Gamepad2 className="w-4 h-4 text-fuchsia-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-300 via-fuchsia-300 to-orange-300 bg-clip-text text-transparent mb-2">
              Admin Login
            </h2>
            <p className="text-slate-400 light:text-gray-500 text-sm">
              Sign in to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 light:text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 light:text-gray-500 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 light:bg-white border border-white/10 light:border-gray-300 text-white light:text-gray-900 placeholder-slate-500 light:placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-shadow"
                  placeholder="Enter admin email"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 light:text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 light:text-gray-500 w-4 h-4" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 light:bg-white border border-white/10 light:border-gray-300 text-white light:text-gray-900 placeholder-slate-500 light:placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-shadow"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-[0_0_25px_rgba(217,70,239,0.4)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting && (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-xs text-slate-500 light:text-gray-500 text-center mt-4">
            Customer login is disabled. This login is for admin access only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
