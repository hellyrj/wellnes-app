/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Heart, Mail, Lock, UserPlus, LogIn, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { authApi } from '../api/auth.js';

export default function LoginView({ onLogin }) {
  const [activeTab, setActiveTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const response = await authApi.login({ email, password });
      onLogin(response.data.data.user);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const response = await authApi.register({ name, email, password });
      setError(response.data.message || 'Registration successful! Please check your email to verify your account.');
      // Don't auto-login after registration since email verification is required
      setActiveTab('signin');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-container" className="w-full max-w-md mx-auto bg-white rounded-3xl border border-orange-100 shadow-xl shadow-orange-50/50 overflow-hidden">
      {/* Brand Header */}
      <div className="bg-gradient-to-b from-orange-50 to-white p-8 pb-4 text-center relative font-sans">
        <div className="absolute top-4 right-4 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>
        <div className="mx-auto w-16 h-16 bg-rose-100/80 rounded-2xl flex items-center justify-center mb-4 border border-rose-200">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-300" />
        </div>
        <h1 id="app-title" className="text-2xl font-bold tracking-tight text-slate-800">Young Mental Wellness</h1>
        <p className="text-slate-400 text-sm mt-1">A gentle space for self-reflection & mindful presence</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 px-6 bg-slate-50/50 font-sans">
        <button
          id="tab-signin"
          onClick={() => { setActiveTab('signin'); setError(''); }}
          className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'signin' ? 'border-rose-400 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Sign In
        </button>
        <button
          id="tab-signup"
          onClick={() => { setActiveTab('signup'); setError(''); }}
          className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'signup' ? 'border-rose-400 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          New Account
        </button>
      </div>

      <div className="p-8 font-sans">
        {error && (
          <div id="error-alert" className="mb-4 p-3 text-xs bg-rose-50 text-rose-700 border border-rose-100 rounded-xl leading-relaxed">
            {error}
          </div>
        )}

        {/* Sign In form */}
        {activeTab === 'signin' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="signin-email">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="signin-email"
                    type="email"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="signin-password">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all"
                  />
                </div>
              </div>

              <button
                id="btn-signin-submit"
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3 bg-rose-400 hover:bg-rose-500 text-white font-semibold rounded-xl text-sm shadow-md shadow-rose-100 transition-all flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                {loading ? 'Signing in...' : 'Step Inside'}
              </button>
            </form>
          </motion.div>
        )}

        {/* Sign Up form */}
        {activeTab === 'signup' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="signup-name">Your Nickname</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <UserPlus className="w-4 h-4" />
                  </span>
                  <input
                    id="signup-name"
                    type="text"
                    placeholder="e.g. Dreamer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={20}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="signup-email">Your Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="signup-email"
                    type="email"
                    placeholder="dreamer@mentalwellness.app"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="signup-password">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all"
                  />
                </div>
              </div>

              <button
                id="btn-signup-submit"
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3 bg-emerald-400 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-50 transition-all flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? 'Creating account...' : 'Initialize Profile'}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
