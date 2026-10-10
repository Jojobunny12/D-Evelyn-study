import React, { useState, useEffect } from "react";
import { Course, StudyDeck } from "../types";
import { PRESET_COURSES } from "../data/courses";
import { deduceCourse } from "../utils/courseDeducer";
import { BookOpen, AlertCircle, Cpu, GraduationCap, Calculator, Sparkles, AlertTriangle, ShieldCheck, Flame, Zap, UploadCloud, FileText, X } from "lucide-react";

interface MaterialUploaderProps {
  onAnalysisComplete: (deck: StudyDeck) => void;
}

const FUNNY_LOADING_PHRASES = [
  "Bribing Infinite Campus gradebook database servers...",
  "Tung tung tung sahur! Waking up the district servers with iron pan slaps...",
  "Digging up syllabus secrets more locked-down than Jeffrey Epstein's client list...",
  "Calculating if ts is actually winnable or if we are cooked...",
  "Spotting the sussy among us imposter hiding inside the standard deviation variables...",
  "Synthesizing customized answers (blaming Einstein for the hard parts as usual)...",
  "Calculating the exact caffeine-to-blood ratio required to pass ts exam...",
  "Recruiting dead European historical figures as your personal ghostwriters...",
  "Simulating potential parental feedback levels at 12:01 AM...",
  "Converting absolute panic into academic energy waves...",
  "Securing optimal grades with high-yield recall projections..."
];

