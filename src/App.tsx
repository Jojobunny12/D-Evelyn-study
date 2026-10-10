/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { StudyDeck } from "./types";
import MaterialUploader from "./components/MaterialUploader";
import StudyDeckView from "./components/StudyDeckView";
import { BookOpen, History, Award, CheckCircle, ChevronRight, FileText, Trash2, GraduationCap, ShieldAlert, Download } from "lucide-react";
import { generateOfflineHtml } from "./utils/htmlExporter";

export default function App() {
  const [activeDeck, setActiveDeck] = useState<StudyDeck | null>(null);
  const [savedDecks, setSavedDecks] = useState<StudyDeck[]>([]);
  const [systemAlert, setSystemAlert] = useState<string | null>(null);

  const downloadStandaloneApp = () => {
    try {
      const htmlContent = generateOfflineHtml(savedDecks, activeDeck || undefined);
      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "GPA_Battle_Royale_Offline.html";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate offline export:", err);
    }
  };

  // Sync historical study decks on load
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dev_study_decks");
      if (stored) {
        setSavedDecks(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Local storage sync failure:", err);
    }
  }, [activeDeck]);

  const loadSavedDeck = (deck: StudyDeck) => {
    setActiveDeck(deck);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateDeck = (updatedDeck: StudyDeck) => {
    setActiveDeck(updatedDeck);
    try {
      const stored = localStorage.getItem("dev_study_decks");
      if (stored) {
        const decks: StudyDeck[] = JSON.parse(stored);
        const updatedList = decks.map((d) => (d.id === updatedDeck.id ? updatedDeck : d));
        localStorage.setItem("dev_study_decks", JSON.stringify(updatedList));
        setSavedDecks(updatedList);
      }
    } catch (err) {
      console.error("Failed to update deck in local storage:", err);
    }
  };

  const deleteDeck = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const updated = savedDecks.filter((d) => d.id !== id);
      localStorage.setItem("dev_study_decks", JSON.stringify(updated));
      setSavedDecks(updated);
      if (activeDeck?.id === id) {
        setActiveDeck(null);
      }
    } catch (err) {
      console.error("Failed to delete local state item:", err);
    }
  };

  const clearAllDecks = () => {
    if (window.confirm("Are you sure you want to clear your study history? This cannot be undone.")) {
      localStorage.removeItem("dev_study_decks");
      setSavedDecks([]);
      setActiveDeck(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-805 antialiased font-sans pb-16 Selection">
      {/* Visual Navigation Bar */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveDeck(null)}>
            <div className="bg-orange-600 p-2 rounded-lg text-white">
              <GraduationCap className="h-6 w-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <span className="text-md font-sans tracking-tight font-extrabold text-gray-900 block uppercase">GPA Battle Royale</span>
              <span className="text-[10px] font-mono tracking-widest text-orange-600 block uppercase">Infinite Campus Survival Suite</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={downloadStandaloneApp}
              className="inline-flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm cursor-pointer transition hover:scale-[1.02] space-x-1 border border-indigo-500/10"
              title="Download standalone school-safe offline companion containing all preloaded and generated deks"
            >
              <Download className="h-3 w-3" />
              <span className="hidden sm:inline">Offline Sandbox Export</span>
              <span className="inline sm:hidden">Export Offline</span>
            </button>
            <span className="hidden md:inline-flex items-center px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-lg text-xs font-semibold text-orange-950">
              <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              Sassy Academic Coach Active
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* If studying an active compiled deck, show detail dashboard */}
        {activeDeck ? (
          <StudyDeckView deck={activeDeck} onBack={() => setActiveDeck(null)} onUpdateDeck={handleUpdateDeck} />
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Top Academic Motivation Block */}
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-2xl p-6 md:p-8 text-white shadow-lg space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] bg-orange-500/25 text-orange-300 font-mono font-bold tracking-widest uppercase border border-orange-500/20 px-2 py-0.5 rounded-full">
                    Midnight Caffeine &amp; Premium Honors Standard
                  </span>
                  <h2 className="text-2xl md:text-3xl font-sans tracking-tight font-extrabold text-white">
                    Unlock Your Course GPA &amp; Destroy Finals
                  </h2>
                  <p className="text-sm text-slate-300 max-w-2xl font-serif leading-relaxed">
                    Let's be real: high school finals are a brutal cumulative pressure cooker where your entire grade stands on a standard deviation line. Whether you are dealing with AP biology, Wheelock's subjunctive conditional traps, or trigonometry proofs from hell, we translate stressful grade panic into flawless cheat sheets, 5-day active recall planners, and mock diagnostic scenario practice games!
                  </p>
                </div>
                <div className="shrink-0 flex items-center justify-center p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="text-center space-y-1">
                    <div className="text-3xl font-sans tracking-tight font-extrabold text-orange-400">0%</div>
                    <div className="text-[10px] font-mono tracking-widest uppercase text-slate-400">Sleep Left Tonight</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* School / Chromebook Account Bypass Card */}
            <div className="bg-amber-500/10 border-2 border-dashed border-amber-500/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-xs uppercase font-mono tracking-wider">
                  <span>🚀</span> <span>School Account / Chromebook Restricted?</span>
                </div>
                <p className="text-xs text-amber-950 font-serif leading-relaxed max-w-3xl">
                  Can't load Google AI Studio on your school account? Save your GPA. Click below to bundle your current saved study guides and <strong>all 20 preset course companions</strong> into a <strong>single standalone .html file</strong>. Download it to standard Google Drive or USB, and run interactive study countdowns, flashcards, and full exam quizzes completely offline on any school Chromebook unblocked!
                </p>
              </div>
              <button 
                onClick={downloadStandaloneApp}
                className="shrink-0 inline-flex items-center justify-center px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs tracking-wider rounded-xl uppercase shadow-md transition hover:scale-[1.02] cursor-pointer space-x-1.5"
              >
                <Download className="h-4 w-4" />
                <span>Export Offline HTML App</span>
              </button>
            </div>

            {/* Main Application Matrix Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Column: Compiler Form (takes 2 widths in desktop) */}
              <div className="lg:col-span-2 space-y-6">
                <MaterialUploader onAnalysisComplete={(deck) => setActiveDeck(deck)} />
              </div>

              {/* Right Column: Historical / Saved study aids (takes 1 width in desktop) */}
              <div className="space-y-6">
                <div id="archives-card" className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center space-x-2 text-blue-950">
                      <History className="h-5 w-5 text-amber-500 shrink-0" />
                      <h3 className="font-sans font-extrabold text-sm tracking-wide uppercase">Archived Review Decks</h3>
                    </div>
                    {savedDecks.length > 0 && (
                      <button
                        onClick={clearAllDecks}
                        className="text-xs font-bold text-red-600 hover:text-red-700 underline flex items-center cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Clear Decks
                      </button>
                    )}
                  </div>

                  {savedDecks.length === 0 ? (
                    <div className="py-8 text-center space-y-3">
                      <div className="h-10 w-10 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                        No final guide decks generated yet. Type a course code or select a popular preset above to instantly salvage your grades.
                      </p>
                    </div>
                  ) : (
                    <div id="archives-list" className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                      {savedDecks.map((deck) => (
                        <div
                          key={deck.id}
                          onClick={() => loadSavedDeck(deck)}
                          className="p-4 bg-slate-50 hover:bg-blue-55/70 border border-slate-100 hover:border-blue-200 rounded-xl cursor-pointer transition-all duration-150 flex items-start justify-between group"
                        >
                          <div className="space-y-1.5 max-w-[80%]">
                            <span className="font-mono text-[9px] font-bold text-blue-950 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">
                              {deck.courseCode}
                            </span>
                            <h4 className="text-xs font-extrabold text-slate-800 line-clamp-1 group-hover:text-blue-900 transition">
                              {deck.summary.title}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-mono">
                              {new Date(deck.timestamp).toLocaleDateString()} &bull; {deck.flashcards.length} cards &bull; {deck.quiz.length} q
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => deleteDeck(e, deck.id)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50/50 opacity-0 group-hover:opacity-100 transition duration-150 cursor-pointer"
                              title="Delete guide"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <ChevronRight className="h-4 w-4 text-gray-400 shrink-0 group-hover:translate-x-1 transition" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Absolute Truth of Infinite Campus */}
                <div className="bg-amber-100/30 border border-amber-200/50 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-950">
                    <CheckCircle className="h-4 w-4 text-orange-600 shrink-0" />
                    <span className="font-sans font-extrabold text-xs uppercase tracking-wide">Campus Survival Mandate</span>
                  </div>
                  <p className="text-xs italic text-amber-900 leading-relaxed font-serif">
                    "Infinite Campus database updates represent the single absolute source of high-school dopamine and existential crisis. Checking your grades at 12:01 AM is statistically proven to increase caffeine consumption by 200%. Study early, review cheat-sheets, and take active mock quizzes."
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
