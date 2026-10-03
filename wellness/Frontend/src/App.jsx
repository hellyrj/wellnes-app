/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import LoginView from './components/LoginView.jsx';
import MoodTrackerView from './components/MoodTrackerView.jsx';
import JournalView from './components/JournalView.jsx';
import VerifyEmail from './components/VerifyEmail.jsx';
import { LogOut, Heart, BookOpen, Smile, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { authApi } from './api/auth.js';

const DEFAULT_MOODS = [];
const DEFAULT_JOURNALS = [];

export default function App() {
  // ---- DATA STATE ----
  const [moods, setMoods] = useState(() => {
    const saved = localStorage.getItem('wellness_moods');
    return saved ? JSON.parse(saved) : DEFAULT_MOODS;
  });

  const [journals, setJournals] = useState(() => {
    const saved = localStorage.getItem('wellness_journals');
    return saved ? JSON.parse(saved) : DEFAULT_JOURNALS;
  });

  // ---- ACTIVE AUTH & ROUTING STATE ----
  const [currentUser, setCurrentUser] = useState(() => {
    return authApi.getUser();
  });
  
  // Check if we're on verify-email page
  const isVerifyEmailPage = window.location.pathname === '/verify-email';

  // Since the user requested only login, journal, and mood tracker pages,
  // we default the active tab to 'mood' once signed in, allowing easy toggle with 'journal'.
  const [activeTab, setActiveTab] = useState('mood');

  // Toggle dropdown
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('wellness_moods', JSON.stringify(moods));
  }, [moods]);

  useEffect(() => {
    localStorage.setItem('wellness_journals', JSON.stringify(journals));
  }, [journals]);

  // ---- AUTH ACTIONS ----
  const handleLogin = (user) => {
    setCurrentUser(user);
    authApi.setUser(user);
    setActiveTab('mood');
    setShowProfileMenu(false);
  };

  const handleLogout = async () => {
    await authApi.logout();
    setCurrentUser(null);
    setActiveTab('mood');
    setShowProfileMenu(false);
  };

  // ---- APP DATABASE MUTATIONS ----
  const handleAddMood = (mood, note, date) => {
    if (!currentUser) return;
    const newEntry = {
      id: `mood-entry-${Date.now()}`,
      userId: currentUser.id,
      mood,
      note,
      date
    };
    setMoods(prev => [newEntry, ...prev]);
  };

  const handleAddJournal = (title, content, mood) => {
    if (!currentUser) return;
    const newEntry = {
      id: `journal-entry-${Date.now()}`,
      userId: currentUser.id,
      title,
      content,
      mood,
      date: new Date().toISOString()
    };
    setJournals(prev => [newEntry, ...prev]);
  };

  const handleEditJournal = (id, title, content, mood) => {
    setJournals(prev => prev.map(item => item.id === id ? {
      ...item,
      title,
      content,
      mood,
      date: new Date().toISOString()
    } : item));
  };

  const handleDeleteJournal = (id) => {
    setJournals(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div id="app-root-frame" className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800 font-sans">
      
      {/* Top sticky calming header bar */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-orange-50/70 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div 
            onClick={() => currentUser && setActiveTab('mood')} 
            className={`flex items-center gap-2 cursor-pointer ${currentUser ? 'hover:opacity-85' : ''}`}
          >
            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center border border-rose-200">
              <Heart className="w-5.5 h-5.5 text-rose-500 fill-rose-200" />
            </div>
            <div>
              <span id="header-brand" className="font-bold tracking-tight text-slate-800 text-sm md:text-base">AuraMental</span>
              <span className="block text-[10px] text-slate-400 font-medium">Youth Wellness Sanctuary</span>
            </div>
          </div>

          {currentUser ? (
            <div className="relative">
              <button
                id="btn-profile-dropdown"
                onClick={() => setShowProfileMenu(prev => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-orange-50/40 hover:bg-orange-100/40 border border-orange-100 transition-all text-left outline-none cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-white border border-orange-100 flex items-center justify-center text-sm shadow-xs select-none">
                  {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden sm:block text-xs">
                  <strong className="text-slate-800 block truncate max-w-[100px]">{currentUser.name}</strong>
                </div>
              </button>

              {/* Toggle-able Context Menu Dropdown */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden z-50 text-left"
                  >
                    <div className="p-4 border-b border-slate-50 text-xs bg-orange-50/20">
                      <span className="text-slate-400 block font-medium">Signed in as:</span>
                      <strong className="text-slate-700 block truncate font-bold">{currentUser.email}</strong>
                    </div>

                    <button
                      id="btn-logout-action"
                      onClick={handleLogout}
                      className="w-full px-4 py-3 hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-2 border-none transition-all cursor-pointer text-left bg-transparent"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-3 py-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Offline Local Safe Sandbox</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Core Content Stage */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 relative">
        <AnimatePresence mode="wait">
          {isVerifyEmailPage ? (
            <motion.div
              layout
              key="verify-email-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-6"
            >
              <VerifyEmail />
            </motion.div>
          ) : !currentUser ? (
            <motion.div
              layout
              key="auth-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex justify-center items-center py-6"
            >
              <LoginView 
                onLogin={handleLogin} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="navigated-workspaces"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="pb-16"
            >
              <div className="mb-6 bg-orange-100/30 border border-orange-100 p-4 rounded-3xl text-left">
                <h3 className="text-sm font-bold text-slate-800">Welcome back, {currentUser.name}! 🌸</h3>
                <p className="text-slate-500 text-xs mt-1">Explore our simple offline logs for tracking your mental well-being securely.</p>
              </div>

              {activeTab === 'mood' && (
                <MoodTrackerView 
                  moods={moods} 
                  onAddMood={handleAddMood} 
                  userId={currentUser.id} 
                />
              )}

              {activeTab === 'journal' && (
                <JournalView 
                  journals={journals} 
                  onAddJournal={handleAddJournal} 
                  onEditJournal={handleEditJournal} 
                  onDeleteJournal={handleDeleteJournal} 
                  userId={currentUser.id} 
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Calming footer / Dock bar */}
      <footer id="app-dock-bar" className="bg-slate-900 border-t border-slate-800 text-slate-400 p-6 pb-8 text-xs relative">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-1 text-center md:text-left">
            <h4 className="text-slate-200 font-bold text-sm">
              AuraMental Studio
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed max-w-sm">
              Your data stays secure on your machine with 100% private local storage sandboxing.
            </p>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-200 cursor-pointer">Privacy First</span>
            <span className="hover:text-slate-200 cursor-pointer">Support Circle</span>
          </div>
        </div>

        {/* Floating Dock Nav bar for Mobile and Desktop */}
        {currentUser && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-xs px-4 z-40">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-orange-100 p-2 shadow-2xl flex items-center justify-around">
              
              {/* Mood list button */}
              <button
                id="btn-dock-mood"
                onClick={() => { setActiveTab('mood'); setShowProfileMenu(false); }}
                className={`flex flex-col items-center gap-1 p-1.5 px-6 rounded-xl transition-all cursor-pointer border-none bg-transparent ${
                  activeTab === 'mood' 
                    ? 'text-rose-500 font-bold scale-105' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Smile className="w-5 h-5" />
                <span className="text-[10px] tracking-tight">Mood Tracker</span>
              </button>

              {/* Journal list button */}
              <button
                id="btn-dock-journal"
                onClick={() => { setActiveTab('journal'); setShowProfileMenu(false); }}
                className={`flex flex-col items-center gap-1 p-1.5 px-6 rounded-xl transition-all cursor-pointer border-none bg-transparent ${
                  activeTab === 'journal' 
                    ? 'text-rose-500 font-bold scale-105' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="text-[10px] tracking-tight">Journal Diary</span>
              </button>

            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
