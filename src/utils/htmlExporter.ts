import { StudyDeck } from "../types";
import { PRESET_COURSES } from "../data/courses";

export function generateOfflineHtml(savedDecks: StudyDeck[], activeDeck?: StudyDeck): string {
  // Let's build a sanitized, full list of decks.
  // Standardize presets into the same format so they can use them offline!
  const defaultDecks = PRESET_COURSES.map(course => {
    // Generate dummy/sample quiz questions and flashcards for offline fallback
    // We can provide a comprehensive list of high-quality sample academic questions for each department
    const dept = course.department;
    
    // Sample flashcards for each preset
    let flashcards = [
      { question: "What is the primary study focus of this syllabus?", answer: course.description },
      { question: "What is the core exam focus?", answer: course.examFocus },
      { question: "What is the recommended study strategy for high scores?", answer: course.studyStrategy },
      { question: "Review the curriculum details.", answer: course.curriculumDetails }
    ];

    if (dept === "Mathematics") {
      flashcards = [
        { question: "Quadratic Formula", answer: "x = (-b ± √(b² - 4ac)) / 2a" },
        { question: "Distance Formula", answer: "d = √((x₂ - x₁)² + (y₂ - y₁)²)" },
        { question: "Slope Form", answer: "m = (y₂ - y₁) / (x₂ - x₁)" },
        { question: "Double Angle sin(2x)", answer: "sin(2x) = 2 sin(x) cos(x)" },
        { question: "Double Angle cos(2x)", answer: "cos(2x) = cos²(x) - sin²(x) = 2cos²(x) - 1 = 1 - 2sin²(x)" },
        { question: "Equation of Circle", answer: "(x - h)² + (y - k)² = r² where (h,k) is center and r is radius" },
        { question: "Asymptotes of Hyperbola", answer: "y = ± (b/a)x for x²/a² - y²/b² = 1" }
      ];
    } else if (dept === "Science") {
      flashcards = [
        { question: "Molar Mass of Water", answer: "18.02 g/mol (H = 1.01, O = 16.00)" },
        { question: "Reaction Quotient (Q_c)", answer: "Q_c = [Products]^(coefficients) / [Reactants]^(coefficients)" },
        { question: "Newton's Second Law", answer: "F = m * a (Force = mass x acceleration)" },
        { question: "Ideal Gas Law", answer: "PV = nRT (P = pressure, V = volume, n = moles, R = constant, T = temp in K)" },
        { question: "Le Chatelier's Principle", answer: "If dynamic equilibrium is disturbed, the system shifts to counteract the change." },
        { question: "DNA Transcription vs Translation", answer: "Transcription: DNA to mRNA (nucleus). Translation: mRNA to polypeptide chains (ribosome)." },
        { question: "Krebs Cycle Location", answer: "In the mitochondrial matrix of eukaryotic cells." }
      ];
    } else if (dept === "Social Studies") {
      flashcards = [
        { question: "Scholasticism", answer: "Medieval school of philosophy linking Christian theology with classical Greek reason (e.g. Thomas Aquinas)." },
        { question: "Transcendentalism", answer: "19th century American movement focusing on intuition, self-reliance, and nature (Emerson, Thoreau)." },
        { question: "Federalism vs Anti-Federalism", answer: "Federalists: strong central government (Hamilton). Anti-Federalists: states' rights and Bill of Rights (Jefferson)." },
        { question: "French Revolution Start Date", answer: "1789, starting with the Storming of the Bastille." },
        { question: "Scientific Revolution Key Premise", answer: "Replacing scholastic deduction with empirical observation and mathematical proof (Copernicus, Galileo, Newton)." }
      ];
    } else if (dept === "Foreign Language") {
      flashcards = [
        { question: "Latin 1st Declension Nominative", answer: "-a (singular), -ae (plural) e.g. puella, puellae" },
        { question: "Indirect Statement structure", answer: "Accusative subject + Infinitive verb, triggered by senior verbs of saying, thinking, or perceiving." },
        { question: "Subjunctive Cum Clauses", answer: "Temporal (when), Causal (since), or Concessive (although), translated focusing on verb actions." },
        { question: "Latin Future Active Endings", answer: "-bo, -bis, -bit, -bimus, -bitis, -bunt (1st/2nd conjugation)" },
        { question: "Verb Conjugation: Decir (Preterite)", answer: "dije, dijiste, dijo, dijimos, dijisteis, dijeron (irregular strong 'j' stem)." }
      ];
    } else if (dept === "English") {
      flashcards = [
        { question: "Ethos", answer: "Rhetorical appeal based on establishing the speaker's credibility, character, and expertise." },
        { question: "Pathos", answer: "Rhetorical appeal aiming to elicit emotional responses from the audience." },
        { question: "Logos", answer: "Rhetorical appeal utilizing logical reasoning, statistics, and objective proofs." },
        { question: "Dramatic Irony", answer: "Occurs when readers or audience know critical details that the characters remain unaware of." },
        { question: "Comma Splice Error", answer: "Incorrectly fusing two independent clauses with only a comma. Use a semicolon, period, or comma + conjunction instead!" },
        { question: "Hamartia", answer: "The fatal flaw or tragic misjudgment of a high-status hero that drives their ultimate collapse." }
      ];
    } else if (dept === "Fine Arts") {
      flashcards = [
        { question: "Exposure Triangle Pillars", answer: "Aperture (takes bokeh), Shutter Speed (time), and ISO (gain sensitivity)." },
        { question: "Shallow Depth of Field", answer: "Wide aperture (small f-number like f/1.8) focusing on a very narrow slice." },
        { question: "Rule of Thirds", answer: "Aligning prime focal points along a 3x3 imaginary grid's intersections for balance." },
        { question: "High ISO Artifacts", answer: "Abnormal digital sensor gain introducing noise and colored grain into shadow zones." },
        { question: "Rembrandt Lighting", answer: "Dramatic light at 45 degrees, rendering a small triangular highlight on the shadowed cheek." }
      ];
    } else if (dept === "Electives") {
      flashcards = [
        { question: "Binary Search Complexity", answer: "O(log n) worst-case time complexity because it cuts search bounds in half recurrently." },
        { question: "Queue protocol", answer: "First-In, First-Out (FIFO) transaction queue." },
        { question: "Stack protocol", answer: "Last-In, First-Out (LIFO) memory structure." },
        { question: "Stack Overflow Error", answer: "Overloading limit of execution stack frames, typically triggered by infinite recursion." },
        { question: "Primary Key", answer: "Database constraint enforcing absolute unique row identification markers." }
      ];
    }

    // High Quality Offline Quiz questions matching the academic pools
    let quiz: any[] = [];
    if (dept === "Mathematics") {
      quiz = [
        { question: "Solve the quadratic equation x² - 8x + 15 = 0 for x.", options: ["A) x = 3 or x = 5", "B) x = -3 or x = -5", "C) x = 2 or x = 6", "D) x = 1 or x = 15"], correctIndex: 0, explanation: "Factoring x² - 8x + 15 gives (x - 3)(x - 5) = 0. Therefore, the roots are x = 3 and x = 5." },
        { question: "What is the exact value of sin(2θ) if sin(θ) = 3/5 in Quadrant I?", options: ["A) 24/25", "B) 12/25", "C) 6/5", "D) 7/25"], correctIndex: 0, explanation: "In Quadrant I, cos(θ) = 4/5. Using double-angle formula sin(2θ) = 2 sin(θ) cos(θ) = 2 * (3/5) * (4/5) = 24/25." },
        { question: "For the geometric sequence 3, 6, 12, 24, ..., find the exact 8th term.", options: ["A) 384", "B) 192", "C) 768", "D) 512"], correctIndex: 0, explanation: "The common ratio r is 2. a_n = a_1 * r^(n-1). a_8 = 3 * 2⁷ = 3 * 128 = 384." },
        { question: "Determine the vertex coordinates of the parabola y = 2x² - 12x + 11.", options: ["A) (3, -7)", "B) (-3, 7)", "C) (3, 11)", "D) (6, -25)"], correctIndex: 0, explanation: "h = -b / (2a) = 12 / 4 = 3. y = 2(3)² - 12(3) + 11 = 18 - 36 + 11 = -7. Vertex is (3, -7)." },
        { question: "Evaluate the analytical limit: lim (x -> 3) (x² - 9) / (x - 3).", options: ["A) 6", "B) 3", "C) 0", "D) Undefined (Does not exist)"], correctIndex: 0, explanation: "Factor numerator is (x-3)(x+3). Cancel (x-3) and take limit of x+3 as x->3 resulting in 6." }
      ];
    } else if (dept === "Science") {
      quiz = [
        { question: "What is the mass percentage of Oxygen inside H₂O? (Molar Masses: H = 1.01, O = 16.00)", options: ["A) 88.8%", "B) 11.2%", "C) 50.0%", "D) 94.1%"], correctIndex: 0, explanation: "Molar mass = 18.02. Oxy percentage = (16.00 / 18.02) * 100% = 88.8%." },
        { question: "Which subatomic particle determines the unique atomic number and chemical identity?", options: ["A) Proton", "B) Neutron", "C) Electron", "D) Positron"], correctIndex: 0, explanation: "Proton count matches the element's atomic number and identity precisely." },
        { question: "An object of mass 10 kg undergoes constant acceleration of 4 m/s². What net Force is acting on it?", options: ["A) 40 N", "B) 2.5 N", "C) 25 N", "D) 100 N"], correctIndex: 0, explanation: "F = m * a = 10 * 4 = 40 Newtons of force." }
      ];
    } else if (dept === "Social Studies") {
      quiz = [
        { question: "Which core document defended the new US Constitution using extensive political essays under the alias 'Publius'?", options: ["A) The Federalist Papers", "B) The Articles of Confederation", "C) Common Sense", "D) The Mayflower Compact"], correctIndex: 0, explanation: "Written by Hamilton, Madison, and Jay, the Federalist Papers successfully lobbied for voting approval of the US Constitution." },
        { question: "What major geopolitical treaty in 1648 concluded the devastating Thirty Years' War in Europe?", options: ["A) Treaty of Westphalia", "B) Treaty of Versailles", "C) Edict of Nantes", "D) Treaty of Utrecht"], correctIndex: 0, explanation: "The Peace of Westphalia settled sovereign territorial rules and decentralized the Holy Roman Empire." }
      ];
    } else if (dept === "Foreign Language") {
      quiz = [
        { question: "What classical case configuration designates the direct object of a Latin verb action?", options: ["A) Accusative", "B) Nominative", "C) Genitive", "D) Ablative"], correctIndex: 0, explanation: "Accusative case is standard for direct objects in Latin mechanics." },
        { question: "Translate the high-frequency Latin verb 'Amare' in the first-person singular future active mood.", options: ["A) Amabo (I will love)", "B) Amabam (I was loving)", "C) Amo (I love)", "D) Amas (You love)"], correctIndex: 0, explanation: "Amabo represents the first-person singular future indicative active conjugating format (-bo)." }
      ];
    } else if (dept === "English") {
      quiz = [
        { question: "Identify the critical rhetorical appeal that relies on establishing the speaker's credibility and character.", options: ["A) Ethos", "B) Pathos", "C) Logos", "D) Kairos"], correctIndex: 0, explanation: "Ethos derives directly from speaker profile credibility." },
        { question: "Which of the following represents a classic sentence comma splice?", options: ["A) I refreshed Infinite Campus, the system crashed.", "B) I refreshed Infinite Campus; the system crashed.", "C) I refreshed Infinite Campus, but the system crashed.", "D) When I refreshed Infinite Campus, the system crashed."], correctIndex: 0, explanation: "Option A merges two fully independent statements using only a comma, creating a comma splice errors." }
      ];
    } else if (dept === "Fine Arts") {
      quiz = [
        { question: "What elements map to the manual camera Exposure Triangle?", options: ["A) Aperture, Shutter Speed, and ISO", "B) Zoom, Focus, and Stabilization", "C) Red, Green, and Blue sub-pixels", "D) Crop Factor, Lens Filter, and Focal Length"], correctIndex: 0, explanation: "Aperture, Shutter Speed, and ISO coordinate digital light capture." },
        { question: "Which aperture setting provides the shallowest depth of field (maximum blur style)?", options: ["A) f/1.8", "B) f/8.0", "C) f/16.0", "D) f/22.0"], correctIndex: 0, explanation: "Small f-numbers denote wide physical open rings which filter a narrow depth range." }
      ];
    } else {
      quiz = [
        { question: "What is the binary search time efficiency rating?", options: ["A) O(log n)", "B) O(n)", "C) O(n²)", "D) O(1)"], correctIndex: 0, explanation: "Logarithmic time means cutting search realms in half repeatedly." }
      ];
    }

    return {
      id: `preset-${course.code}`,
      timestamp: new Date().toISOString(),
      schoolName: "Infinite Campus High",
      courseCode: course.code,
      courseName: course.name,
      summary: {
        title: `${course.name} Study Companion`,
        curriculumExplanation: course.description,
        topTipsForFinal: [
          `Do not fail! Practice active diagnostics early.`,
          `Infinite Campus refreshes at 1:04 AM. Sleep early to avoid grade panic!`,
          `Focus heavily on: ${course.examFocus}`
        ],
        synthesizedNotesParagraph: `${course.description} | ${course.curriculumDetails}. ${course.examFocus}`,
        coreCheatSheetMarkdown: `# ${course.name} Core Review Sheet\n\n## Syllabi Guide\n${course.description}\n\n## Exam Focus\n${course.examFocus}\n\n## Recommendations\n* **Details:** ${course.curriculumDetails}\n* **Methods:** ${course.studyStrategy}`
      },
      timeline: [
        { dayName: "Day 1: Theory (And Denial)", activityTitle: "Re-read syllabus foundations", activityDescription: "Focus on mapping out major concepts and acknowledging the workload ahead." },
        { dayName: "Day 2: Active Flashcards", activityTitle: "Run active recall drills", activityDescription: "Force retrieval of terms and facts. Avoid reading passive review notes." },
        { dayName: "Day 3: Practice Quizzes", activityTitle: "Complete mock diagnostics", activityDescription: "Take multiple-choice practice tests, check mistakes, and outline target topics." },
        { dayName: "Day 4: Cheat Sheet Cracks", activityTitle: "Drill core formula equations", activityDescription: "Write standard errors, chemistry parameters, or declensions without aid." },
        { dayName: "Day 5: Synthesis (Acceptance)", activityTitle: "Final reviews & Sleep", activityDescription: "Resolve tough questions from past tests and sleep before standard deviation demons awaken." }
      ],
      flashcards,
      quiz
    };
  });

  // Combine saved decks and preset fallbacks, with saved decks taking priority (appearing first)
  const dedupedDecks: StudyDeck[] = [];
  const addedCodes = new Set<string>();

  // Add saved custom decks
  savedDecks.forEach(deck => {
    dedupedDecks.push(deck);
    addedCodes.add(deck.courseCode.toUpperCase());
  });

  // Add remaining default preset decks
  defaultDecks.forEach(deck => {
    if (!addedCodes.has(deck.courseCode.toUpperCase())) {
      dedupedDecks.push(deck);
    }
  });

  // Find index of deck to select default
  let selectedDeckId = dedupedDecks[0]?.id || "";
  if (activeDeck) {
    const matched = dedupedDecks.find(d => d.courseCode.toUpperCase() === activeDeck.courseCode.toUpperCase());
    if (matched) {
      selectedDeckId = matched.id;
    }
  }

  // Convert the array to high-security inline JSON
  const decksDataJson = JSON.stringify(dedupedDecks)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  // Construct massive HTML template
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GPA Battle Royale - Offline Review Suite</title>
    <!-- Tailwind CSS Client-side compiler -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Font files -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
    <style>
      body {
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
      }
      .font-mono {
        font-family: 'JetBrains Mono', monospace;
      }
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
      /* Fade-in transitions */
      .fade-in {
        animation: fadeIn 0.15s ease-out forwards;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }
    </style>
  </head>
  <body class="bg-slate-50 text-slate-805 antialiased min-h-screen">
    
    <div id="app" class="flex flex-col min-h-screen">
      <!-- Navbar -->
      <header class="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="bg-orange-600 p-2 rounded-lg text-white">
              <span class="text-xl font-bold leading-none font-mono">🎓</span>
            </div>
            <div>
              <span class="text-md tracking-tight font-extrabold text-slate-900 block uppercase">GPA Battle Royale</span>
              <span class="text-[10px] font-mono tracking-widest text-orange-600 block uppercase">Standalone Sandbox Companion</span>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <span class="inline-flex items-center px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-semibold text-emerald-950">
              <span class="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              Offline High School Suite
            </span>
          </div>
        </div>
      </header>

      <!-- Main Layout -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <!-- Dashboard Alert Banner -->
        <div class="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md mb-8 space-y-2">
          <span class="text-[9px] bg-orange-500/20 text-orange-400 font-mono font-bold tracking-widest uppercase border border-orange-500/20 px-2 py-0.5 rounded-full">
            No Internet/AI Studio Access Required
          </span>
          <h2 class="text-xl md:text-2xl font-extrabold text-white">Your Sandboxed Final Grade Survival Kit</h2>
          <p class="text-xs text-slate-300 max-w-2xl font-serif">
            Welcome to the fully self-contained offline deck. We packaged your saved guides and 20 preset course curriculums directly into this file. You can run games, practice timed quizzes, and flip flashcards anytime—even on school Chromebooks or during severe campus firewalls!
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Sidebar: Decks Catalog (1/4 columns wide) -->
          <div class="lg:col-span-1 space-y-4">
            <div class="bg-white rounded-xl shadow border border-slate-200 p-4 space-y-4">
              <div class="border-b pb-2 flex justify-between items-center">
                <span class="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">Course Decks</span>
                <span id="deck-count-badge" class="font-mono text-[10px] bg-indigo-50 text-indigo-750 px-1.5 py-0.5 rounded font-bold"></span>
              </div>
              
              <!-- Search bar -->
              <input 
                type="text" 
                id="deck-search" 
                placeholder="Search code or name..." 
                class="w-full px-3 py-1.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-600 transition"
              />

              <!-- Deck buttons list -->
              <div id="decks-list" class="space-y-1 max-h-[380px] overflow-y-auto pr-1">
                <!-- Injected dynamically -->
              </div>
            </div>

            <!-- Fun facts card -->
            <div class="bg-amber-100/35 border border-amber-200/50 rounded-xl p-4 space-y-2 text-xs">
              <div class="flex items-center space-x-1 font-extrabold text-amber-950 uppercase tracking-normal">
                <span>🔔</span> <span>Campus Warning</span>
              </div>
              <p class="italic text-amber-900 leading-relaxed font-serif">
                "Infinite Campus database updates represent the single absolute source of high-school dopamine. Keep studying, rehearse flashcards, and ace your exam simulation games."
              </p>
            </div>
          </div>

          <!-- Content viewer area (3/4 columns wide) -->
          <div class="lg:col-span-3 space-y-6">
            <!-- Selected Deck Title Banner -->
            <div id="deck-title-card" class="bg-white rounded-xl border border-slate-200 shadow p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <span id="active-deck-code" class="font-mono text-[10px] font-bold text-orange-650 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded"></span>
                  <span id="active-deck-dept" class="font-mono text-[10px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded"></span>
                </div>
                <h1 id="active-deck-title" class="text-xl font-extrabold text-slate-900 leading-tight"></h1>
                <p id="active-deck-school" class="text-xs text-slate-500 font-mono"></p>
              </div>
            </div>

            <!-- Tab Selectors -->
            <div class="bg-white border border-slate-200 p-1.5 rounded-xl shadow flex overflow-x-auto space-x-1">
              <button onclick="switchTab('summary')" id="tab-summary" class="flex-1 py-2 px-3 text-xs font-bold rounded-lg transition text-center whitespace-nowrap flex items-center justify-center space-x-2 cursor-pointer">
                <span>📘</span> <span>Summary Blueprint</span>
              </button>
              <button onclick="switchTab('cheat_sheet')" id="tab-cheat_sheet" class="flex-1 py-2 px-3 text-xs font-bold rounded-lg transition text-center whitespace-nowrap flex items-center justify-center space-x-2 cursor-pointer">
                <span>📝</span> <span>Core Cheat Sheet</span>
              </button>
              <button onclick="switchTab('timeline')" id="tab-timeline" class="flex-1 py-2 px-3 text-xs font-bold rounded-lg transition text-center whitespace-nowrap flex items-center justify-center space-x-2 cursor-pointer">
                <span>📅</span> <span>5-Day Countdown</span>
              </button>
              <button onclick="switchTab('flashcards')" id="tab-flashcards" class="flex-1 py-2 px-3 text-xs font-bold rounded-lg transition text-center whitespace-nowrap flex items-center justify-center space-x-2 cursor-pointer">
                <span>🎴</span> <span>Active Recall Cards</span>
              </button>
              <button onclick="switchTab('quiz')" id="tab-quiz" class="flex-1 py-2 px-3 text-xs font-bold rounded-lg transition text-center whitespace-nowrap flex items-center justify-center space-x-2 cursor-pointer">
                <span>📝</span> <span>Exam Simulator</span>
              </button>
            </div>

            <!-- Tabs content -->
            <div id="tab-content-container">
              
              <!-- SUMMARY TAB -->
              <div id="content-summary" class="tab-pane hidden space-y-6 fade-in">
                <div class="bg-white rounded-xl border border-slate-200 p-6 shadow space-y-4">
                  <h3 class="text-sm font-extrabold uppercase tracking-wide text-slate-900 flex items-center">
                    <span class="mr-2">💡</span> Curriculum Target
                  </h3>
                  <p id="summary-curriculum-explanation" class="text-xs text-slate-600 leading-relaxed font-serif"></p>
                </div>

                <div class="bg-white rounded-xl border border-slate-200 p-6 shadow space-y-4">
                  <h3 class="text-sm font-extrabold uppercase tracking-wide text-slate-900 flex items-center">
                    <span class="mr-2">🔥</span> Sassy Survival Tips
                  </h3>
                  <div id="summary-tips-list" class="space-y-3">
                    <!-- Loaded dynamically -->
                  </div>
                </div>

                <div class="bg-white rounded-xl border border-slate-200 p-6 shadow space-y-4">
                  <h3 class="text-sm font-extrabold uppercase tracking-wide text-slate-900 flex items-center">
                    <span class="mr-2">📖</span> Refresher Study Notes
                  </h3>
                  <p id="summary-notes-paragraph" class="text-xs text-slate-600 leading-relaxed font-serif"></p>
                </div>
              </div>

              <!-- CHEAT SHEET TAB -->
              <div id="content-cheat_sheet" class="tab-pane hidden fade-in">
                <div class="bg-white rounded-xl border border-slate-200 p-6 shadow space-y-4">
                  <div class="flex items-center justify-between border-b pb-3">
                    <h3 class="text-sm font-extrabold uppercase tracking-wide text-slate-900 flex items-center">
                      <span class="mr-2">🔬</span> Master formulas &amp; High-Yield Facts
                    </h3>
                    <span class="font-mono text-[9px] bg-teal-50 text-teal-700 font-bold px-1.5 py-0.5 rounded border border-teal-100 uppercase">
                      LaTeX Free &amp; Clean Unicode
                    </span>
                  </div>
                  <!-- Styled pre-formatted markdown reviewer -->
                  <div class="bg-slate-950 text-slate-100 p-6 rounded-lg font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner" id="cheat-sheet-content">
                    <!-- Filled dynamically -->
                  </div>
                </div>
              </div>

              <!-- TIMELINE TAB -->
              <div id="content-timeline" class="tab-pane hidden space-y-4 fade-in">
                <div class="bg-white rounded-xl border border-slate-200 p-6 shadow space-y-6">
                  <div>
                    <h3 class="text-sm font-extrabold uppercase tracking-wide text-slate-900 flex items-center">
                      <span class="mr-2">📅</span> 5-Day Count-Down Strategy Plan
                    </h3>
                    <p class="text-[10px] text-slate-500 font-serif mt-1">A highly tactical daily routine to salvage your grades before the Infinite Campus deadline.</p>
                  </div>
                  
                  <div id="timeline-list" class="space-y-4 relative pl-4 border-l border-slate-200">
                    <!-- Generated dynamically -->
                  </div>
                </div>
              </div>

              <!-- FLASHCARDS TAB -->
              <div id="content-flashcards" class="tab-pane hidden space-y-4 fade-in">
                <div class="bg-white rounded-xl border border-slate-200 p-6 shadow flex flex-col items-center justify-center min-h-[350px] space-y-6">
                  
                  <div class="w-full flex justify-between text-xs font-mono text-slate-500">
                    <span>Card <span id="card-index-current">1</span> of <span id="card-index-total">8</span></span>
                    <span id="deck-name-header"></span>
                  </div>

                  <!-- Flashcard Box -->
                  <div onclick="flipFlashcard()" class="w-full max-w-md h-48 bg-slate-50 hover:bg-slate-100/50 border-2 border-dashed border-slate-300 hover:border-orange-400 rounded-2xl cursor-pointer transition p-6 flex flex-col items-center justify-center text-center relative group">
                    <span id="flashcard-face-badge" class="absolute top-3 right-4 text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 group-hover:text-orange-500 transition">
                      Click To Flip
                    </span>
                    
                    <p id="flashcard-text" class="text-sm md:text-base font-extrabold text-slate-800 leading-relaxed font-serif max-w-xs"></p>
                  </div>

                  <!-- Controls -->
                  <div class="flex items-center space-x-4">
                    <button onclick="prevFlashcard()" class="p-2 bg-slate-100 text-slate-700 hover:bg-slate-250 border border-slate-200 rounded-lg hover:text-orange-600 transition cursor-pointer">
                      <span>◀</span> <span class="text-xs font-bold font-mono">Previous</span>
                    </button>
                    <button onclick="nextFlashcard()" class="p-2 bg-slate-100 text-slate-700 hover:bg-slate-250 border border-slate-200 rounded-lg hover:text-orange-600 transition cursor-pointer">
                      <span class="text-xs font-bold font-mono">Next</span> <span>▶</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- QUIZ TAB -->
              <div id="content-quiz" class="tab-pane hidden space-y-4 fade-in">
                <!-- Welcome/State Box -->
                <div id="quiz-start-box" class="bg-white rounded-xl border border-slate-200 p-8 shadow text-center space-y-4 max-w-lg mx-auto">
                  <div class="text-4xl">📝</div>
                  <h3 class="text-lg font-extrabold text-slate-850">Dynamic Academic Exam Simulator</h3>
                  <p class="text-xs text-slate-500 font-serif leading-relaxed">
                    Test your syllabus skills offline! Complete a full multiple-choice diagnosis. We tracks your correct responses to evaluate your Infinite Campus standing in real-time. Keep mathematically honest and study carefully.
                  </p>
                  <button onclick="startQuiz()" class="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs tracking-wider rounded-lg uppercase shadow-sm cursor-pointer transition">
                    Unlock Exam Simulation
                  </button>
                </div>

                <!-- Active Quiz Box -->
                <div id="quiz-active-box" class="hidden bg-white rounded-xl border border-slate-200 p-6 shadow space-y-6">
                  <div class="flex items-center justify-between border-b pb-3 text-xs font-mono text-slate-500">
                    <span>Question <span id="quiz-current-num">1</span> of <span id="quiz-total-num">25</span></span>
                    <span>Current Score: <span id="quiz-score-badge">0</span></span>
                  </div>

                  <h3 id="quiz-question-text" class="text-sm font-extrabold text-slate-900 leading-relaxed font-serif"></h3>

                  <div id="quiz-options-container" class="space-y-2.5">
                    <!-- Injected dynamically -->
                  </div>

                  <!-- Feedback Explanation Box -->
                  <div id="quiz-explanation-box" class="hidden p-4 rounded-xl border transition text-xs">
                    <p id="quiz-feedback-text" class="font-extrabold uppercase tracking-wide text-[10px] mb-1"></p>
                    <p id="quiz-explanation-text" class="text-slate-600 font-serif leading-relaxed"></p>
                  </div>

                  <!-- Progress Buttons -->
                  <div class="flex justify-end pt-2">
                    <button onclick="submitNextQuizQuestion()" id="quiz-next-btn" class="hidden px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase rounded-lg shadow transition cursor-pointer">
                      Next Step ▶
                    </button>
                  </div>
                </div>

                <!-- Finished Quiz Box -->
                <div id="quiz-end-box" class="hidden bg-white rounded-xl border border-slate-200 p-8 shadow text-center space-y-6 max-w-lg mx-auto">
                  <div class="space-y-1">
                    <h3 class="text-md font-mono font-bold tracking-widest text-indigo-750 uppercase">Diagnostic Complete!</h3>
                    <p class="text-3xl font-extrabold tracking-tight text-slate-900" id="quiz-final-grade-pct">0%</p>
                    <p class="text-xs text-slate-450 font-mono" id="quiz-results-fraction">0/25 correct</p>
                  </div>

                  <div class="p-5 rounded-2xl border text-left space-y-2" id="quiz-standing-box">
                    <h4 class="text-xs font-mono font-extrabold uppercase text-slate-800" id="quiz-standing-title">Academic Standing</h4>
                    <p class="text-xs text-slate-550 leading-relaxed font-serif" id="quiz-standing-desc"></p>
                  </div>

                  <button onclick="resetQuiz()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-extrabold text-xs tracking-wider rounded-lg uppercase transition cursor-pointer">
                    🔁 Re-Verify Credentials (Retry)
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-450 font-mono mt-12">
        <p>&copy; 2026 GPA Battle Royale - Sandbox Mode. Designed Offline for Ethan ethanbski12@gmail.com.</p>
      </footer>
    </div>

    <!-- Script Injection containing study decks -->
    <script>
      // Load bundled decks assigned during export
      window.STUDY_DECKS = ${decksDataJson};

      // State Managers
      let activeDeckIndex = 0;
      let activeTabName = "summary";
      let flashcardIndex = 0;
      let flashcardIsFlipped = false;
      
      // Quiz stats
      let quizQuestionIdx = 0;
      let quizScore = 0;
      let quizHasSelectedCurrent = false;

      // DOM Elements caching
      const searchInput = document.getElementById("deck-search");
      const decksListDiv = document.getElementById("decks-list");
      const deckCountBadge = document.getElementById("deck-count-badge");

      // Active information
      const activeCodeSpan = document.getElementById("active-deck-code");
      const activeDeptSpan = document.getElementById("active-deck-dept");
      const activeTitleH1 = document.getElementById("active-deck-title");
      const activeSchoolP = document.getElementById("active-deck-school");

      // TAB SUMMARY
      const curExplanationP = document.getElementById("summary-curriculum-explanation");
      const tipsListDiv = document.getElementById("summary-tips-list");
      const notesP = document.getElementById("summary-notes-paragraph");

      // TAB CHEAT SHEET
      const cheatSheetPre = document.getElementById("cheat-sheet-content");

      // TAB TIMELINE
      const timelineDaysList = document.getElementById("timeline-list");

      // TAB FLASHCARDS
      const flashcardTotalSpan = document.getElementById("card-index-total");
      const flashcardCurrentSpan = document.getElementById("card-index-current");
      const flashcardHeaderSpan = document.getElementById("deck-name-header");
      const flashcardTextP = document.getElementById("flashcard-text");
      const flashcardFaceBadge = document.getElementById("flashcard-face-badge");

      // TAB QUIZ
      const quizStartBox = document.getElementById("quiz-start-box");
      const quizActiveBox = document.getElementById("quiz-active-box");
      const quizEndBox = document.getElementById("quiz-end-box");
      const quizCurrentNumSpan = document.getElementById("quiz-current-num");
      const quizTotalNumSpan = document.getElementById("quiz-total-num");
      const quizScoreBadge = document.getElementById("quiz-score-badge");
      const quizQuestionTextH3 = document.getElementById("quiz-question-text");
      const quizOptionsDiv = document.getElementById("quiz-options-container");
      const quizExplanationBox = document.getElementById("quiz-explanation-box");
      const quizFeedbackText = document.getElementById("quiz-feedback-text");
      const quizExplanationText = document.getElementById("quiz-explanation-text");
      const quizNextBtn = document.getElementById("quiz-next-btn");
      
      const pFinalGradePct = document.getElementById("quiz-final-grade-pct");
      const pResultsFraction = document.getElementById("quiz-results-fraction");
      const divStandingBox = document.getElementById("quiz-standing-box");
      const hStandingTitle = document.getElementById("quiz-standing-title");
      const pStandingDesc = document.getElementById("quiz-standing-desc");

      // Initialize App
      function init() {
        renderDecksList("");
        selectDeck(0);
        switchTab("summary");
        
        // Search handler
        searchInput.addEventListener("input", (e) => {
          renderDecksList(e.target.value);
        });

        deckCountBadge.textContent = window.STUDY_DECKS.length;
      }

      function renderDecksList(filterText) {
        decksListDiv.innerHTML = "";
        const lowered = filterText.toLowerCase();

        window.STUDY_DECKS.forEach((deck, index) => {
          if (
            deck.courseCode.toLowerCase().includes(lowered) || 
            deck.courseName.toLowerCase().includes(lowered) ||
            deck.summary.title.toLowerCase().includes(lowered)
          ) {
            const btn = document.createElement("div");
            btn.className = \`p-3 text-left rounded-xl border border-slate-100 hover:bg-slate-100/50 hover:border-slate-300 transition duration-150 cursor-pointer flex flex-col space-y-1 \${index === activeDeckIndex ? 'bg-orange-50 border-orange-200' : 'bg-slate-50'}\`;
            btn.onclick = () => selectDeck(index);

            btn.innerHTML = \`
              <span class="font-mono text-[9px] font-bold text-orange-755 inline-block">\${deck.courseCode}</span>
              <h4 class="text-xs font-extrabold text-slate-800 line-clamp-1">\${deck.summary.title}</h4>
              <p class="text-[9px] text-slate-450 font-mono">\${deck.flashcards.length} cards &bull; \${deck.quiz.length} Qs</p>
            \`;
            decksListDiv.appendChild(btn);
          }
        });
      }

      function selectDeck(index) {
        activeDeckIndex = index;
        const deck = window.STUDY_DECKS[index];
        if (!deck) return;

        // Refresh buttons border highlight
        const cards = decksListDiv.children;
        // Match lists
        renderDecksList(searchInput.value || "");

        // Set labels
        activeCodeSpan.textContent = deck.courseCode;
        activeDeptSpan.textContent = deck.department || "Elective";
        activeTitleH1.textContent = deck.summary.title;
        activeSchoolP.textContent = (deck.schoolName || "Infinite Campus High") + " Review Portal";

        // SUMMARY TAB data Loading
        curExplanationP.textContent = deck.summary.curriculumExplanation;
        
        // Sassy Tips loading
        tipsListDiv.innerHTML = "";
        const tips = deck.summary.topTipsForFinal || [];
        tips.forEach(tip => {
          const li = document.createElement("div");
          li.className = "flex items-start space-x-2.5 p-3.5 bg-yellow-50/25 border border-yellow-250/20 rounded-xl text-xs text-yellow-950 font-medium leading-relaxed font-serif";
          li.innerHTML = \`<span class="text-md">🔥</span> <span>\${tip}</span>\`;
          tipsListDiv.appendChild(li);
        });

        notesP.textContent = deck.summary.synthesizedNotesParagraph;

        // CHEAT SHEET TAB loading
        cheatSheetPre.innerHTML = escapeHtml(deck.summary.coreCheatSheetMarkdown);

        // TIMELINE TAB
        timelineDaysList.innerHTML = "";
        const timeline = deck.timeline || [];
        timeline.forEach((item, dIdx) => {
          const div = document.createElement("div");
          div.className = "relative pl-3.5 space-y-1";
          div.innerHTML = \`
            <div class="absolute -left-[23px] top-1 bg-white border-2 border-indigo-650 text-indigo-750 font-mono font-bold text-[9px] h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
              \${dIdx + 1}
            </div>
            <h4 class="text-xs font-extrabold text-slate-800 uppercase tracking-tight">\${item.dayName}</h4>
            <h5 class="text-xs font-bold text-indigo-750 font-mono">\${item.activityTitle}</h5>
            <p class="text-xs text-slate-550 leading-relaxed font-serif">\${item.activityDescription}</p>
          \`;
          timelineDaysList.appendChild(div);
        });

        // FLASHCARDS reset
        flashcardIndex = 0;
        flashcardIsFlipped = false;
        renderFlashcard();

        // QUIZ RESET
        resetQuiz();

        // Scroll back to top of companion dashboard
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      function switchTab(tabId) {
        activeTabName = tabId;
        
        // Toggle tab highlights
        ["summary", "cheat_sheet", "timeline", "flashcards", "quiz"].forEach(t => {
          const tabBtn = document.getElementById("tab-" + t);
          const tabPane = document.getElementById("content-" + t);
          
          if (t === tabId) {
            tabBtn.className = "flex-1 py-2 px-3 text-xs font-bold rounded-lg transition text-center whitespace-nowrap bg-indigo-650 text-white shadow flex items-center justify-center space-x-2 cursor-pointer";
            tabPane.style.display = "block";
          } else {
            tabBtn.className = "flex-1 py-2 px-3 text-xs font-bold rounded-lg transition text-center whitespace-nowrap bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800 flex items-center justify-center space-x-2 cursor-pointer";
            tabPane.style.display = "none";
          }
        });
      }

      // FLASHCARDS CONTROL
      function renderFlashcard() {
        const deck = window.STUDY_DECKS[activeDeckIndex];
        const cards = deck.flashcards || [];
        
        flashcardTotalSpan.textContent = cards.length;
        flashcardCurrentSpan.textContent = flashcardIndex + 1;
        flashcardHeaderSpan.textContent = deck.courseCode;

        const currentActiveCard = cards[flashcardIndex];
        if (currentActiveCard) {
          if (flashcardIsFlipped) {
            flashcardTextP.textContent = currentActiveCard.answer;
            flashcardFaceBadge.textContent = "Answer (Flipped)";
            flashcardFaceBadge.className = "absolute top-3 right-4 text-[9px] font-mono font-bold uppercase tracking-wider text-orange-550";
          } else {
            flashcardTextP.textContent = currentActiveCard.question;
            flashcardFaceBadge.textContent = "Question (Click to flip)";
            flashcardFaceBadge.className = "absolute top-3 right-4 text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400";
          }
        } else {
          flashcardTextP.textContent = "No flashcards in this deck.";
          flashcardFaceBadge.textContent = "";
        }
      }

      function flipFlashcard() {
        flashcardIsFlipped = !flashcardIsFlipped;
        renderFlashcard();
      }

      function prevFlashcard() {
        const deck = window.STUDY_DECKS[activeDeckIndex];
        const cards = deck.flashcards || [];
        if (cards.length === 0) return;

        flashcardIsFlipped = false;
        if (flashcardIndex === 0) {
          flashcardIndex = cards.length - 1;
        } else {
          flashcardIndex--;
        }
        renderFlashcard();
      }

      function nextFlashcard() {
        const deck = window.STUDY_DECKS[activeDeckIndex];
        const cards = deck.flashcards || [];
        if (cards.length === 0) return;

        flashcardIsFlipped = false;
        if (flashcardIndex === cards.length - 1) {
          flashcardIndex = 0;
        } else {
          flashcardIndex++;
        }
        renderFlashcard();
      }

      // QUIZ EXAM SIMULATOR
      function startQuiz() {
        quizStartBox.style.display = "none";
        quizActiveBox.style.display = "block";
        quizEndBox.style.display = "none";
        quizQuestionIdx = 0;
        quizScore = 0;
        loadQuizQuestion();
      }

      function splitQuestionIntoMatchingSections(questionText) {
        var splitIndex = -1;
        var delimiters = ["?", ",", ":", ";"];
        for (var i = 0; i < delimiters.length; i++) {
          var idx = questionText.indexOf(delimiters[i]);
          if (idx !== -1 && (splitIndex === -1 || idx < splitIndex)) {
            splitIndex = idx + 1;
          }
        }

        if (splitIndex !== -1 && splitIndex > 10 && splitIndex < questionText.length - 10) {
          var part1 = questionText.substring(0, splitIndex).trim();
          var part2 = questionText.substring(splitIndex).trim();
          return { part1: part1, part2: part2 };
        }

        var words = questionText.split(" ");
        if (words.length <= 4) {
          return { part1: questionText, part2: "" };
        }
        var mid = Math.ceil(words.length / 2);
        var part1 = words.slice(0, mid).join(" ");
        var part2 = words.slice(mid).join(" ");
        return { part1: part1, part2: part2 };
      }

      function splitOptionIntoMatchingSections(optionText) {
        var prefix = "";
        var rest = optionText;
        var prefixMatch = optionText.match(/^([A-D]\))\s*(.*)/);
        if (prefixMatch) {
          prefix = prefixMatch[1];
          rest = prefixMatch[2];
        }
        
        var words = rest.split(" ");
        if (words.length <= 2) {
          return { prefix: prefix, part1: rest, part2: "" };
        }
        var mid = Math.ceil(words.length / 2);
        var part1 = words.slice(0, mid).join(" ");
        var part2 = words.slice(mid).join(" ");
        return { prefix: prefix, part1: part1, part2: part2 };
      }

      function loadQuizQuestion() {
        const deck = window.STUDY_DECKS[activeDeckIndex];
        const questions = deck.quiz || [];
        
        quizCurrentNumSpan.textContent = quizQuestionIdx + 1;
        quizTotalNumSpan.textContent = questions.length;
        quizScoreBadge.textContent = quizScore + "/" + questions.length;
        quizHasSelectedCurrent = false;

        quizExplanationBox.style.display = "none";
        quizNextBtn.style.display = "none";

        const q = questions[quizQuestionIdx];
        if (!q) {
          finishQuiz();
          return;
        }

        const qs = splitQuestionIntoMatchingSections(q.question);
        quizQuestionTextH3.innerHTML = '<div class="mb-2 flex items-center gap-2"><span class="text-[9px] font-mono font-black text-rose-850 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 uppercase tracking-wider">🔴 Red recall</span><span class="text-[9px] font-mono font-black text-blue-850 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 uppercase tracking-wider">🔵 Blue match</span></div>' +
          '<div class="leading-relaxed font-serif text-sm md:text-base"><span class="text-rose-700 font-extrabold underline decoration-red-100 mr-1.5">' + qs.part1 + '</span>' + 
          (qs.part2 ? '<span class="text-blue-700 font-bold underline decoration-blue-100">' + qs.part2 + '</span>' : '') + '</div>';

        quizOptionsDiv.innerHTML = "";

        q.options.forEach((opt, oIdx) => {
          const cardBtn = document.createElement("button");
          cardBtn.className = "w-full p-3.5 text-left rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition cursor-pointer text-xs font-semibold flex items-center";
          cardBtn.onclick = () => selectQuizOption(oIdx);
          
          const optParts = splitOptionIntoMatchingSections(opt);
          var html = '<div class="flex items-center w-full text-left">';
          if (optParts.prefix) {
            html += '<span class="font-mono text-[10px] font-black bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-700 mr-2 shrink-0">' + optParts.prefix + '</span>';
          }
          html += '<span class="text-rose-700 font-extrabold underline decoration-red-100 mr-1.5">' + optParts.part1 + '</span>';
          if (optParts.part2) {
            html += '<span class="text-blue-700 font-semibold underline decoration-blue-100">' + optParts.part2 + '</span>';
          }
          html += '</div>';
          
          cardBtn.innerHTML = html;
          quizOptionsDiv.appendChild(cardBtn);
        });
      }

      function selectQuizOption(optionIdx) {
        if (quizHasSelectedCurrent) return; // Freeze once selected
        quizHasSelectedCurrent = true;

        const deck = window.STUDY_DECKS[activeDeckIndex];
        const q = deck.quiz[quizQuestionIdx];
        const isCorrect = optionIdx === q.correctIndex;

        if (isCorrect) {
          quizScore++;
          quizScoreBadge.textContent = quizScore + "/" + deck.quiz.length;
        }

        // Color code choices
        const buttons = quizOptionsDiv.children;
        for (let i = 0; i < buttons.length; i++) {
          if (i === q.correctIndex) {
            buttons[i].className = "w-full p-3.5 text-left rounded-xl border-2 border-emerald-500 bg-emerald-50 text-emerald-900 transition font-bold text-xs flex items-center";
          } else if (i === optionIdx) {
            buttons[i].className = "w-full p-3.5 text-left rounded-xl border-2 border-blue-500 bg-blue-50 text-blue-900 transition font-bold text-xs flex items-center";
          } else {
            buttons[i].className = "w-full p-3.5 text-left rounded-xl border border-slate-100 bg-white opacity-60 text-slate-400 transition text-xs flex items-center";
          }
        }

        // Show detailed validation explanation
        quizFeedbackText.textContent = isCorrect 
          ? "🎉 STRIKE HIGHLIGHT - CORRECT OUTCOME" 
          : "🚨 INFINITE CAMPUS PENALTY - INCORRECT RESPONSE";
        quizFeedbackText.className = isCorrect 
          ? "font-extrabold uppercase tracking-wide text-[10px] mb-1 text-emerald-700"
          : "font-extrabold uppercase tracking-wide text-[10px] mb-1 text-blue-700";
        
        quizExplanationText.textContent = q.explanation;
        quizExplanationBox.className = isCorrect
          ? "p-4 rounded-xl border border-emerald-150 bg-emerald-50/30 text-xs flex flex-col"
          : "p-4 rounded-xl border border-blue-150 bg-blue-50/30 text-xs flex flex-col";
        quizExplanationBox.style.display = "block";

        quizNextBtn.style.display = "inline-block";
      }

      function submitNextQuizQuestion() {
        const deck = window.STUDY_DECKS[activeDeckIndex];
        const questions = deck.quiz || [];
        
        quizQuestionIdx++;
        if (quizQuestionIdx >= questions.length) {
          finishQuiz();
        } else {
          loadQuizQuestion();
        }
      }

      function finishQuiz() {
        const deck = window.STUDY_DECKS[activeDeckIndex];
        const questions = deck.quiz || [];
        const scoreFraction = quizScore + "/" + questions.length;
        const pct = Math.round((quizScore / questions.length) * 100);

        quizStartBox.style.display = "none";
        quizActiveBox.style.display = "none";
        quizEndBox.style.display = "block";

        pFinalGradePct.textContent = pct + "%";
        pResultsFraction.textContent = scoreFraction + " correct answers";

        // Grade dynamic standing borders
        if (pct >= 90) {
          divStandingBox.className = "p-5 rounded-2xl border border-emerald-250 bg-emerald-50/45 text-left space-y-2";
          hStandingTitle.textContent = "🥇 4.0 GPA DEITY OUTCOME (SUPERB)";
          hStandingTitle.className = "text-xs font-mono font-extrabold uppercase text-emerald-800";
          pStandingDesc.textContent = "You have absolutely crushed the content! Standard deviation fears your name, and Infinite Campus stands helpless. Sleep peacefully or continue reviewing to claim absolute class divinity.";
        } else if (pct >= 80) {
          divStandingBox.className = "p-5 rounded-2xl border border-indigo-250 bg-indigo-50/45 text-left space-y-2";
          hStandingTitle.textContent = "🥈 ACADEMIC SOLIDITY - GRADE SECURED";
          hStandingTitle.className = "text-xs font-mono font-extrabold uppercase text-indigo-800";
          pStandingDesc.textContent = "Incredible output! You hold a safe position. Let's do a few rapid rehearsals of the questions you missed to lock in the A and trigger the home celebration!";
        } else if (pct >= 65) {
          divStandingBox.className = "p-5 rounded-2xl border border-amber-250 bg-amber-50/45 text-left space-y-2";
          hStandingTitle.textContent = "⚠️ GPA BORDERLINE COPE - EXTRA CAFFEINE REQUIRED";
          hStandingTitle.className = "text-xs font-mono font-extrabold uppercase text-amber-800";
          pStandingDesc.textContent = "Your grade is currently balancing on a standard deviation knife-edge! One minor slip-up and the gradebook slides. Re-read the master cheat-sheet and practice again.";
        } else {
          divStandingBox.className = "p-5 rounded-2xl border border-blue-250 bg-blue-50/45 text-left space-y-2";
          hStandingTitle.textContent = "🚨 CRITICAL EMERGENCY WAKE UP ALARM";
          hStandingTitle.className = "text-xs font-mono font-extrabold uppercase text-blue-800";
          pStandingDesc.textContent = "Tung tung tung sahur! sahur! Wake up! Your GPA is in absolute freefall at infinite campus velocity. Put down the video games, memorize the core recall coordinates, and retry this diagnostic immediately!";
        }
      }

      function resetQuiz() {
        quizStartBox.style.display = "block";
        quizActiveBox.style.display = "none";
        quizEndBox.style.display = "none";
        quizQuestionIdx = 0;
        quizScore = 0;
        quizHasSelectedCurrent = false;
      }

      // HELPERS
      function escapeHtml(text) {
        if (!text) return "";
        return text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      }

      // Fire off
      window.onload = init;
    </script>
  </body>
</html>`;
}
