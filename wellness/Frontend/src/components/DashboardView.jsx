/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MOODS } from '../types.js';
import { Heart, Wind, BookOpen, Clock, Settings, Sparkles, LogOut, Sun, CalendarDays } from 'lucide-react';
import { motion } from 'motion/react';

export default function DashboardView({ activeView, onViewChange, currentUser, onLogout, moods, journals }) {
  const userMoods = moods
    .filter((m) => m.userId === currentUser.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const userJournals = journals
    .filter((j) => j.userId === currentUser.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const currentMood = userMoods[0];
  const activeMoodConfig = currentMood ? MOODS[currentMood.mood] : null;

  return (
    <div id="dashboard-view-module" className="space-y-6 font-sans">
      
      {/* Greetings block */}
      <div id="banner-card" className="bg-gradient-to-r from-orange-100/90 via-rose-100/65 to-sky-100/70 p-6 md:p-8 rounded-3xl border border-orange-200/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <Sun className="w-24 h-24 text-amber-500 animate-spin-slow" />
        </div>
        
        <div className="max-w-xl md:max-w-2xl text-left relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl bg-white p-1 rounded-xl shadow-xs">{currentUser.avatar}</span>
            <div className="bg-white/85 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] text-slate-500 font-bold tracking-wider uppercase border border-slate-100">
              Personal Reflection Space
            </div>
          </div>
          
          <h2 id="greeting-hdr" className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
            Hi, {currentUser.name}! ✨
          </h2>
          <p className="text-slate-600 text-xs leading-relaxed max-w-lg">
            This application is designed specifically with soft pastel colors to guide your mind towards calm. Take a moment to log your present energy aura, release stress into the diary, or practice guided deep breathing.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              id="dash-callout-mood"
              onClick={() => onViewChange('mood')}
              className="px-4 py-2 bg-white/95 hover:bg-white text-xs text-slate-700 font-bold rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs cursor-pointer"
            >
              Log State Aura
            </button>
            <button
              id="dash-callout-journal"
              onClick={() => onViewChange('journal')}
              className="px-4 py-2 bg-rose-400 hover:bg-rose-500 text-xs text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer border-none"
            >
              Write Reflection
            </button>
          </div>
        </div>
      </div>

      {/* Quick stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Latest mood card widget */}
        <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm shadow-orange-50/50 flex flex-col justify-between text-left">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400">Current Aura</span>
              <Heart className="w-4 h-4 text-rose-400" />
            </div>

            {activeMoodConfig ? (
              <div id="dash-mood-widget" className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl filter drop-shadow-sm select-none">{activeMoodConfig.emoji}</span>
                  <div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${activeMoodConfig.color} ${activeMoodConfig.textColor} ${activeMoodConfig.borderColor}`}>
                      {activeMoodConfig.label}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono block mt-1">Logged on: {currentMood.date}</span>
                  </div>
                </div>
                <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed italic">
                  "{currentMood.note || 'No notes added to this aura point'}"
                </p>
              </div>
            ) : (
              <div className="space-y-2 py-4">
                <p className="text-slate-400 text-xs">No aura registered yet.</p>
                <button
                  id="btn-nav-mood"
                  onClick={() => onViewChange('mood')}
                  className="text-xs text-rose-500 font-bold hover:underline"
                >
                  Describe your vibe now →
                </button>
              </div>
            )}
          </div>

          {activeMoodConfig && (
            <div className="pt-4 border-t border-slate-50 mt-4">
              <button
                id="btn-mood-update"
                onClick={() => onViewChange('mood')}
                className="text-xs text-slate-400 hover:text-slate-700 font-medium flex items-center gap-1 bg-transparent border-none cursor-pointer"
              >
                Log updated emotion state
              </button>
            </div>
          )}
        </div>

        {/* Latest journal card widget */}
        <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm shadow-orange-50/50 flex flex-col justify-between text-left">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400">Latest Diary Page</span>
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>

            {userJournals.length > 0 ? (
              <div id="dash-journal-widget" className="space-y-2">
                <h4 className="font-bold text-slate-800 text-xs truncate">
                  {userJournals[0].title}
                </h4>
                <p className="text-slate-500 text-xs line-clamp-4 leading-relaxed">
                  {userJournals[0].content}
                </p>
              </div>
            ) : (
              <div className="space-y-2 py-4">
                <p className="text-slate-400 text-xs">Your personal book is empty.</p>
                <button
                  id="btn-nav-journal"
                  onClick={() => onViewChange('journal')}
                  className="text-xs text-emerald-600 font-bold hover:underline"
                >
                  Write down your first line →
                </button>
              </div>
            )}
          </div>

          {userJournals.length > 0 && (
            <div className="pt-4 border-t border-slate-50 mt-4">
              <button
                id="btn-journal-explore"
                onClick={() => onViewChange('journal')}
                className="text-xs text-slate-400 hover:text-slate-700 font-medium flex items-center gap-1 bg-transparent border-none cursor-pointer"
              >
                Browse through all sheets
              </button>
            </div>
          )}
        </div>

        {/* Dynamic mindfulness call to action */}
        <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm shadow-orange-50/50 flex flex-col justify-between text-left">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400">Guided Coping</span>
              <Wind className="w-4 h-4 text-sky-400" />
            </div>

            <div className="space-y-2 py-2">
              <h4 className="font-bold text-slate-800 text-xs">Nervous system reset</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Slow down your breathing cycle using our standard 4-4-6 guided visual breathing module. Instant cortisol relief.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 mt-4">
            <button
              id="btn-nav-mindful"
              onClick={() => onViewChange('mindfulness')}
              className="px-4 py-1.5 w-full bg-sky-50 text-sky-700 border border-sky-100 hover:bg-sky-100 text-xs font-semibold rounded-xl text-center cursor-pointer"
            >
              Launch Breathing Loop
            </button>
          </div>
        </div>

      </div>

      {/* Profile summary & system credits */}
      <div className="bg-slate-50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-100">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-lg select-none">
            {currentUser.avatar}
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-mono">Authenticated via simulated profile</span>
            <span className="text-xs font-bold text-slate-700">{currentUser.name} — {currentUser.email}</span>
          </div>
        </div>

        <button
          id="btn-logout"
          onClick={onLogout}
          className="px-4 py-2 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-xs text-slate-500 font-bold transition-all flex items-center gap-1 cursor-pointer bg-transparent border-none"
        >
          <LogOut className="w-4 h-4" />
          Disconnect profile
        </button>
      </div>

    </div>
  );
}