export default function MaterialUploader({ onAnalysisComplete }: MaterialUploaderProps) {
  const [courseCode, setCourseCode] = useState("");
  const [useCustomCode, setUseCustomCode] = useState(false);
  const [schoolName, setSchoolName] = useState("Infinite Campus High");
  const [selectedPreset, setSelectedPreset] = useState<Course | null>(null);
  
  // PDF upload file state
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    size: string;
    mimeType: string;
    base64: string;
  } | null>(null);
  
  // Grade Survival Calculator state
  const [currentGrade, setCurrentGrade] = useState<number>(83);
  const [finalWeight, setFinalWeight] = useState<number>(15);
  const [targetGrade, setTargetGrade] = useState<number>(90);
  const [calculatorOpen, setCalculatorOpen] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Funny phrase rotator
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingPhraseIndex((prev) => (prev + 1) % FUNNY_LOADING_PHRASES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Handle PDF/File Selector
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setError("This study guide is too gigantic (limit 15MB)! Cut it down or paste key excerpts.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      setAttachedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        mimeType: file.type || "application/pdf",
        base64: base64String,
      });
      setError(null);
    };
    reader.onerror = () => {
      setError("Failed to digest file. Please try a different PDF or paste standard text notes.");
    };
    reader.readAsDataURL(file);
  };

  // Handle Preset Click
  const handleSelectPreset = (course: Course) => {
    setSelectedPreset(course);
    setCourseCode(course.code);
    setUseCustomCode(false);
    setError(null);
  };

  const handleCustomCodeChange = (codeValue: string) => {
    setCourseCode(codeValue);
    setSelectedPreset(null);
    setUseCustomCode(true);
    setError(null);
  };

  // Stress Calculator math
  const calculateEstimate = () => {
    const c = currentGrade / 100;
    const w = finalWeight / 100;
    const t = targetGrade / 100;

    if (w <= 0 || w >= 1) return { needed: 0, text: "Enter weights between 1% and 99%" };
    
    // t = c * (1 - w) + needed * w
    const needed = (t - c * (1 - w)) / w;
    const finalPercent = needed * 100;

    let text = "";
    if (finalPercent > 100) {
      text = `🔥 TUNG TUNG TUNG SAHUR! Wake up, because ts is cooked! You need a ${finalPercent.toFixed(1)}% on this final to survive. Unless Jeffrey Epstein's private hacker saves your grades, your GPA is on absolute life support!`;
    } else if (finalPercent > 90) {
      text = `☕ CERTIFIED SUSSY IMPOSTER ALARM: You need a ${finalPercent.toFixed(1)}% on the final. Lock in immediately. Hide your phone, ignore the group chats, and read this packet or you are going to the shadow realm.`;
    } else if (finalPercent > 70) {
      text = `📈 WINNABLE SCENARIO: You need a ${finalPercent.toFixed(1)}% on the final. Honestly, ts is light work. Just spend 15 minutes reviewing these recall cards instead of doomscrolling TikTok.`;
    } else if (finalPercent > 40) {
      text = `😎 ABSOLUTE CHILLING: You only need a ${finalPercent.toFixed(1)}%. You could take the exam with your eyes closed, write "among us" as every answer, and still secure your target grade.`;
    } else {
      text = `🎉 IMMORTAL GOD MODE: You need a ${finalPercent.toFixed(1)}% (literally a negative grade!). Sleep through the morning bell, make paper planes out of your study guide, you've already won.`;
    }

    return { needed: finalPercent, text };
  };

  const calcResult = calculateEstimate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const targetCode = courseCode.trim();
    if (!targetCode) {
      setError("Please select a popular preset or type a custom Infinite Campus Course Code first!");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Look for preset matching first to supply rich background info if available
    const matchedCourse = selectedPreset || PRESET_COURSES.find(c => c.code.toLowerCase() === targetCode.toLowerCase());
    const deduced = deduceCourse(targetCode);

    const finalCourseName = matchedCourse ? matchedCourse.name : deduced.name;
    const finalDepartment = matchedCourse ? matchedCourse.department : deduced.department;
    const finalCurriculum = matchedCourse 
      ? `${matchedCourse.description} | ${matchedCourse.curriculumDetails}` 
      : `${deduced.description} | ${deduced.curriculumDetails}`;
    const finalExamFocus = matchedCourse ? matchedCourse.examFocus : deduced.examFocus;
    const finalStrategy = matchedCourse ? matchedCourse.studyStrategy : deduced.studyStrategy;

    const payload = {
      schoolName: schoolName,
      courseCode: targetCode,
      courseName: finalCourseName,
      department: finalDepartment,
      curriculumDetails: finalCurriculum,
      examFocus: finalExamFocus,
      studyStrategy: finalStrategy,
      pastedText: "",
      additionalNotes: `Student is targeting a grade of ${targetGrade}% and currently holds a ${currentGrade}%. The final exam is worth ${finalWeight}% of the class grade. ${attachedFile ? `CRITICAL: The student uploaded an official custom materials PDF study sheet file called "${attachedFile.name}". Meticulously read this file for specific terms, math formulas, equations, facts, or questions, and construct the study deck, timelines, cheatsheets, and flashcards directly around its content! This is a battle royale for their GPA. Keep the math unicode completely correct and LaTeX-free!` : "No custom study file uploaded; generate purely using your syllabus knowledge for this course code."}`,
      fileBase64: attachedFile?.base64 || null,
      fileMimeType: attachedFile?.mimeType || null,
    };

    try {
      const response = await fetch("/api/analyze-finals-material", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to salvage grades from this course code.");
      }

      const deckData = await response.json();
      
      const completeDeck: StudyDeck = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        schoolName: schoolName,
        courseCode: targetCode,
        courseName: finalCourseName,
        summary: deckData.summary,
        timeline: deckData.timeline,
        flashcards: deckData.flashcards,
        quiz: deckData.quiz,
        additionalNotes: `Panic check: current grade is ${currentGrade}%, need a ${calcResult.needed.toFixed(1)}% on this final exam!`,
      };

      // Save to local storage hist
      const prevSaved = localStorage.getItem("dev_study_decks");
      const currentSaved = prevSaved ? JSON.parse(prevSaved) : [];
      localStorage.setItem("dev_study_decks", JSON.stringify([completeDeck, ...currentSaved]));

      onAnalysisComplete(completeDeck);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while calling Infinite Campus defribillator. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Humorous Grade Survival Widget */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Calculator className="h-5 w-5 text-orange-600 animate-pulse" />
            <div>
              <span className="text-[10px] bg-orange-100 text-orange-900 border border-orange-200 uppercase font-mono font-bold px-2 py-0.5 rounded-full">
                Sassy GPA Tool
              </span>
              <h4 className="text-sm font-sans font-extrabold text-blue-950 mt-0.5">
                Infinite Campus "Survival Panic" Estimator
              </h4>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCalculatorOpen(!calculatorOpen)}
            className="text-xs font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 px-3 py-1.5 rounded-lg transition-all focus:outline-none"
          >
            {calculatorOpen ? "Hide Stress Calculator" : "Show Stress Calculator"}
          </button>
        </div>

        {calculatorOpen && (
          <div className="mt-5 pt-4 border-t border-amber-200/50 space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-amber-100 shadow-inner">
                <label className="block text-[10px] font-bold text-gray-600 font-mono uppercase">Current Class Grade: {currentGrade}%</label>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={currentGrade}
                  onChange={(e) => setCurrentGrade(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>

              <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-amber-100 shadow-inner">
                <label className="block text-[10px] font-bold text-gray-600 font-mono uppercase">Final's Grade Weight: {finalWeight}%</label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={finalWeight}
                  onChange={(e) => setFinalWeight(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>

              <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-amber-100 shadow-inner">
                <label className="block text-[10px] font-bold text-gray-600 font-mono uppercase">Target Final Grade: {targetGrade}%</label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>
            </div>

            {/* Sassy Verdict */}
            <div className={`p-4 rounded-xl border flex items-start space-x-3 shadow-sm ${
              calcResult.needed > 100 
                ? "bg-red-50 border-red-200 text-red-900" 
                : calcResult.needed > 90 
                ? "bg-amber-100/70 border-amber-300 text-amber-950" 
                : "bg-emerald-50 border-emerald-200 text-emerald-950"
            }`}>
              <AlertTriangle className={`h-5 w-5 shrink-0 mt-0.5 ${calcResult.needed > 90 ? "text-red-500 animate-bounce" : "text-emerald-600"}`} />
              <p className="text-xs font-serif leading-relaxed">
                {calcResult.text}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Single-Code Form Compiler */}
      <div id="material-uploader-card" className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Sleek Visual Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-6 py-8 text-white relative">
          <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
            <Cpu className="h-28 w-28 text-white" />
          </div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-br from-orange-400 to-amber-500 text-slate-950 p-2.5 rounded-xl shadow-md">
              <Zap className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-sans tracking-tight font-extrabold text-white">
                GPA Battle Royale
              </h2>
              <p className="text-slate-300 text-xs font-mono">
                Running off Infinite Campus Course Codes &bull; PDF Study Notes Supported
              </p>
            </div>
          </div>
          <p className="text-slate-300 text-xs max-w-2xl leading-relaxed mt-2.5">
            Simply select one of our premium preset courses below OR type your own Infinite Campus course code, and drag in an optional study notes/exam prep sheet PDF! GPA Battle Royale immediately compiles an incredibly funny, sussy, and academically pristine survival deck loaded with active recall cards and full mock exams to salvage your GPA.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          
          {/* Main Course Code Input Container */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-widest font-mono">
                1. Main Infinite Campus Course Code
              </label>
              {selectedPreset ? (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full uppercase border border-emerald-200">
                  Preset Selected: {selectedPreset.name}
                </span>
              ) : courseCode ? (
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full uppercase border border-indigo-200 font-mono">
                  Custom Code Active
                </span>
              ) : null}
            </div>

            <div className="relative">
              <input
                id="course-search-field"
                type="text"
                value={courseCode}
                onChange={(e) => handleCustomCodeChange(e.target.value)}
                placeholder="Type any curriculum course code (e.g. ENG101, SPANISH_3, CHEM_AP, CS-50...)"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/25 focus:bg-white focus:outline-none transition-all duration-200 font-mono text-md text-gray-900 tracking-wide font-semibold placeholder:font-sans placeholder:text-sm"
              />
              <div className="absolute right-4 top-3.5 flex items-center space-x-2">
                <span className="hidden md:inline-block text-[10px] text-gray-400 font-mono bg-gray-100 border px-2 py-1 rounded">
                  Infinite Campus Code
                </span>
              </div>
            </div>
          </div>

          {/* Quick Click Preset Grid */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-widest font-mono flex items-center space-x-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-spin" />
              <span>2. Popular Presets (Click to Load Instantly)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRESET_COURSES.map((course) => {
                const isSelected = selectedPreset?.code === course.code;
                return (
                  <button
                    key={course.code}
                    type="button"
                    onClick={() => handleSelectPreset(course)}
                    className={`text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? "border-orange-500 bg-orange-50/70 shadow-sm ring-2 ring-orange-500/10"
                        : "border-gray-100 bg-white hover:border-gray-200 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-800 border px-2 py-0.5 rounded">
                          {course.code}
                        </span>
                        <span className="text-[9px] font-mono font-semibold text-gray-400 bg-slate-50 px-1.5 rounded">
                          {course.department}
                        </span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-800 mt-2 line-clamp-1">
                        {course.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PDF/Study Notes Upload Area */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-widest font-mono flex items-center space-x-1.5">
              <UploadCloud className="h-4 w-4 text-indigo-600" />
              <span>3. Target Study Guide / Notes PDF (Highly Recommended)</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Drag n Drop Upload zone */}
              <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20 rounded-xl p-5 transition-all text-center relative cursor-pointer group">
                <input
                  type="file"
                  accept=".pdf,text/plain,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="p-2 bg-indigo-50 group-hover:bg-indigo-100 rounded-lg text-indigo-600 transition">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <div className="text-xs font-bold text-gray-700">
                    Drag & Drop PDF or Click to Browse
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    Supports high-stakes study guide PDFs, class notes (Max 15MB)
                  </div>
                </div>
              </div>

              {/* Status or Uploaded File Card */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">
                    Attached Battle Document
                  </h4>
                  {attachedFile ? (
                    <div className="mt-3 flex items-start justify-between bg-white border border-indigo-100 rounded-lg p-3 shadow-sm animate-fade-in">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 font-sans">
                          <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                            {attachedFile.name}
                          </p>
                          <p className="text-[10px] font-mono text-gray-500 mt-0.5">
                            {attachedFile.size} &bull; Meticulous Extraction Enabled
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedFile(null)}
                        className="text-gray-400 hover:text-red-500 p-1 hover:bg-slate-100 rounded-full transition cursor-pointer shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 flex flex-col items-center justify-center text-center py-4 space-y-1">
                      <p className="text-xs text-gray-500 italic font-serif">
                        "Your grades are more classified than government coverups."
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Attach a file to custom-tailor 100% exact quiz questions & cheat sheets.
                      </p>
                    </div>
                  )}
                </div>
                
                {attachedFile && (
                  <div className="mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 animate-pulse">
                    <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full shrink-0" />
                    <span>PDF Locked and Loaded into GPA Battle Royale Compiler!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* School Preset Selection Name (Optional) */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest font-mono">
              High School Location (Custom Optional Name)
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="e.g. Infinite Campus High School"
              className="w-full md:max-w-xs px-3.5 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 text-[11px] font-semibold text-gray-700"
            />
          </div>

          {/* Form Action Buttons */}
          <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start space-x-2.5 text-[10px] text-gray-400 max-w-lg font-serif italic">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                By bypassing text uploads, the compiler searches academic models to reconstruct 100% compliant syllabus reviews, active recall systems, 5-day step counts, and robust mock exam tests instantly. Use responsibly.
              </p>
            </div>

            <button
              id="analyze-submit-button"
              type="submit"
              disabled={isLoading || !courseCode.trim()}
              className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold tracking-wide transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer ${
                isLoading
                  ? "bg-indigo-900 cursor-not-allowed opacity-85"
                  : !courseCode.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  : "bg-blue-950 hover:bg-blue-900 active:scale-95 text-white"
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="font-mono text-xs text-amber-300 tracking-wide animate-pulse">
                    {FUNNY_LOADING_PHRASES[loadingPhraseIndex]}
                  </span>
                </>
              ) : (
                <>
                  <Flame className="h-4 w-4 text-orange-400 fill-orange-400 animate-bounce" />
                  <span>Zap Grade Defense Pack &bull; Salvage GPA</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div id="uploader-error-alert" className="p-4 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-800 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>

    </div>
  );
}
