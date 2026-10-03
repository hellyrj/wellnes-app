/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MOODS } from '../types.js';
import { Search, Plus, Calendar, Clock, Edit3, Trash2, BookOpen, ArrowLeft, Save, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function JournalView({ journals, onAddJournal, onEditJournal, onDeleteJournal, userId }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState('all');
  
  const [isComposing, setIsComposing] = useState(false);
  const [currentEditingEntry, setCurrentEditingEntry] = useState(null);

  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [entryMood, setEntryMood] = useState('calm');

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const userEntries = journals
    .filter((j) => j.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredEntries = userEntries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = filterMood === 'all' || entry.mood === filterMood;
    return matchesSearch && matchesMood;
  });

  const handleStartCompose = () => {
    setEntryTitle('');
    setEntryContent('');
    setEntryMood('calm');
    setCurrentEditingEntry(null);
    setIsComposing(true);
    setSelectedEntry(null);
  };

  const handleStartEdit = (entry) => {
    setEntryTitle(entry.title);
    setEntryContent(entry.content);
    setEntryMood(entry.mood);
    setCurrentEditingEntry(entry);
    setIsComposing(true);
    setSelectedEntry(null);
  };

  const handleSaveEntry = (e) => {
    e.preventDefault();
    if (!entryTitle.trim() || !entryContent.trim()) {
      alert('Please fill in both a title and some personal reflections.');
      return;
    }

    if (currentEditingEntry) {
      onEditJournal(currentEditingEntry.id, entryTitle, entryContent, entryMood);
    } else {
      onAddJournal(entryTitle, entryContent, entryMood);
    }

    setIsComposing(false);
    setCurrentEditingEntry(null);
  };

  const handleDelete = (id) => {
    onDeleteJournal(id);
    setConfirmDeleteId(null);
    setSelectedEntry(null);
  };

  return (
    <div id="journal-view-module" className="space-y-6 font-sans">
      
      {/* Upper Navigation/Search Action bar */}
      <AnimatePresence mode="wait">
        {!isComposing ? (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 id="journal-hdr" className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-rose-400" />
                  Your Dreamer Diary
                </h2>
                <p className="text-slate-400 text-xs mt-1">A safe, personal sanctuary where your thoughts, struggles, and values live.</p>
              </div>

              <button
                id="btn-new-journal"
                onClick={handleStartCompose}
                className="self-start sm:self-center px-5 py-2.5 bg-rose-400 hover:bg-rose-500 text-white font-semibold rounded-2xl text-xs flex items-center gap-1.5 shadow-md shadow-rose-100 cursor-pointer transition-all hover:scale-102 border-none"
              >
                <Plus className="w-4 h-4" />
                Write New Entry
              </button>
            </div>

            {/* Filter and Search Panels */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  id="journal-search-input"
                  type="text"
                  placeholder="Search logs by words or expressions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-orange-100 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 shadow-sm shadow-orange-50/10 placeholder-slate-400 text-slate-700"
                />
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Filter className="w-3.5 h-3.5" />
                </span>
                <select
                  id="journal-mood-filter"
                  value={filterMood}
                  onChange={(e) => setFilterMood(e.target.value)}
                  className="w-full pl-9 pr-6 py-2.5 bg-white border border-orange-100 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 shadow-sm shadow-orange-50/10 text-slate-600 appearance-none outline-none"
                >
                  <option value="all">🔍 Show All Mood Tags</option>
                  {Object.values(MOODS).map((m) => (
                    <option key={m.type} value={m.type}>{m.emoji} Only {m.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Grid of Journal Cards */}
            {filteredEntries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-100 text-center space-y-3 shadow-sm shadow-orange-50/30">
                <span className="text-4xl select-none">🕊️</span>
                <p className="text-slate-500 font-semibold text-sm">No journal sheets match criteria.</p>
                <p className="text-slate-400 text-xs">
                  {userEntries.length === 0 
                    ? "Your journey log starts as an empty page. Let's write down your memories or release your stress!"
                    : "No entries match your word search or mood filters. Try clearing filters!"}
                </p>
                {userEntries.length === 0 && (
                  <button
                    onClick={handleStartCompose}
                    className="mx-auto mt-2 px-4 py-2 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Create First Sheet
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredEntries.map((entry) => {
                  const mConf = MOODS[entry.mood] || MOODS.calm;
                  const truncatedContent = entry.content.length > 120 
                    ? entry.content.substring(0, 115) + '...' 
                    : entry.content;
                  const readableDate = new Date(entry.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <motion.div
                      layout
                      id={`journal-entry-card-${entry.id}`}
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      className={`rounded-3xl p-5 border text-left cursor-pointer transition-all transform hover:-translate-y-1 hover:shadow-md flex flex-col justify-between min-h-[190px] ${mConf.color} ${mConf.borderColor}`}
                    >
                      <div>
                        {/* Tags and Emotes header */}
                        <div className="flex items-center justify-between mb-3 text-[10px]">
                          <span className="flex items-center gap-1 text-slate-400 bg-white/70 px-2.5 py-1 rounded-full shadow-xs">
                            <Clock className="w-3 h-3" />
                            {readableDate}
                          </span>
                          <span className="text-xl filter drop-shadow-xs" title={`Mood: ${mConf.label}`}>
                            {mConf.emoji}
                          </span>
                        </div>

                        {/* Title & Body paragraph */}
                        <h4 className="font-bold text-slate-800 text-sm tracking-tight mb-2 truncate">
                          {entry.title}
                        </h4>
                        <p className="text-slate-600 text-xs line-clamp-4 leading-relaxed">
                          {truncatedContent}
                        </p>
                      </div>

                      {/* Footer read action */}
                      <div className="mt-4 pt-3 border-t border-slate-900/5 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-medium hover:text-rose-600 text-rose-500 flex items-center gap-0.5">
                          Read reflections
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(entry);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 bg-white/50 rounded-lg cursor-pointer border-none"
                            title="Edit sheet"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteId(entry.id);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 bg-white/50 rounded-lg cursor-pointer border-none"
                            title="Delete sheet"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          /* Composer layout */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm shadow-orange-50/50"
          >
            <div className="flex items-center gap-2 mb-4">
              <button
                id="btn-back-composer"
                onClick={() => setIsComposing(false)}
                className="mr-1 p-1.5 hover:bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:text-slate-700 transition-all cursor-pointer bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 id="composer-hdr" className="text-base font-bold text-slate-800">
                  {currentEditingEntry ? "Revise Journal Page" : "Compose Mindful Reflection"}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">Let your thoughts bubble up. There are no rules, no grades, and no judgment here.</p>
              </div>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="diary-title">Diary Title</label>
                <input
                  id="diary-title"
                  type="text"
                  placeholder="Give this state of mind a short name..."
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  maxLength={65}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1" htmlFor="diary-content">Your Reflection</label>
                <textarea
                  id="diary-content"
                  placeholder="Record what happened today, how you felt, what made you struggle, and what simple things brought you hope..."
                  value={entryContent}
                  onChange={(e) => setEntryContent(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 text-slate-700 placeholder-slate-400 min-h-[180px] leading-relaxed"
                />
              </div>

              {/* Mood picker for final submission */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Associate page mood vibe:</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {Object.values(MOODS).map((m) => {
                    const isSelected = entryMood === m.type;
                    return (
                      <button
                        type="button"
                        key={m.type}
                        id={`comp-mood-${m.type}`}
                        onClick={() => setEntryMood(m.type)}
                        className={`py-2 rounded-xl flex flex-col items-center justify-center border text-[10px] transition-all cursor-pointer ${
                          isSelected 
                            ? `${m.color} ${m.borderColor} font-semibold ring-2 ring-rose-200 scale-102` 
                            : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-500'
                        }`}
                      >
                        <span className="text-xl mb-1 filter drop-shadow-xs">{m.emoji}</span>
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="px-4 py-2 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-semibold cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-journal"
                  type="submit"
                  className="px-6 py-2 bg-rose-400 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-rose-100 cursor-pointer transition-all border-none"
                >
                  <Save className="w-3.5 h-3.5" />
                  Safely Lock Page
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reader Dialog Overlay Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <div id="journal-reader-overlay" className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-lg bg-white rounded-3xl overflow-hidden border shadow-2xl relative ${MOODS[selectedEntry.mood]?.borderColor || 'border-slate-100'}`}
            >
              {/* Colored top indicator */}
              <div className={`h-3 ${MOODS[selectedEntry.mood]?.color || 'bg-slate-50'}`} />

              <div className="p-6 md:p-8 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(selectedEntry.date).toLocaleString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <h3 id="reader-title" className="text-lg font-bold text-slate-800 tracking-tight">
                      {selectedEntry.title}
                    </h3>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl filter drop-shadow-xs select-none">
                    {MOODS[selectedEntry.mood]?.emoji || '😌'}
                  </div>
                </div>

                <div className="bg-slate-50/50 border border-slate-100/50 rounded-2xl p-4 max-h-[250px] overflow-y-auto">
                  <p id="reader-content" className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedEntry.content}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    id="btn-delete-reader"
                    onClick={() => setConfirmDeleteId(selectedEntry.id)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer bg-transparent border-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Destructive Burn
                  </button>

                  <div className="flex gap-2">
                    <button
                      id="btn-edit-reader"
                      onClick={() => handleStartEdit(selectedEntry)}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs text-slate-600 font-semibold flex items-center gap-1 cursor-pointer bg-transparent"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Modify Entry
                    </button>
                    <button
                      id="btn-close-reader"
                      onClick={() => setSelectedEntry(null)}
                      className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer border-none"
                    >
                      Keep Private
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Danger Delete Confirmation Dialog Overlay */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div id="delete-confirmation-overlay" className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-55">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 border border-rose-100 shadow-xl"
            >
              <h4 className="text-sm font-bold text-slate-800">Do you really want to burn this reflection?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                This will irretrievably delete your saved thoughts and emotional snapshot.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-500 text-xs font-semibold hover:bg-slate-50 cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button
                  id="btn-confirm-delete"
                  type="button"
                  onClick={() => handleDelete(confirmDeleteId)}
                  className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold cursor-pointer border-none"
                >
                  Irreversibly Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
