export interface FallbackDeckData {
  summary: {
    title: string;
    curriculumExplanation: string;
    topTipsForFinal: string[];
    synthesizedNotesParagraph: string;
    coreCheatSheetMarkdown: string;
  };
  timeline: Array<{
    dayName: string;
    activityTitle: string;
    activityDescription: string;
  }>;
  flashcards: Array<{
    question: string;
    answer: string;
  }>;
  quiz: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

export function generateAcademicFallbackDeck(params: {
  schoolName?: string;
  courseCode: string;
  courseName?: string;
  department?: string;
  curriculumDetails?: string;
  examFocus?: string;
  studyStrategy?: string;
}): FallbackDeckData {
  const { schoolName = "Infinite Campus High", courseCode, courseName = `Course ${courseCode}`, department = "General", curriculumDetails = "", examFocus = "", studyStrategy = "" } = params;

  const title = `${courseName} (${courseCode}): Final Exam Survival Deck`;
  const curriculumExplanation = `This rigorous study companion is mapped directly to the official high school syllabus for ${courseName} at ${schoolName}. It synthesizes essential concepts, testable definitions, core formulas, and critical diagnostic patterns into a high-yield finals review system.`;

  const topTipsForFinal = [
    `Double-check your notation and variable assignments before submitting—minor calculation slips cause 80% of preventable grade drops.`,
    `Focus on high-weight concepts from the latter half of the semester; final exams disproportionately test synthesis across multiple units.`,
    `Time your practice sessions: give yourself no more than 75 seconds per multiple-choice item to build exam-day pacing confidence.`,
    `Review past homework errors and quiz corrections—teachers frequently repurpose modified versions of previous questions.`
  ];

  const synthesizedNotesParagraph = `Mastering ${courseName} requires a dual approach: conceptual understanding and algorithmic execution. Key areas covered in this curriculum include: ${curriculumDetails || "fundamental core principles, problem-solving methodologies, structural analysis, and contextual applications"}. When preparing for the cumulative exam, ensure you can work backward from solutions, identify edge conditions, and articulate theoretical foundations without relying on notes.`;

  const coreCheatSheetMarkdown = `### Core Formula & Concept Quick-Reference: ${courseName}

#### Key Principles & Definitions
- **Fundamental Rule 1**: Always state initial assumptions and boundary conditions prior to solving.
- **Verification Check**: Substitute calculated values back into the primary relationship to verify consistency.
- **Dimensional & Unit Analysis**: Verify that both sides of any equality maintain equivalent dimensions.

#### Strategic Exam Tips
- **Pacing**: Scan the full exam first; solve straightforward direct-recall problems before tackling multi-step questions.
- **Calculations**: Keep unrounded intermediate values in your calculator memory to avoid compound rounding errors.
- **High-Yield Focus**: ${examFocus || "Focus on multi-unit synthesis problems and complex application questions."}

#### Recommended Study Protocol
- ${studyStrategy || "Active recall through practice problems, self-quizzing, and spaced repetition intervals."}`;

  const timeline = [
    {
      dayName: "Day 1: Diagnostics & Foundations",
      activityTitle: "Baseline Knowledge Audit",
      activityDescription: `Audit the syllabus for ${courseName}. Identify weakest topic areas and review core definitions, theorems, and fundamental cheat sheet formulas.`
    },
    {
      dayName: "Day 2: Algorithmic Drills",
      activityTitle: "Problem Solving & Calculation Mastery",
      activityDescription: "Work through 15-20 representative practice problems with step-by-step verification. Focus on avoiding standard algebraic and conceptual pitfalls."
    },
    {
      dayName: "Day 3: Active Recall & Flashcards",
      activityTitle: "Rapid-Fire Concept Retention",
      activityDescription: "Cycle through the flashcard deck until achieving 100% recall. Test yourself on vocabulary, variable definitions, and boundary conditions without hints."
    },
    {
      dayName: "Day 4: Timed Practice Sim",
      activityTitle: "Full-Length Mock Exam Drill",
      activityDescription: "Take a timed 25-question practice quiz under exam conditions. Review explanations for every missed item to patch remaining knowledge gaps."
    },
    {
      dayName: "Day 5: Synthesis & Pre-Exam Rest",
      activityTitle: "Final Cheat Sheet Review",
      activityDescription: "Do a light 20-minute scan of high-yield formulas and cheat sheets. Avoid cramming late into the night—adequate rest increases cognitive retrieval speed by up to 25%."
    }
  ];

  const flashcards = [
    {
      question: `What is the primary conceptual focus of ${courseName}?`,
      answer: `Understanding and applying ${curriculumDetails || "core subject principles, structural methodologies, and analytical problem-solving techniques"} under cumulative testing standards.`
    },
    {
      question: `How should you approach complex multi-step problems on the final?`,
      answer: `Deconstruct the prompt into given variables, identify the target unknown, select the governing equation/principle, and verify units upon completion.`
    },
    {
      question: `What is the most effective method to avoid calculation errors?`,
      answer: `Write each intermediate step clearly, maintain significant figures throughout calculations, and perform an order-of-magnitude sanity check on the final result.`
    },
    {
      question: `Why is spaced repetition superior to massed cramming?`,
      answer: `Spaced repetition leverages the testing effect and neural consolidation, significantly strengthening long-term memory retrieval pathways during high-stress exams.`
    },
    {
      question: `What should you do immediately if you get stuck on a difficult question?`,
      answer: `Flag it, proceed through all remaining accessible questions to secure guaranteed points, and return with a fresh perspective and available remaining time.`
    },
    {
      question: `What is the primary indicator of mastery in ${courseName}?`,
      answer: `The ability to explain the underlying logic to a peer without referencing notes and correctly diagnosing why incorrect answer options are false.`
    },
    {
      question: `How do teachers typically construct distractor options in multiple-choice exams?`,
      answer: `Distractors are created using the most common intermediate calculation slips, sign errors, or misapplied inverse operations.`
    },
    {
      question: `What role does dimensional/unit analysis play during testing?`,
      answer: `It provides an instant sanity check to confirm that your derived expression or numerical answer matches the expected physical or logical quantity.`
    }
  ];

  const quiz = generateFallbackQuiz(courseName, courseCode, department, 25);

  return {
    summary: {
      title,
      curriculumExplanation,
      topTipsForFinal,
      synthesizedNotesParagraph,
      coreCheatSheetMarkdown
    },
    timeline,
    flashcards,
    quiz
  };
}

export function generateFallbackQuiz(
  courseName: string,
  courseCode: string,
  department: string,
  count = 25
): Array<{
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}> {
  const isMath = /math|calc|alg|geom|stat|trig/i.test(courseName + courseCode + department);
  const isScience = /sci|chem|bio|phys/i.test(courseName + courseCode + department);
  const isCS = /comp|cs|code|prog|java|python/i.test(courseName + courseCode + department);
  const isHistory = /hist|gov|civ|world|us|geo/i.test(courseName + courseCode + department);
  const isEnglish = /eng|lit|write|lang/i.test(courseName + courseCode + department);

  const questions: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }> = [];

