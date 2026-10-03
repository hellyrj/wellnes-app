/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Wind, Play, Square, CheckCircle, Plus, Trash2, Heart, Moon, Coffee, Footprints, Dumbbell, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_GOALS = [
  { id: 'g-1', title: 'Drink 2 liters of water', completed: false, category: 'water' },
  { id: 'g-2', title: 'Sleep before 10 PM tonight', completed: false, category: 'sleep' },
  { id: 'g-3', title: 'Read a book for 20 minutes', completed: true, category: 'read' },
  { id: 'g-4', title: 'Walk outside for 30 minutes', completed: false, category: 'custom' },
  { id: 'g-5', title: 'Gentle core stretching exercise', completed: false, category: 'exercise' },
];

export default function MindfulnessView() {
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('idle');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [repsDone, setRepsDone] = useState(0);
  const timerRef = useRef(null);

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('mental_wellness_goals');
    return saved ? JSON.parse(saved) : DEFAULT_GOALS;
  });
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('custom');

  useEffect(() => {
    localStorage.setItem('mental_wellness_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    if (!isBreathingActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      setBreathPhase('idle');
      return;
    }

    if (breathPhase === 'idle') {
      setBreathPhase('inhale');
      setSecondsLeft(4);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (breathPhase === 'inhale') {
            setBreathPhase('hold');
            return 4;
          } else if (breathPhase === 'hold') {
            setBreathPhase('exhale');
            return 6;
          } else if (breathPhase === 'exhale') {
            const nextRep = repsDone + 1;
            setRepsDone(nextRep);
            if (nextRep >= 5) {
              setIsBreathingActive(false);
              setBreathPhase('idle');
              alert('Amazing job! You completed all 5 cycles of mindful breathing. Feel the stillness. 🌸');
              setRepsDone(0);
              return 0;
            } else {
              setBreathPhase('inhale');
              return 4;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isBreathingActive, breathPhase, repsDone]);

  const handleStartBreathing = () => {
    setRepsDone(0);
    setBreathPhase('inhale');
    setSecondsLeft(4);
    setIsBreathingActive(true);
  };

  const handleStopBreathing = () => {
    setIsBreathingActive(false);
    setBreathPhase('idle');
    setRepsDone(0);
  };

  const handleToggleGoal = (id) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    const newGoal = {
      id: `custom-goal-${Date.now()}`,
      title: newGoalText.trim(),
      completed: false,
      category: newGoalCategory
    };

    setGoals(prev => [...prev, newGoal]);
    setNewGoalText('');
    setNewGoalCategory('custom');
  };

  const handleDeleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'water': return <Coffee className="w-4 h-4 text-sky-500" />;
      case 'sleep': return <Moon className="w-4 h-4 text-purple-500" />;
      case 'read': return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'exercise': return <Dumbbell className="w-4 h-4 text-emerald-500" />;
      default: return <Footprints className="w-4 h-4 text-rose-500" />;
    }
  };

  const completedCount = goals.filter(g => g.completed).length;
  const progressPercent = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  return (
    <div id="mindfulness-view" className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
      
      {/* GUIDED BREATHING SECTION */}
      <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm shadow-orange-50/50 flex flex-col justify-between">
        <div>
          <h2 id="breathing-hdr" className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Wind className="w-5 h-5 text-sky-400" />
            Vibe Breathing Sandbox
          </h2>
          <p className="text-slate-400 text-xs mt-1 mb-6">
            Inhale calm, exhale anxiety. Let us sync with the rhythmic expansion below to slow down your cortisol spikes.
          </p>

          {/* Core Animated breathing circle */}
          <div className="my-8 flex flex-col items-center justify-center min-h-[220px]">
            <motion.div
              animate={{
                scale: 
                  breathPhase === 'inhale' ? 1.6 :
                  breathPhase === 'hold' ? 1.6 :
                  breathPhase === 'exhale' ? 1.0 : 1.1,
              }}
              transition={{
                duration: breathPhase === 'inhale' ? 4 : breathPhase === 'exhale' ? 6 : 0.8,
                ease: 'easeInOut'
              }}
              className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-colors relative ${
                breathPhase === 'inhale' ? 'bg-sky-100 border border-sky-300 text-sky-800 shadow-lg shadow-sky-50' :
                breathPhase === 'hold' ? 'bg-amber-100 border border-amber-300 text-amber-800 shadow-lg shadow-amber-50' :
                breathPhase === 'exhale' ? 'bg-rose-100 border border-rose-300 text-rose-800 shadow-inner' :
                'bg-slate-50 border border-slate-200 text-slate-500'
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={breathPhase + secondsLeft}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <p className="text-xs uppercase font-extrabold tracking-widest leading-none select-none">
                    {breathPhase === 'idle' ? 'Ready' : breathPhase}
                  </p>
                  {breathPhase !== 'idle' && (
                    <p className="text-3xl font-bold mt-1 font-mono tracking-tighter">
                      {secondsLeft}s
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Little water-ripple border effects */}
              {isBreathingActive && (
                <div className="absolute inset-0 rounded-full border border-sky-400 animate-ping opacity-15 pointer-events-none" />
              )}
            </motion.div>

            {/* Repetitions counters */}
            <div className="mt-8 text-center bg-slate-50 border border-slate-100 rounded-2xl p-2 px-4">
              <span className="text-xs text-slate-500 font-medium">Completed Rhythms: </span>
              <strong className="text-slate-700 text-sm font-bold">{repsDone} / 5</strong>
              <div className="flex gap-1.5 justify-center mt-1.5">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className={`w-2.5 h-2.5 rounded-full border transition-all ${
                      repsDone >= index
                        ? 'bg-sky-400 border-sky-500 scale-110 shadow-xs'
                        : 'bg-slate-200 border-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Breathing control board buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50 p-4 rounded-2xl">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Sequence details</span>
            <span className="text-xs text-slate-600 block mt-0.5">Inhale 4s → Hold 4s → Exhale 6s</span>
          </div>

          {!isBreathingActive ? (
            <button
              id="btn-start-breathing"
              onClick={handleStartBreathing}
              className="px-5 py-2.5 bg-sky-400 hover:bg-sky-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-sky-100 cursor-pointer transition-all border-none"
            >
              <Play className="w-3.5 h-3.5" />
              Begin Breathing
            </button>
          ) : (
            <button
              id="btn-stop-breathing"
              onClick={handleStopBreathing}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all animate-pulse border-none"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              Stop Sandbox
            </button>
          )}
        </div>
      </div>

      {/* SELF-CARE GOALS TRACKER SECTION */}
      <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm shadow-orange-50/50 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h2 id="goals-hdr" className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Your Self-Care Goals
            </h2>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-100 font-bold font-sans">
              {progressPercent}% completed
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1 mb-4">Set simple, realistic wellness milestones. Building habits step-by-step.</p>

          {/* Goal Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6 overflow-hidden">
            <div
              className="bg-emerald-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Goal Creator Inline Form */}
          <form onSubmit={handleCreateGoal} className="flex gap-2 mb-6">
            <select
              id="goal-category-select"
              value={newGoalCategory}
              onChange={(e) => setNewGoalCategory(e.target.value)}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-200 outline-none"
            >
              <option value="custom">🌸 Custom</option>
              <option value="water">💧 Water</option>
              <option value="sleep">🌙 Sleep</option>
              <option value="read">📚 Read</option>
              <option value="exercise">💪 Exercise</option>
            </select>
            <input
              id="goal-title-input"
              type="text"
              placeholder="Add healthy habit (e.g., walk dog)..."
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 placeholder-slate-400"
            />
            <button
              id="btn-add-goal"
              type="submit"
              className="p-2.5 bg-emerald-400 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer hover:scale-105 border-none"
              title="Add task"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          {/* List of current goals */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {goals.map((g) => (
              <div
                key={g.id}
                id={`goal-item-${g.id}`}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                  g.completed 
                    ? 'bg-slate-50/50 border-slate-100 text-slate-400 line-through' 
                    : 'bg-orange-50/20 border-orange-100/40 hover:bg-orange-50/40 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    id={`goal-toggle-${g.id}`}
                    type="button"
                    onClick={() => handleToggleGoal(g.id)}
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer bg-transparent ${
                      g.completed
                        ? 'bg-emerald-400 border-emerald-500 text-white'
                        : 'border-slate-300 bg-white hover:border-emerald-400'
                    }`}
                  >
                    {g.completed && <CheckCircle className="w-3.5 h-3.5" />}
                  </button>
                  <span className="flex items-center gap-2 text-xs">
                    {getCategoryIcon(g.category)}
                    {g.title}
                  </span>
                </div>

                <button
                  id={`goal-delete-${g.id}`}
                  type="button"
                  onClick={() => handleDeleteGoal(g.id)}
                  className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer bg-transparent border-none"
                  title="Remove goal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
          <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-sans">
            <Heart className="w-3 h-3 text-rose-400 fill-current" />
            Daily reminders compound over time. Celebrate even the small micro-wins!
          </span>
        </div>
      </div>

    </div>
  );
}
