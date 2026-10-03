/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MOODS } from '../types.js';
import { Smile, Calendar, Clock, BarChart3, Check } from 'lucide-react';
import { motion } from 'motion/react';

export default function MoodTrackerView({ moods, onAddMood, userId }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [successMsg, setSuccessMsg] = useState('');

  const userMoods = moods
    .filter((m) => m.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const moodCounts = userMoods.reduce((acc, curr) => {
    acc[curr.mood] = (acc[curr.mood] || 0) + 1;
    return acc;
  }, {});

  const totalLogs = userMoods.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMood) {
      alert('Please choose an emotional aura first!');
      return;
    }

    onAddMood(selectedMood, note, customDate);
    setSuccessMsg('Your mood aura was added and saved successfully! ✨');
    setNote('');
    setSelectedMood(null);

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <div id="mood-tracker-view" className="space-y-6 font-sans">
      
      {/* Logging form card */}
      <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm shadow-orange-50/50">
        <h2 id="log-mood-hdr" className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Smile className="w-5 h-5 text-rose-400" />
          How are you feeling today?
        </h2>
        <p className="text-slate-400 text-xs mt-1 mb-6">Select the emotional vibration that closest matches your state of mind right now.</p>

        {successMsg && (
          <div id="mood-logged-alert" className="mb-6 p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl flex items-center gap-2.5 text-xs font-semibold animate-pulse">
            <span className="text-lg">✨</span>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood Selector Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
            {Object.values(MOODS).map((m) => {
              const isSelected = selectedMood === m.type;
              return (
                <button
                  type="button"
                  key={m.type}
                  id={`mood-btn-${m.type}`}
                  onClick={() => setSelectedMood(m.type)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? `${m.hoverColor} ${m.borderColor} ring-2 ring-rose-200 scale-105 font-semibold shadow-sm`
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-3xl mb-1.5 filter drop-shadow-sm select-none">{m.emoji}</span>
                  <span className={`text-[11px] tracking-tight ${isSelected ? 'text-slate-800 font-bold' : 'text-slate-500'}`}>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Details input section */}
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 pt-3 border-t border-slate-50"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="mood-textarea">
                  Why do you feel this way? (Optional Reflection)
                </label>
                <textarea
                  id="mood-textarea"
                  placeholder={`Today feels ${MOODS[selectedMood].label.toLowerCase()} because...`}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-4 bg-orange-50/20 border border-orange-100/70 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 min-h-[80px]"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1" htmlFor="mood-date">
                    Vibe Date
                  </label>
                  <input
                    id="mood-date"
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="p-1 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 outline-none"
                  />
                </div>

                <button
                  id="btn-save-mood"
                  type="submit"
                  className="px-6 py-2.5 bg-rose-400 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-rose-100 cursor-pointer transition-all border-none"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Emotion Record
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </div>

      {/* Analytics Bento block */}
      {totalLogs > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm md:col-span-2">
            <h3 id="trends-hdr" className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mb-4">
              <BarChart3 className="w-4 h-4 text-rose-400" />
              Emotional Trend Analytics
            </h3>
            <div className="flex flex-wrap gap-2 items-center font-sans">
              {Object.keys(MOODS).map((mKey) => {
                const config = MOODS[mKey];
                const count = moodCounts[mKey] || 0;
                const percentage = totalLogs > 0 ? Math.round((count / totalLogs) * 100) : 0;
                return (
                  <div
                    key={mKey}
                    id={`stat-bar-${mKey}`}
                    className="flex-1 min-w-[80px] p-3 rounded-2xl border border-slate-100/80 bg-slate-50 text-center"
                  >
                    <span className="text-lg block mb-0.5">{config.emoji}</span>
                    <span className="text-[10px] text-slate-400 font-medium block truncate capitalize">{config.type}</span>
                    <strong className="text-xs text-slate-700 block mt-1">
                      {count} <span className="text-[9px] text-slate-400 font-normal">({percentage}%)</span>
                    </strong>
                    <div className="w-full bg-slate-200/60 rounded-full h-1 mt-2 overflow-hidden">
                      <div
                        className="bg-rose-400 h-1 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-rose-50/50 rounded-3xl p-5 border border-rose-100/50 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-rose-500 tracking-widest uppercase">Self Reflection</span>
              <h4 id="insights-hdr" className="text-base font-bold text-slate-800 mt-1">Mental Health Quote</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed italic">
                "What lies behind us and what lies before us are tiny matters compared to what lies within us."
              </p>
            </div>
            <div className="pt-4 border-t border-rose-100/40 text-slate-400 text-[11px] mt-4 flex items-center gap-1">
              <span>Total recorded events:</span>
              <strong className="text-rose-600 text-xs font-semibold">{totalLogs}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Mood Entry History Logs */}
      <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm shadow-orange-50/50">
        <h3 id="history-hdr" className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-rose-400" />
          Mood Log History
        </h3>

        {userMoods.length === 0 ? (
          <div className="text-center py-8 text-slate-400 space-y-2">
            <span className="text-3xl">🧩</span>
            <p className="text-xs">No emotional logs recorded yet for this profile.</p>
            <p className="text-[10px] text-slate-300">Tap one of the emojis above to log your first emotional checkpoint!</p>
          </div>
        ) : (
          <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
            {userMoods.map((entry) => {
              const mConf = MOODS[entry.mood] || MOODS.calm;
              return (
                <div
                  key={entry.id}
                  id={`mood-log-card-${entry.id}`}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-orange-50/10 border border-orange-100/50 hover:bg-orange-50/35 transition-all text-left"
                >
                  <div className="text-3xl bg-white p-2 rounded-xl shadow-sm border border-slate-100 select-none flex items-center justify-center">
                    {mConf.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${mConf.color} ${mConf.textColor} border ${mConf.borderColor}`}>
                        {mConf.label}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {entry.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {entry.note || <span className="text-slate-400 italic">No notes added to this entry</span>}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
