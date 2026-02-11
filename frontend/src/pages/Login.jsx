import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const inputClassName =
  "mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

const phoneInputClassName =
  "flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export default function Login() {
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [phonePassword, setPhonePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { loginEmployee } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      console.log("Attempting Employee Login...", countryCode + phone);
      await loginEmployee(countryCode + phone, phonePassword);
      console.log("Employee Login Success, Navigating...");
      navigate("/employee-dashboard", { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
      setErrorMsg(err?.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-inter">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-lg font-semibold text-white shadow">
            Yo
          </div>
          <span className="text-lg font-semibold text-blue-700">YVO Systems</span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-6 py-20">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 shadow-xl">
          <div className="space-y-2 text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Employee Login</h1>
            <p className="text-slate-500">Access your personalized workspace</p>
          </div>

          {errorMsg && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center gap-3">
              <span className="shrink-0 text-lg">⚠️</span>
              {errorMsg}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Phone Number</label>
              <div className="flex gap-2.5">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-32 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+971">🇦🇪 +971</option>
                </select>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className={`${phoneInputClassName} !bg-slate-50 focus:!bg-white rounded-xl py-3`}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Security PIN / Password</label>
                <button type="button" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Forgot?</button>
              </div>
              <input
                value={phonePassword}
                onChange={(e) => setPhonePassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`${inputClassName} !bg-slate-50 focus:!bg-white rounded-xl py-3`}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !phone || !phonePassword}
              className={`w-full rounded-xl px-4 py-4 text-sm font-bold text-white shadow-lg transition-all 
                ${submitting || !phone || !phonePassword
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 shadow-blue-500/20"
                }`}
            >
              {submitting ? "Authenticating..." : "Sign In to Workspace"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Company Administrator? <Link to="/company-login" className="font-bold text-blue-600 hover:text-blue-700">Login here</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