  for (let i = 1; i <= count; i++) {
    if (isCS) {
      const qTemplates = [
        {
          q: `In Java, what is the output of evaluating (17 % 5) * 3 + (14 / 4)?`,
          opts: ["A) 9", "B) 6", "C) 11", "D) 8"],
          correct: 0,
          exp: "17 % 5 = 2. Then 2 * 3 = 6. Integer division 14 / 4 = 3 (truncates decimal). 6 + 3 = 9. Solid arithmetic logic prevents Infinite Campus disasters!"
        },
        {
          q: `Which time complexity represents searching an unsorted array of n elements sequentially?`,
          opts: ["A) O(1)", "B) O(log n)", "C) O(n)", "D) O(n²)"],
          correct: 2,
          exp: "Linear search requires traversing each element in the worst case, yielding O(n) runtime complexity."
        },
        {
          q: `What happens when you attempt to access array[array.length] in Java?`,
          opts: ["A) Returns null", "B) Returns 0", "C) Throws ArrayIndexOutOfBoundsException", "D) Extends array size"],
          correct: 2,
          exp: "Arrays in Java are 0-indexed, so the valid indices are 0 to length - 1. Accessing length triggers ArrayIndexOutOfBoundsException."
        },
        {
          q: `Which keyword is used in Java to inherit a parent class?`,
          opts: ["A) implements", "B) extends", "C) inherits", "D) super"],
          correct: 1,
          exp: "In Java, 'extends' is used for class inheritance, while 'implements' is reserved for interface realization."
        },
        {
          q: `What is the return type of a class constructor in Java?`,
          opts: ["A) void", "B) Object", "C) No return type is declared", "D) int"],
          correct: 2,
          exp: "Constructors in Java never declare any return type (not even void). Declaring a return type turns it into a standard method."
        }
      ];
      const template = qTemplates[(i - 1) % qTemplates.length];
      questions.push({
        question: `[Q${i}] ${template.q}`,
        options: template.opts,
        correctIndex: template.correct,
        explanation: template.exp
      });
    } else if (isMath) {
      const qTemplates = [
        {
          q: `If f(x) = 3x² - 4x + 7, what is the derivative f'(x) evaluated at x = 2?`,
          opts: ["A) 8", "B) 12", "C) 16", "D) 4"],
          correct: 0,
          exp: "f'(x) = d/dx (3x² - 4x + 7) = 6x - 4. Evaluating at x = 2: 6(2) - 4 = 12 - 4 = 8. Clean calculus mechanics!"
        },
        {
          q: `What is the value of log₂(64)?`,
          opts: ["A) 4", "B) 5", "C) 6", "D) 8"],
          correct: 2,
          exp: "Because 2⁶ = 64, log₂(64) = 6. Free points on the final exam!"
        },
        {
          q: `What is the slope of the line perpendicular to y = -(2/3)x + 5?`,
          opts: ["A) 2/3", "B) -3/2", "C) 3/2", "D) -2/3"],
          correct: 2,
          exp: "Perpendicular lines have negative reciprocal slopes. The negative reciprocal of -2/3 is +3/2."
        },
        {
          q: `In a standard normal distribution, approximately what percentage of observations fall within ±1 standard deviation of the mean?`,
          opts: ["A) 50%", "B) 68%", "C) 95%", "D) 99.7%"],
          correct: 1,
          exp: "By the Empirical 68-95-99.7 Rule, approximately 68% of data falls within 1 standard deviation of the mean in a bell curve."
        },
        {
          q: `What is the exact value of sin(π/6)?`,
          opts: ["A) √3/2", "B) 1/2", "C) √2/2", "D) 1"],
          correct: 1,
          exp: "On the unit circle, sin(π/6) = sin(30°) = 1/2. Essential trigonometry recall."
        }
      ];
      const template = qTemplates[(i - 1) % qTemplates.length];
      questions.push({
        question: `[Q${i}] ${template.q}`,
        options: template.opts,
        correctIndex: template.correct,
        explanation: template.exp
      });
    } else if (isScience) {
      const qTemplates = [
        {
          q: `What is the molar mass of water (H2O), given atomic masses H ≈ 1.01 g/mol and O ≈ 16.00 g/mol?`,
          opts: ["A) 17.01 g/mol", "B) 18.02 g/mol", "C) 34.02 g/mol", "D) 16.00 g/mol"],
          correct: 1,
          exp: "Molar mass = 2(1.01) + 16.00 = 2.02 + 16.00 = 18.02 g/mol. Foundational stoichiometry at its best."
        },
        {
          q: `Which organelle is known as the powerhouse of eukaryotic cells responsible for cellular respiration?`,
          opts: ["A) Ribosome", "B) Endoplasmic Reticulum", "C) Mitochondria", "D) Golgi Apparatus"],
          correct: 2,
          exp: "Mitochondria generate the majority of cellular ATP via oxidative phosphorylation and the Krebs cycle."
        },
        {
          q: `According to Newton's Second Law of Motion, what is the net force F acting on an object with mass m and acceleration a?`,
          opts: ["A) F = m / a", "B) F = m * a", "C) F = 1/2 m * a²", "D) F = m * v"],
          correct: 1,
          exp: "Newton's second law states that Net Force = mass × acceleration (F = ma)."
        },
        {
          q: `What is the pH of a neutral aqueous solution at 25°C?`,
          opts: ["A) 0", "B) 14", "C) 7", "D) 1"],
          correct: 2,
          exp: "At 25°C, [H+] = [OH-] = 1.0 × 10⁻⁷ M, resulting in -log(10⁻⁷) = pH 7."
        }
      ];
      const template = qTemplates[(i - 1) % qTemplates.length];
      questions.push({
        question: `[Q${i}] ${template.q}`,
        options: template.opts,
        correctIndex: template.correct,
        explanation: template.exp
      });
    } else if (isHistory) {
      const qTemplates = [
        {
          q: `Which constitutional amendment officially abolished slavery throughout the United States in 1865?`,
          opts: ["A) 10th Amendment", "B) 13th Amendment", "C) 14th Amendment", "D) 19th Amendment"],
          correct: 1,
          exp: "The 13th Amendment to the US Constitution abolished slavery and involuntary servitude except as punishment for a crime."
        },
        {
          q: `What was the primary economic consequence of the Treaty of Versailles on Weimar Germany?`,
          opts: ["A) Massive agricultural surplus", "B) Severe war reparations and crippling hyperinflation", "C) Industrial demilitarization without debt", "D) Instant economic dominance"],
          correct: 1,
          exp: "Heavy war reparations imposed under Article 231 led to economic instability and severe hyperinflation in 1923 Weimar Germany."
        },
        {
          q: `Which Enlightenment philosopher argued for the separation of governmental powers into executive, legislative, and judicial branches?`,
          opts: ["A) Thomas Hobbes", "B) Baron de Montesquieu", "C) Jean-Jacques Rousseau", "D) John Locke"],
          correct: 1,
          exp: "Montesquieu articulated the separation of powers in 'The Spirit of the Laws' (1748), heavily influencing the US Constitution."
        }
      ];
      const template = qTemplates[(i - 1) % qTemplates.length];
      questions.push({
        question: `[Q${i}] ${template.q}`,
        options: template.opts,
        correctIndex: template.correct,
        explanation: template.exp
      });
    } else {
      const qTemplates = [
        {
          q: `Which of the following best defines a primary source in academic research?`,
          opts: ["A) A textbook summarizing historical events", "B) An original document, artifact, or first-hand recording created at the time of study", "C) A peer-reviewed scholarly commentary written decades later", "D) An encyclopedia entry"],
          correct: 1,
          exp: "Primary sources provide direct, firsthand evidence regarding an event, person, or work of art."
        },
        {
          q: `In deductive reasoning, if the premises are true and the logical form is valid, what must be true of the conclusion?`,
          opts: ["A) It is probably false", "B) It is possibly true", "C) It must necessarily be true", "D) It cannot be evaluated"],
          correct: 2,
          exp: "Deductive validity guarantees that true premises lead necessarily to a true conclusion."
        },
        {
          q: `Which rhetorical appeal relies on establishing the speaker's credibility, authority, and character?`,
          opts: ["A) Logos", "B) Pathos", "C) Ethos", "D) Kairos"],
          correct: 2,
          exp: "Ethos appeals to authority, trustworthiness, and ethical character of the author or speaker."
        },
        {
          q: `What is the primary function of an independent variable in controlled experimental design?`,
          opts: ["A) The factor that is intentionally manipulated by the researcher", "B) The measured outcome that responds to changes", "C) The variable kept strictly constant", "D) The random error term"],
          correct: 0,
          exp: "The independent variable is the deliberately varied parameter tested to measure its effect on the dependent variable."
        }
      ];
      const template = qTemplates[(i - 1) % qTemplates.length];
      questions.push({
        question: `[Q${i}] ${template.q}`,
        options: template.opts,
        correctIndex: template.correct,
        explanation: template.exp
      });
    }
  }

  return questions;
}
