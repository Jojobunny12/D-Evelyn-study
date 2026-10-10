import React, { useState } from "react";
import { StudyDeck, QuizQuestion } from "../types";
import { deduceCourse } from "../utils/courseDeducer";
import { downloadMockExamPdf } from "../utils/pdfExporter";
import { FileText, Calendar, Layers, CheckSquare, BarChart, ChevronLeft, ChevronRight, Check, X, RefreshCw, Bookmark, Award, HelpCircle, Sparkles, Loader2, FileDown, Download, CheckCircle2 } from "lucide-react";

interface StudyDeckViewProps {
  deck: StudyDeck;
  onBack: () => void;
  onUpdateDeck?: (updatedDeck: StudyDeck) => void;
}

export default function StudyDeckView({ deck, onBack, onUpdateDeck }: StudyDeckViewProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "timeline" | "flashcards" | "quiz">("summary");

  const flashcards = deck.flashcards || [];
  const timeline = deck.timeline || [];
  const topTips = deck.summary?.topTipsForFinal || [];

  // Stable memoized 100 multiple-choice questions
  const organizedQuiz = React.useMemo(() => {
    const originalQuestions = [...(deck.quiz || [])];
    
    // If we already have 100 or more, just keep them or slice to 100
    if (originalQuestions.length >= 100) {
      return originalQuestions.slice(0, 100);
    }
    
    // Deduce department to provide actual, high-yield academic study questions
    const deduced = deduceCourse(deck.courseCode || "");
    let deducedDept: "MATH" | "SCIENCE" | "HISTORY" | "LANGUAGE" | "ENGLISH" | "ARTS" | "ELECTIVES" | "GENERAL" = "GENERAL";

    if (deduced.department === "Mathematics") {
      deducedDept = "MATH";
    } else if (deduced.department === "Science") {
      deducedDept = "SCIENCE";
    } else if (deduced.department === "Social Studies") {
      deducedDept = "HISTORY";
    } else if (deduced.department === "Foreign Language") {
      deducedDept = "LANGUAGE";
    } else if (deduced.department === "English") {
      deducedDept = "ENGLISH";
    } else if (deduced.department === "Fine Arts") {
      deducedDept = "ARTS";
    } else if (deduced.department === "Electives") {
      deducedDept = "ELECTIVES";
    }

    // High quality academic question pool that serves real educational value
    const academicPools = {
      MATH: [
        {
          question: "Solve the quadratic equation x² - 8x + 15 = 0 for x.",
          options: [
            "A) x = 3 or x = 5",
            "B) x = -3 or x = -5",
            "C) x = 2 or x = 6",
            "D) x = 1 or x = 15"
          ],
          correctIndex: 0,
          explanation: "Factoring x² - 8x + 15 gives (x - 3)(x - 5) = 0. Therefore, the roots are x = 3 and x = 5. Highly authentic standard algebra outcome!"
        },
        {
          question: "What is the exact value of sin(2θ) if sin(θ) = 3/5 and θ is in Quadrant I?",
          options: [
            "A) 24/25",
            "B) 12/25",
            "C) 6/5",
            "D) 7/25"
          ],
          correctIndex: 0,
          explanation: "In Quadrant I, cos(θ) = 4/5 (using the Pythagorean identity or 3-4-5 triangle). Using the double-angle formula: sin(2θ) = 2 sin(θ) cos(θ) = 2 * (3/5) * (4/5) = 24/25."
        },
        {
          question: "For the geometric sequence 3, 6, 12, 24, ..., find the exact 8th term of the series.",
          options: [
            "A) 384",
            "B) 192",
            "C) 768",
            "D) 512"
          ],
          correctIndex: 0,
          explanation: "The common ratio r is 2. The nth term formula is a_n = a_1 * r^(n-1). So the 8th term is a_8 = 3 * 2⁷ = 3 * 128 = 384."
        },
        {
          question: "Determine the vertex coordinates of the parabola represented by the equation y = 2x² - 12x + 11.",
          options: [
            "A) (3, -7)",
            "B) (-3, 7)",
            "C) (3, 11)",
            "D) (6, -25)"
          ],
          correctIndex: 0,
          explanation: "The x-coordinate of the vertex is h = -b / (2a) = -(-12) / (2 * 2) = 3. Substituting x = 3, we get y = 2(3)² - 12(3) + 11 = 18 - 36 + 11 = -7. Thus, the vertex is (3, -7)."
        },
        {
          question: "Find the exact distance in the Cartesian coordinate plane between (2, -3) and (-4, 5).",
          options: [
            "A) 10 units",
            "B) 2√5 units",
            "C) √50 units",
            "D) 8 units"
          ],
          correctIndex: 0,
          explanation: "Using the distance formula: d = √((x₂ - x₁)² + (y₂ - y₁)²) = √((-4 - 2)² + (5 - (-3))²) = √((-6)² + 8²) = √(36 + 64) = √100 = 10."
        },
        {
          question: "Evaluate the analytical limit: lim (x -> 3) (x² - 9) / (x - 3).",
          options: [
            "A) 6",
            "B) 3",
            "C) 0",
            "D) Undefined (Does not exist)"
          ],
          correctIndex: 0,
          explanation: "Factoring the numerator yields (x - 3)(x + 3) / (x - 3). Cancelling the (x - 3) factor leaves (x + 3). Evaluating at x = 3 yields 3 + 3 = 6."
        },
        {
          question: "What is the slope of a straight line perpendicular to the line represented by 3x - 4y = 12?",
          options: [
            "A) -4/3",
            "B) 4/3",
            "C) 3/4",
            "D) -3/4"
          ],
          correctIndex: 0,
          explanation: "Converting the given equation to slope-intercept form gives y = (3/4)x - 3, so its slope is 3/4. The perpendicular slope is the negative reciprocal: -4/3."
        },
        {
          question: "Solve the logarithmic equation for x: e^(2x - 1) = 5.",
          options: [
            "A) x = (ln(5) + 1) / 2",
            "B) x = ln(3)",
            "C) x = ln(5) / 2",
            "D) x = 2 ln(5) + 1"
          ],
          correctIndex: 0,
          explanation: "Taking the natural logarithm of both sides gives 2x - 1 = ln(5). Adding 1 and dividing by 2 yields x = (ln(5) + 1) / 2."
        },
        {
          question: "Identify the asymptotic equations for the hyperbola represented by x²/16 - y²/9 = 1.",
          options: [
            "A) y = ± (3/4)x",
            "B) y = ± (4/3)x",
            "C) y = ± (9/16)x",
            "D) y = ± 12x"
          ],
          correctIndex: 0,
          explanation: "For a horizontal hyperbola centered at the origin, the equations of the asymptotes are y = ± (b/a)x. Here, a = 4 and b = 3, so y = ± (3/4)x."
        },
        {
          question: "Which expression is Trigonometrically equivalent to the identity cos²(x) - sin²(x)?",
          options: [
            "A) cos(2x)",
            "B) sin(2x)",
            "C) 1",
            "D) 2 cos(x)"
          ],
          correctIndex: 0,
          explanation: "By double-angle trigonometric identities, the expression cos²(x) - sin²(x) is the fundamental expansion of cos(2x)."
        }
      ],
      SCIENCE: [
        {
          question: "What is the exact mass percentage of Oxygen inside a pure water molecule (H₂O)? (Molar Masses: H = 1.01 g/mol, O = 16.00 g/mol)",
          options: [
            "A) 88.8%",
            "B) 11.2%",
            "C) 50.0%",
            "D) 94.1%"
          ],
          correctIndex: 0,
          explanation: "The molar mass of water is 2(1.01) + 16.00 = 18.02 g/mol. Oxygen percentage = (16.00 / 18.02) * 100% = 88.8%."
        },
        {
          question: "Which subatomic atom particle determines the chemical identity of an element (matching its unique atomic number)?",
          options: [
            "A) Proton",
            "B) Neutron",
            "C) Electron",
            "D) Positron"
          ],
          correctIndex: 0,
          explanation: "The proton count is the atomic number and acts as the unique signature for each element on the periodic table."
        },
        {
          question: "What is the expression for the reaction quotient (Q_c) for: N₂ (g) + 3H₂ (g) <==> 2NH₃ (g)?",
          options: [
            "A) Q_c = [NH₃]² / ([N₂] * [H₂]³)",
            "B) Q_c = ([N₂] * [H₂]³) / [NH₃]²",
            "C) Q_c = [NH₃] / ([N₂] * [H₂])",
            "D) Q_c = [NH₃]² / ([N₂] + 3[H₂])"
          ],
          correctIndex: 0,
          explanation: "The reaction quotient evaluates as the product molarities raised to their coefficients divided by reactant molarities raised to theirs, so [NH₃]² / ([N₂] * [H₂]³)."
        },
        {
          question: "An object of mass 10 kg undergoes constant acceleration of 4 m/s². What net Force is acting on it?",
          options: [
            "A) 40 N",
            "B) 2.5 N",
            "C) 25 N",
            "D) 14 N"
          ],
          correctIndex: 0,
          explanation: "By Newton's Second Law: Force = Mass * Acceleration (F = m * a). Here F = 10 kg * 4 m/s² = 40 Newtons."
        },
        {
          question: "What is the molecular geometry of Carbon Dioxide (CO₂) based on VSEPR theory?",
          options: [
            "A) Linear",
            "B) Bent",
            "C) Trigonal Planar",
            "D) Tetrahedral"
          ],
          correctIndex: 0,
          explanation: "CO₂ features two double bonds and zero lone pairs on the central carbon, yielding a symmetric linear geometry of 180 degrees."
        },
        {
          question: "Name the metabolic pathway that oxidizes one glucose molecule into two pyruvatemolecules with a net production of 2 ATP and 2 NADH.",
          options: [
            "A) Glycolysis",
            "B) Krebs Cycle",
            "C) Electron Transport Chain",
            "D) Calvin Cycle"
          ],
          correctIndex: 0,
          explanation: "Glycolysis comprises the cytoplasm reactions converting glucose into Pyruvate to prepare substrates for aerobic mitochondria pathways."
        },
        {
          question: "Which intermolecular force is strongest in liquid water?",
          options: [
            "A) Hydrogen Bonding",
            "B) Dipole-Dipole Interaction",
            "C) London Dispersion Forces",
            "D) Covalent Bonding"
          ],
          correctIndex: 0,
          explanation: "While covalent bonds are intramolecular, hydrogen bonding is the strongest intermolecular attractive force holding water molecules together in the liquid phase."
        },
        {
          question: "Determine the oxidation state of the Sulfur atom in the sulfate polyatomic ion (SO₄²⁻).",
          options: [
            "A) +6",
            "B) +4",
            "C) -2",
            "D) +8"
          ],
          correctIndex: 0,
          explanation: "Oxygen has an oxidation state of -2. For SO₄²⁻, let S be the oxidation number: S + 4(-2) = -2 => S - 8 = -2 => S = +6."
        },
        {
          question: "According to Le Chatelier’s principle, what is the effect of raising the temperature of an exothermic system in chemical equilibrium?",
          options: [
            "A) Equilibrium shifts left to favor the reactants",
            "B) Equilibrium shifts right to favor the products",
            "C) The equilibrium constant K increases",
            "D) No shift occurs in either direction"
          ],
          correctIndex: 0,
          explanation: "In an exothermic reaction, heat is a product. Adding heat causes the reaction to shift left to consume the excess energy, favoring reactants."
        },
        {
          question: "Find the frequency of an electromagnetic wave with a wavelength of 6.0 x 10⁻⁷ m. (c = 3.0 x 10⁸ m/s)",
          options: [
            "A) 5.0 x 10¹⁴ Hz",
            "B) 2.0 x 10¹⁵ Hz",
            "C) 1.8 x 10² Hz",
            "D) 5.0 x 10⁶ Hz"
          ],
          correctIndex: 0,
          explanation: "Using the wave equation c = λ * ν, the frequency is ν = c / λ = (3.0 x 10⁸ m/s) / (6.0 x 10⁻⁷ m) = 5.0 x 10¹⁴ Hz."
        }
      ],
      HISTORY: [
        {
          question: "What was a primary constitutional weakness of the Articles of Confederation in the initial US system of governance?",
          options: [
            "A) The federal government lacked the authority to levy and collect national taxes.",
            "B) The executive branch held unchecked unilateral veto authority.",
            "C) It banned states from issuing or circulating their own reserve currency.",
            "D) It required a simple majority to enact constitutional revisions."
          ],
          correctIndex: 0,
          explanation: "Under the Articles, Congress could only request funds from states, severely limiting the treasury and national defense budgets."
        },
        {
          question: "Which foundational Charter signed in 1215 established the legal principle that the sovereign is subject to the rule of law?",
          options: [
            "A) Magna Carta",
            "B) Treaty of Westphalia",
            "C) Declaration of the Rights of Man",
            "D) English Bill of Rights"
          ],
          correctIndex: 0,
          explanation: "King John signed the Magna Carta, guaranteeing due process and establishing that the crown's authority was not absolute."
        },
        {
          question: "What major geopolitical event directly prompted USA input and formal entry into World War II?",
          options: [
            "A) The surprise attack on Pearl Harbor",
            "B) German submarine sinking of the Lusitania",
            "C) Germany's tactical invasion of Poland",
            "D) The signing of the Lend-Lease program"
          ],
          correctIndex: 0,
          explanation: "Japan's surprise attack on Pearl Harbor on December 7, 1941, catalyzed Congress to declare war, ending American isolationism."
        },
        {
          question: "Which English philosopher pioneered the concept of natural rights (life, liberty, and property) used in the Declaration of Independence?",
          options: [
            "A) John Locke",
            "B) Thomas Hobbes",
            "C) Jean-Jacques Rousseau",
            "D) Baron de Montesquieu"
          ],
          correctIndex: 0,
          explanation: "John Locke's Second Treatise of Government asserted that a government's sole legitimacy rests on protecting citizens' natural rights."
        },
        {
          question: "What was the chief foreign policy objective of the Marshall Plan following World War II?",
          options: [
            "A) Rebuild European economies to defend against Soviet expansion",
            "B) Form a permanent offensive defense pact along eastern state lines",
            "C) Force rapid demilitarization of central European borders",
            "D) Regulate maritime logistics throughout the Mediterranean"
          ],
          correctIndex: 0,
          explanation: "The Marshall Plan stabilized Western European infrastructures, removing the desperate economic conditions that bred communist sentiment."
        },
        {
          question: "Which Roman Emperor issued the Edict of Milan in 313 AD, legalizing Christian practice?",
          options: [
            "A) Constantine the Great",
            "B) Augustus Caesar",
            "C) Marcus Aurelius",
            "D) Diocletian"
          ],
          correctIndex: 0,
          explanation: "Constantine's Edict of Milan ended religious persecution of Christians, paving the way for Christianity to become the empire's state religion."
        },
        {
          question: "In absolute terms, what resource-related crisis resulted in the rapid decline of the French monarchy in the late 1780s?",
          options: [
            "A) Runaway grain prices and acute bread shortages",
            "B) Gold standard inflation inside metropolitan centers",
            "C) Collapse of the colonial fur trade registry",
            "D) Absolute loss of naval wood harvests"
          ],
          correctIndex: 0,
          explanation: "Severe droughts and winter weather led to extreme bread price hikes, inciting massive rural and urban revolutionary mobs."
        },
        {
          question: "What was the strategic objective of the Monroe Doctrine issued by the United States in the year 1823?",
          options: [
            "A) Stop European colonization or interference in the Americas",
            "B) Annex territories of Central America directly",
            "C) Establish regular joint military zones with Imperial Britain",
            "D) Declare total control of Pacific ocean passages"
          ],
          correctIndex: 0,
          explanation: "The doctrine declared that the US would view any European intervention in the Western Hemisphere as a hostile act."
        },
        {
          question: "Which US constitutional amendment, ratified in 1920, guaranteed women the right to vote?",
          options: [
            "A) Nineteenth Amendment",
            "B) Eighteenth Amendment",
            "C) Fourteenth Amendment",
            "D) Fifteenth Amendment"
          ],
          correctIndex: 0,
          explanation: "The 19th amendment prohibited US citizens from being denied the right to vote on account of sex."
        },
        {
          question: "What was a major result of the Peace of Westphalia signed in 1648?",
          options: [
            "A) Formulated the modern principle of territorial state sovereignty",
            "B) United the states of Italy under a single monarchy",
            "C) Banned the practice of Lutheranism across Europe",
            "D) Instigated the Napoleonic code throughout Prussia"
          ],
          correctIndex: 0,
          explanation: "The Peace of Westphalia ended the Thirty Years' War and recognized sovereign equality, creating the modern system of nation-states."
        }
      ],
      LANGUAGE: [
        {
          question: "In Spanish grammar, which verb mood represents desires, doubts, possibilities, or emotional judgments?",
          options: [
            "A) Substantive / Subjunctive (Subjuntivo)",
            "B) Indicative (Indicativo)",
            "C) Imperative (Imperativo)",
            "D) Conditional (Condicional)"
          ],
          correctIndex: 0,
          explanation: "The subjunctive mood describes subjective feelings, uncertainties, and hypothetical outcomes unlike concrete reality."
        },
        {
          question: "Which Latin syntax case relates to the direct object of a sentence?",
          options: [
            "A) Accusative",
            "B) Nominative",
            "C) Genitive",
            "D) Ablative"
          ],
          correctIndex: 0,
          explanation: "In Latin, the direct object of active finite verbs appears inflected in the Accusative case."
        },
        {
          question: "What Spanish verb is used for physical descriptions, careers, origins, and core unchanging identities?",
          options: [
            "A) Ser",
            "B) Estar",
            "C) Haber",
            "D) Hacer"
          ],
          correctIndex: 0,
          explanation: "Spanish differentiates 'state/location' (Estar) from 'long-term identity/characteristic' (Ser)."
        },
        {
          question: "In French verb conjugation, what is the helper verb (auxiliaire) used for the past tense of transition verbs like 'aller', 'venir', and 'partir'?",
          options: [
            "A) Être",
            "B) Avoir",
            "C) Aller",
            "D) Faire"
          ],
          correctIndex: 0,
          explanation: "Motion-related verbs (DR & MRS VANDERTRAMP) use 'être' as their auxiliary verb inside passé composé."
        },
        {
          question: "What is the correct Spanish conjugation of 'decir' in the first-person singular preterite (past tense)?",
          options: [
            "A) Dije",
            "B) Decí",
            "C) Diré",
            "D) Digo"
          ],
          correctIndex: 0,
          explanation: "'Decir' has an irregular preterite stem, conjugating with a strong 'j' as 'dije'."
        }
      ],
      ENGLISH: [
        {
          question: "Identify the critical rhetorical appeal that relies on establishing the speaker's credibility, character, and expertise.",
          options: [
            "A) Ethos",
            "B) Pathos",
            "C) Logos",
            "D) Kairos"
          ],
          correctIndex: 0,
          explanation: "Ethos relies directly on establishing credibility and professional character, making the orator a trusted authority."
        },
        {
          question: "What does the classical literary term 'Dramatic Irony' represent in a narrative play or novel?",
          options: [
            "A) When the audience/reader knows vital plot information that the characters are unaware of",
            "B) When a character expresses the exact physical opposite of their actual feelings",
            "C) When the plot reaches a highly atmospheric, tragic climax with visual weather cue elements",
            "D) When a stage tragedy concludes with an unexpected comical resolution"
          ],
          correctIndex: 0,
          explanation: "Dramatic Irony occurs when readers are aware of critical narrative parameters (e.g. Juliet is merely asleep) while characters remain in panic."
        },
        {
          question: "Which of the following sentences is fully free of comma splices or structural grammar run-ons?",
          options: [
            "A) The gradebook updated at midnight; my aggregate grade stood at an 89.4%.",
            "B) I refreshed Infinite Campus, the system crashed instantly.",
            "C) The final exam was notoriously brutal, I hope standard deviation rounds it up.",
            "D) Practicing active recall has revolutionized my habits, it guarantees passing results."
          ],
          correctIndex: 0,
          explanation: "A semicolon or coordinating conjunction is required to fuse two independent clauses. Combining them with only a comma is a comma splice, a major point casualty!"
        },
        {
          question: "In classical tragic plot structures, what is the definition of 'Hamartia'?",
          options: [
            "A) The fatal flaw or error in judgment that leads to the tragic downfall of a hero.",
            "B) The final resolution and emotional purging of pity and fear (catharsis).",
            "C) An unexpected, sudden reversal of fortune or circumstances.",
            "D) The excessive pride or arrogance that challenges divine authority."
          ],
          correctIndex: 0,
          explanation: "Hamartia refers specifically to a tragic hero's fatal flaw (e.g. Macbeth's ambition) which drives their eventual structural collapse."
        },
        {
          question: "Identify the figure of speech represented in: 'The relentless alarm clock screamed at me to lock in at 6:00 AM.'",
          options: [
            "A) Personification",
            "B) Synecdoche",
            "C) Metonymy",
            "D) Hyperbole"
          ],
          correctIndex: 0,
          explanation: "Giving human qualities, like 'screaming to lock in', to an inanimate object like an alarm clock is classical personification."
        }
      ],
      ARTS: [
        {
          question: "What three critical physical factors constitute the photography Exposure Triangle?",
          options: [
            "A) Aperture, Shutter Speed, and ISO Sensitivity",
            "B) Focal Length, Sensor Format, and Dynamic Range",
            "C) White Balance, Color Hue, and Value Density",
            "D) Rule of Thirds, Golden Ratio, and Leading Focus Lines"
          ],
          correctIndex: 0,
          explanation: "The Exposure Triangle is the foundational pillar of manual camera exposure physics, balancing Aperture (f-stop wide), Shutter Speed (time wide), and ISO (gain sensitivity)."
        },
        {
          question: "Under standard digital camera mechanics, which aperture f-stop value generates the shallowest depth of field (maximum background blur)?",
          options: [
            "A) f/1.8",
            "B) f/8.0",
            "C) f/16.0",
            "D) f/22.0"
          ],
          correctIndex: 0,
          explanation: "A wide open aperture (indicated by a small f-number like f/1.8) limits the depth of the in-focus plane, creating creamy background bokeh."
        },
        {
          question: "If you are shooting fast-moving action in sports or wildlife, which shutter speed setting is optimal to freeze motion cleanly?",
          options: [
            "A) 1/1000 of a second",
            "B) 1/30 of a second",
            "C) 1/2 of a second",
            "D) 4.0 seconds"
          ],
          correctIndex: 0,
          explanation: "Freezing fast motion requires a very short exposure interval. 1/1000s captures split-second states cleanly, whereas slow speeds introduce motion blur."
        },
        {
          question: "In photographic and visual design composition, what does the core 'Rule of Thirds' state?",
          options: [
            "A) Aligning key visual features along a 3x3 imaginary grid's lines and intersections creates balance.",
            "B) Keeping the subject strictly filling middle space representing one-third of the total width.",
            "C) Shooting exactly three exposures of every frame to find the right contrast.",
            "D) Positioning three distinct human figures across different focus depths."
          ],
          correctIndex: 0,
          explanation: "The Rule of Thirds suggests placing focal points on grid lines or intersections to lead the eye naturally and avoid static dead-center compositions."
        },
        {
          question: "What physical artifact is introduced to digital image frames when you abnormally increase your camera sensor's ISO setting to 6400 or higher?",
          options: [
            "A) High levels of digital noise and color grain throughout the shadows",
            "B) Physical lengthening of the lens focal compression ratio",
            "C) Immediate lock-up of the mechanical shutter leaves",
            "D) Absolute collapse of the available depth of field"
          ],
          correctIndex: 0,
          explanation: "ISO increases sensor gain. Amplifying low-light current signal also exaggerates random sensor noise, bringing noticeable color grain artifacts into the final print."
        },
        {
          question: "Which classical lighting setup positions the primary light source at 45 degrees, creating a signature small triangle of light on the shadowed cheek?",
          options: [
            "A) Rembrandt Lighting",
            "B) Butterfly Lighting",
            "C) Split Profile Lighting",
            "D) Rim Silhouette Lighting"
          ],
          correctIndex: 0,
          explanation: "Named after European painter Rembrandt, this dramatic setup sculpts facial assets beautifully while illuminating a small skin patch under the shadowed eye."
        },
        {
          question: "In standard photography optics, what is the primary consequence of using a longer focal length lens (e.g. zooming from 24mm to 200mm)?",
          options: [
            "A) Angle of view narrows, and physical background compression increases",
            "B) Angle of view opens up, making wide environments fit easily",
            "C) Light entry rates increase, boosting direct exposure speed",
            "D) Lens distortion stretches the edges of the image dramatically"
          ],
          correctIndex: 0,
          explanation: "Telephoto focal lengths (like 200mm) narrow the visual slice and compress distance perspective, making background features appear much larger and closer to the foreground."
        }
      ],
      ELECTIVES: [
        {
          question: "What is the worst-case runtime time complexity, in Big O notation, of locating a target item inside a sorted array of size n using Binary Search?",
          options: [
            "A) O(log n)",
            "B) O(n)",
            "C) O(n log n)",
            "D) O(1)"
          ],
          correctIndex: 0,
          explanation: "Since Binary Search recursively cuts the remaining search window in half, it requires at most log₂ n steps, completing O(log n) calculations! Pure efficiency."
        },
        {
          question: "In structural programming languages like Java or C++, what system error occurs when a recursive function executes indefinitely without checking a base case?",
          options: [
            "A) Stack Overflow Error",
            "B) Heap Out of Memory Exception",
            "C) Arithmetic Division by Zero Error",
            "D) Concurrent Modification Exception"
          ],
          correctIndex: 0,
          explanation: "Each nested subroutine call instantiates a memory frame on the thread's execution stack. Unbounded recursion exhausts stack memory limits, causing a Stack Overflow crash!"
        },
        {
          question: "Which foundational computer data structure manages elements using a 'First-In, First-Out' (FIFO) transaction queue?",
          options: [
            "A) Queue",
            "B) Stack (LIFO)",
            "C) Binary Sort Tree",
            "D) Hash Map Dictionary"
          ],
          correctIndex: 0,
          explanation: "A Queue works like a real-world checkout line: the first object entering the queue is the first object processed and removed (FIFO)."
        },
        {
          question: "What is the primary function of a database 'Primary Key' constraint?",
          options: [
            "A) Uniquely identifying every individual record/row inside a database table",
            "B) Formatting table characters into compressed, searchable index files",
            "C) Establishing a direct join relationship to another secure admin table",
            "D) Restricting access write privileges to verified user profiles"
          ],
          correctIndex: 0,
          explanation: "A Primary Key enforces strict uniqueness regulations, preventing multiple rows from sharing duplicate identifiers."
        }
      ],
      GENERAL: [
        {
          question: "What process describes the systematic formulation, testing, and modification of structural scientific models?",
          options: [
            "A) Scientific Method",
            "B) Dialectical Logic",
            "C) Cognitive Dissonance Analysis",
            "D) Heuristic Evaluation"
          ],
          correctIndex: 0,
          explanation: "The scientific method iterates hypothesis creation, objective empirical testing, and refinement of model frameworks."
        },
        {
          question: "What error occurs when a researcher misinterprets a relative correlation as a clear causal mechanism?",
          options: [
            "A) Post hoc / Correlation-causation fallacy",
            "B) Strawman bias",
            "C) Circular logic",
            "D) Confirmation fallacy"
          ],
          correctIndex: 0,
          explanation: "Correlation measures simple associative pattern trends; a causal mechanism requires proving a direct variable-to-variable vector."
        },
        {
          question: "What does a double-blind trial prevent in empirical scientific tests?",
          options: [
            "A) Investigator and subject bias",
            "B) Outlier hardware data drops",
            "C) High standard deviation in math calculations",
            "D) Loss of sample size"
          ],
          correctIndex: 0,
          explanation: "Keeping both investigator and subject unaware of treatment distribution ensures total objective analysis without conscious or unconscious placebo effects."
        }
      ]
    };

    const templates = academicPools[deducedDept] || academicPools.GENERAL;

    // If we have a substantial number of questions already, just return them.
    // This preserves the pristine quality of Gemini-generated customized questions without injecting unrelated items or repeats.
    if (originalQuestions.length >= 10) {
      return originalQuestions;
    }

    // For very small fallback lists (offline presets), pad with unique academic templates, checking for exact duplicates
    for (const template of templates) {
      if (originalQuestions.length >= 25) {
        break;
      }

      const isDuplicate = originalQuestions.some(
        (q) => q.question.toLowerCase() === template.question.toLowerCase()
      );

      if (!isDuplicate) {
        originalQuestions.push({
          question: template.question,
          options: [...template.options],
          correctIndex: template.correctIndex,
          explanation: template.explanation
        });
      }
    }

    return originalQuestions;
  }, [deck.quiz, deck.courseCode, deck.courseName]);

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<number[]>([]);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // GPA Battle Royale states
  const [lifelines, setLifelines] = useState({
    sahurAlarm: 1, // Auto-answers current question correctly with iron pan slap
    sussyRadar: 2, // Eliminates 2 incorrect options
    epsteinLeak: 1, // Leaks explanation diagnostic early
    tsCrowd: 2,    // Polling simulation
  });
  const [eliminatedOptions, setEliminatedOptions] = useState<{ [key: number]: number[] }>({});
  const [crowdPollResult, setCrowdPollResult] = useState<{ [key: number]: { [optIdx: number]: number } }>({});
  const [showSahurOverlay, setShowSahurOverlay] = useState(false);
  const [sahurMessages, setSahurMessages] = useState<string[]>([]);
  const [viewedQuestionIndex, setViewedQuestionIndex] = useState(0);

  // Custom Matching states to enable the ultimate matching survivor mode
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [matchingAnswers, setMatchingAnswers] = useState<{ [qIdx: number]: string }>({});
  const [focusedRowIdx, setFocusedRowIdx] = useState<number | null>(null);
  const [matchingSearchQuery, setMatchingSearchQuery] = useState("");
  const [wrongAttemptAnswer, setWrongAttemptAnswer] = useState<string | null>(null);

  // States for AI questions generation
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [generatorError, setGeneratorError] = useState<string | null>(null);

  // States for PDF Export
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [includeKeyInPdf, setIncludeKeyInPdf] = useState(true);
  const [includeBubbleInPdf, setIncludeBubbleInPdf] = useState(true);
  const [includeExplanationsInPdf, setIncludeExplanationsInPdf] = useState(true);
  const [pdfExportSuccess, setPdfExportSuccess] = useState(false);

  const handleExportPdf = () => {
    setIsExportingPdf(true);
    try {
      downloadMockExamPdf(deck, organizedQuiz, {
        includeAnswerKey: includeKeyInPdf,
        includeBubbleSheet: includeBubbleInPdf,
        includeExplanations: includeExplanationsInPdf,
      });
      setPdfExportSuccess(true);
      setTimeout(() => setPdfExportSuccess(false), 3500);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleGenerateMoreQuestions = async () => {
    setIsGeneratingMore(true);
    setGeneratorError(null);
    try {
      const response = await fetch("/api/generate-more-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseCode: deck.courseCode,
          courseName: deck.courseName,
          existingQuestions: deck.quiz || [],
        }),
      });

      if (!response.ok) {
        throw new Error("AI question server responded with an error.");
      }

      const data = await response.json();
      if (!data.quiz || !Array.isArray(data.quiz) || data.quiz.length === 0) {
        throw new Error("No additional questions were generated.");
      }

      const updatedQuiz = [...(deck.quiz || []), ...data.quiz];
      const updatedDeck = {
        ...deck,
        quiz: updatedQuiz,
      };

      if (onUpdateDeck) {
        onUpdateDeck(updatedDeck);
      }

      // Switch to the first newly added question
      const startOfNewQuestions = (deck.quiz || []).length;
      const newSectionIndex = Math.floor(startOfNewQuestions / 10);
      
      setMatchingAnswers({});
      setQuizAnswers({});
      setCurrentSectionIndex(newSectionIndex);
      setFocusedRowIdx(startOfNewQuestions);
      setSubmittedQuiz(false);
      setQuizScore(0);
      setEliminatedOptions({});
      setCrowdPollResult({});
      setViewedQuestionIndex(startOfNewQuestions);
      setWrongAttemptAnswer(null);
    } catch (err: any) {
      console.error("More questions error:", err);
      setGeneratorError(err.message || "Failed to contact academic oracle. Please try again!");
    } finally {
      setIsGeneratingMore(false);
    }
  };

  const handleSetSectionIndex = (secIdx: number) => {
    setCurrentSectionIndex(secIdx);
    const start = secIdx * 10;
    const end = Math.min((secIdx + 1) * 10, organizedQuiz.length);
    let firstUnmatched = start;
    for (let i = start; i < end; i++) {
      if (!matchingAnswers[i]) {
        firstUnmatched = i;
        break;
      }
    }
    setFocusedRowIdx(firstUnmatched);
    setWrongAttemptAnswer(null);
    setMatchingSearchQuery("");
  };

  const toggleMastered = (index: number) => {
    if (masteredCards.includes(index)) {
      setMasteredCards(masteredCards.filter((i) => i !== index));
    } else {
      setMasteredCards([...masteredCards, index]);
    }
  };

  const handleQuizAnswer = (questionIndex: number, optionIndex: number) => {
    if (submittedQuiz) return;
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: optionIndex,
    });
  };

  const submitQuiz = () => {
    let score = 0;
    organizedQuiz.forEach((q, idx) => {
      const userMatched = matchingAnswers[idx];
      const correctVal = q.options[q.correctIndex];
      if (userMatched === correctVal) {
        score++;
      }
    });
    setQuizScore(score);
    setSubmittedQuiz(true);
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setMatchingAnswers({});
    setFocusedRowIdx(null);
    setCurrentSectionIndex(0);
    setMatchingSearchQuery("");
    setWrongAttemptAnswer(null);
    setSubmittedQuiz(false);
    setQuizScore(0);
    setEliminatedOptions({});
    setCrowdPollResult({});
    setViewedQuestionIndex(0);
    setLifelines({
      sahurAlarm: 1,
      sussyRadar: 2,
      epsteinLeak: 1,
      tsCrowd: 2,
    });
  };

  // Centralized, unified live brain-state cognitive measurement
  const calculatedMemoryPct = React.useMemo(() => {
    const totalMatchItems = Object.keys(matchingAnswers).length;
    let correctCount = 0;
    organizedQuiz.forEach((q, idx) => {
      if (matchingAnswers[idx] === q.options[q.correctIndex]) {
        correctCount++;
      }
    });

    const baseContribution = 50 + ((masteredCards.length / (flashcards.length || 1)) * 20);
    const evaluationContribution = submittedQuiz 
      ? ((correctCount / organizedQuiz.length) * 30) 
      : ((totalMatchItems / organizedQuiz.length) * 15);
    return Math.round(Math.min(100, baseContribution + evaluationContribution));
  }, [matchingAnswers, masteredCards.length, flashcards.length, submittedQuiz, organizedQuiz]);

  const activeMatchingIdx = React.useMemo(() => {
    return (focusedRowIdx !== null && focusedRowIdx >= currentSectionIndex * 10 && focusedRowIdx < (currentSectionIndex + 1) * 10)
      ? focusedRowIdx
      : (currentSectionIndex * 10);
  }, [focusedRowIdx, currentSectionIndex]);

  // Lifeline Actions
  const useSahurAlarm = (qIdx: number) => {
    if (lifelines.sahurAlarm <= 0 || submittedQuiz) return;
    const correctIdx = organizedQuiz[qIdx].correctIndex;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: correctIdx }));
    setLifelines(prev => ({ ...prev, sahurAlarm: prev.sahurAlarm - 1 }));
    setSahurMessages([
      "TUNG TUNG TUNG SAHUR! Waku up your grades!",
      "An iron pan clang echoes through the classroom!",
      `Question ${qIdx + 1} automatically locked to correct answer: Option ${String.fromCharCode(65 + correctIdx)}!`
    ]);
    setShowSahurOverlay(true);
    setTimeout(() => {
      setShowSahurOverlay(false);
    }, 2200);
  };

  const useSussyRadar = (qIdx: number) => {
    if (lifelines.sussyRadar <= 0 || submittedQuiz) return;
    const q = organizedQuiz[qIdx];
    const incorrectIndices: number[] = [];
    q.options.forEach((_, idx) => {
      if (idx !== q.correctIndex) incorrectIndices.push(idx);
    });
    // Randomly select 2 of them to eliminate
    const shuffledIdxs = [...incorrectIndices].sort(() => 0.5 - Math.random());
    const eliminated = shuffledIdxs.slice(0, 2);
    setEliminatedOptions(prev => ({ ...prev, [qIdx]: eliminated }));
    setLifelines(prev => ({ ...prev, sussyRadar: prev.sussyRadar - 1 }));
  };

  const useEpsteinLeak = (qIdx: number) => {
    if (lifelines.epsteinLeak <= 0 || submittedQuiz) return;
    setLifelines(prev => ({ ...prev, epsteinLeak: prev.epsteinLeak - 1 }));
    setEliminatedOptions(prev => ({ ...prev, [`leak_${qIdx}` as any]: [1] })); // marker to reveal explanation
  };

  const useTsCrowd = (qIdx: number) => {
    if (lifelines.tsCrowd <= 0 || submittedQuiz) return;
    const q = organizedQuiz[qIdx];
    const scores: { [key: number]: number } = {};
    const correctIdx = q.correctIndex;
    
    // Distribute 100% with the majority going to the correct option
    let remaining = 100;
    const correctPercent = Math.floor(Math.random() * 21) + 60; // 60% to 80% correct
    scores[correctIdx] = correctPercent;
    remaining -= correctPercent;

    const incorrectIndices = [0, 1, 2, 3].filter(i => i !== correctIdx);
    const p1 = Math.floor(Math.random() * (remaining - 5));
    scores[incorrectIndices[0]] = p1;
    remaining -= p1;

    const p2 = Math.floor(Math.random() * (remaining - 2));
    scores[incorrectIndices[1]] = p2;
    scores[incorrectIndices[2]] = remaining - p2;

    setCrowdPollResult(prev => ({ ...prev, [qIdx]: scores }));
    setLifelines(prev => ({ ...prev, tsCrowd: prev.tsCrowd - 1 }));
  };

  // Custom Matching Helper Methods
  const placeMatchingAnswer = (qIdx: number, answerText: string) => {
    if (submittedQuiz) return;
    const updated = { ...matchingAnswers };
    // Maintain 1-to-1 matching: if this answer was already matched to a different question, remove it first
    for (const key in updated) {
      if (updated[key] === answerText) {
        delete updated[Number(key)];
      }
    }
    updated[qIdx] = answerText;
    setMatchingAnswers(updated);
  };

  const clearMatchingAnswer = (qIdx: number) => {
    if (submittedQuiz) return;
    const updated = { ...matchingAnswers };
    delete updated[qIdx];
    setMatchingAnswers(updated);
  };

  const findMatchedRowForAnswer = (answerText: string) => {
    const startIdx = currentSectionIndex * 10;
    const endIdx = Math.min((currentSectionIndex + 1) * 10, organizedQuiz.length);
    for (let i = startIdx; i < endIdx; i++) {
      if (matchingAnswers[i] === answerText) {
        return i; // Absolute row index
      }
    }
    return null;
  };

  const handleSelectCard = (answerText: string) => {
    let targetIdx = focusedRowIdx;
    const startIdx = currentSectionIndex * 10;
    const endIdx = Math.min((currentSectionIndex + 1) * 10, organizedQuiz.length);
    
    if (targetIdx === null) {
      // Find the first unmatched row in the current section
      for (let i = startIdx; i < endIdx; i++) {
        if (!matchingAnswers[i]) {
          targetIdx = i;
          break;
        }
      }
    }
    
    if (targetIdx === null) {
      targetIdx = startIdx;
    }
    
    // Immediate verification check
    const activeQuestion = organizedQuiz[targetIdx];
    if (!activeQuestion) return;
    const correctAnsText = activeQuestion.options[activeQuestion.correctIndex];
    
    if (answerText === correctAnsText) {
      // CORRECT MATCH
      setWrongAttemptAnswer(null);
      placeMatchingAnswer(targetIdx, answerText);
      setMatchingSearchQuery(""); // Auto clear search query after successful snap
      
      // Find absolute next empty index in the current 10-item section
      let nextEmptyIdx = null;
      for (let i = targetIdx + 1; i < endIdx; i++) {
        if (!matchingAnswers[i]) {
          nextEmptyIdx = i;
          break;
        }
      }
      if (nextEmptyIdx === null) {
        for (let i = startIdx; i < targetIdx; i++) {
          if (!matchingAnswers[i]) {
            nextEmptyIdx = i;
            break;
          }
        }
      }
      
      if (nextEmptyIdx !== null) {
        setFocusedRowIdx(nextEmptyIdx);
      } else {
        // All matched in this section! Auto-advance to the next section if available
        if (currentSectionIndex < Math.ceil(organizedQuiz.length / 10) - 1) {
          const nextSecIdx = currentSectionIndex + 1;
          setCurrentSectionIndex(nextSecIdx);
          
          const startOfNext = nextSecIdx * 10;
          const endOfNext = Math.min((nextSecIdx + 1) * 10, organizedQuiz.length);
          let targetForNext = startOfNext;
          for (let j = startOfNext; j < endOfNext; j++) {
            if (!matchingAnswers[j]) {
              targetForNext = j;
              break;
            }
          }
          setFocusedRowIdx(targetForNext);
        } else {
          // Keep focused at the current row
          setFocusedRowIdx(targetIdx);
        }
      }
    } else {
      // INCORRECT MATCH - DO NOT MOVE ON. User must get it correct first!
      setWrongAttemptAnswer(answerText);
    }
  };

  const scrambledSectionOptions = React.useMemo(() => {
    const startIdx = currentSectionIndex * 10;
    const endIdx = Math.min((currentSectionIndex + 1) * 10, organizedQuiz.length);
    const correctOptions: string[] = [];
    for (let i = startIdx; i < endIdx; i++) {
      if (organizedQuiz[i]) {
        correctOptions.push(organizedQuiz[i].options[organizedQuiz[i].correctIndex]);
      }
    }
    // Sorting reverse alphabetically keeps option elements shuffled relative to original question indices and highly stable
    return [...correctOptions].sort((a, b) => b.localeCompare(a));
  }, [currentSectionIndex, organizedQuiz]);

  const useSahurAlarmMatching = (qIdx: number) => {
    if (lifelines.sahurAlarm <= 0 || submittedQuiz) return;
    const q = organizedQuiz[qIdx];
    if (!q) return;
    const correctAnsText = q.options[q.correctIndex];
    placeMatchingAnswer(qIdx, correctAnsText);
    setLifelines(prev => ({ ...prev, sahurAlarm: prev.sahurAlarm - 1 }));
    setSahurMessages([
      "TUNG TUNG TUNG SAHUR! Wake up your grades!",
      "An iron pan clang echoes through the classroom!",
      `Row ${qIdx + 1} automatically locked to its correct visual matching card!`
    ]);
    setShowSahurOverlay(true);
    setTimeout(() => {
      setShowSahurOverlay(false);
    }, 2200);
  };

  const useSussyRadarMatching = (qIdx: number) => {
    if (lifelines.sussyRadar <= 0 || submittedQuiz) return;
    const q = organizedQuiz[qIdx];
    if (!q) return;
    
    // Find incorrect options in the active matching section
    const startIdx = currentSectionIndex * 10;
    const endIdx = Math.min((currentSectionIndex + 1) * 10, organizedQuiz.length);
    const incorrectAnswers: string[] = [];
    for (let i = startIdx; i < endIdx; i++) {
      if (organizedQuiz[i] && i !== qIdx) {
        incorrectAnswers.push(organizedQuiz[i].options[organizedQuiz[i].correctIndex]);
      }
    }
    
    // Scramble and select up to 2 wrong matches to eliminate / cross out
    const eliminated = [...incorrectAnswers].sort(() => 0.5 - Math.random()).slice(0, 2);
    setEliminatedOptions(prev => ({ ...prev, [qIdx]: eliminated as any }));
    setLifelines(prev => ({ ...prev, sussyRadar: prev.sussyRadar - 1 }));
  };

  const useEpsteinLeakMatching = (qIdx: number) => {
    if (lifelines.epsteinLeak <= 0 || submittedQuiz) return;
    setEliminatedOptions(prev => ({ ...prev, [`leak_${qIdx}` as any]: [1] }));
    setLifelines(prev => ({ ...prev, epsteinLeak: prev.epsteinLeak - 1 }));
  };

  const useTsCrowdMatching = (qIdx: number) => {
    if (lifelines.tsCrowd <= 0 || submittedQuiz) return;
    const q = organizedQuiz[qIdx];
    if (!q) return;
    const correctAnsText = q.options[q.correctIndex];
    
    // Distribute percentages among all matching answers in this 10-item section
    const startIdx = currentSectionIndex * 10;
    const endIdx = Math.min((currentSectionIndex + 1) * 10, organizedQuiz.length);
    const sectionAnswers: string[] = [];
    for (let i = startIdx; i < endIdx; i++) {
      if (organizedQuiz[i]) {
        sectionAnswers.push(organizedQuiz[i].options[organizedQuiz[i].correctIndex]);
      }
    }

    const pollResult: { [optText: string]: number } = {};
    let remaining = 100;
    
    // Correct gets a major vote
    const correctPercent = Math.floor(Math.random() * 20) + 65; // 65% to 85%
    pollResult[correctAnsText] = correctPercent;
    remaining -= correctPercent;

    const remainingChoices = sectionAnswers.filter(ans => ans !== correctAnsText);
    remainingChoices.forEach((ans, idx) => {
      const isLast = idx === remainingChoices.length - 1;
      if (isLast) {
        pollResult[ans] = remaining;
      } else {
        const pct = Math.floor(Math.random() * (remaining / 1.5));
        pollResult[ans] = pct;
        remaining -= pct;
      }
    });

    setCrowdPollResult(prev => ({ ...prev, [qIdx]: pollResult as any }));
    setLifelines(prev => ({ ...prev, tsCrowd: prev.tsCrowd - 1 }));
  };

  // Ultra-robust LaTeX symbol compiler to turn unreadable maths into beautifully formatted plain text unicode
  const cleanMathFormula = (text: string): string => {
    if (!text) return "";
    let cleaned = text;

    // Convert LaTeX commands and text containers
    cleaned = cleaned.replace(/\\text\s*\{(.*?)\}/g, '$1');
    cleaned = cleaned.replace(/\\mathrm\s*\{(.*?)\}/g, '$1');
    
    // Multi-step recursively resolve division fractions so they render beautifully
    for (let i = 0; i < 4; i++) {
      cleaned = cleaned.replace(/\\frac\s*\{(.*?)\}\s*\{(.*?)\}/g, '($1) / ($2)');
    }
    
    // Multi-step recursively resolve square roots
    for (let i = 0; i < 4; i++) {
      cleaned = cleaned.replace(/\\sqrt\s*\{(.*?)\}/g, '√($1)');
    }
    cleaned = cleaned.replace(/\\sqrt\s*([0-9a-zA-Z]+)/g, '√($1)');
    cleaned = cleaned.replace(/\\frac\s*([0-9a-zA-Z]+)\s*([0-9a-zA-Z]+)/g, '($1) / ($2)');

    // Overbars and hats
    cleaned = cleaned.replace(/\\bar\s*\{x\}/gi, 'x̅');
    cleaned = cleaned.replace(/\\bar\s*x/gi, 'x̅');
    cleaned = cleaned.replace(/\\bar\s*\{(.*?)\}/gi, '$1̅');
    
    cleaned = cleaned.replace(/\\hat\s*\{p\}/gi, 'p̂');
    cleaned = cleaned.replace(/\\hat\s*p/gi, 'p̂');
    cleaned = cleaned.replace(/\\hat\s*\{(.*?)\}/gi, '$1̂');

    // Subscripts & Superscripts (Decoded to beautiful unicode)
    // 1. Resolve latex exponent groups e.g. ^{t-1} or ^{2}
    cleaned = cleaned.replace(/\^\{([0-9nxy\+\-i\s]+)\}/g, (match, p1) => {
      const supers: Record<string, string> = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
        'n': 'ⁿ', 'x': 'ˣ', 'y': 'ʸ', 'i': 'ⁱ', '+': '⁺', '-': '⁻'
      };
      return p1.split('').map((char: string) => supers[char] || char).join('');
    });

    // 2. Resolve direct exponents e.g. x^2, e^x
    cleaned = cleaned.replace(/\^([0-9nxy\+\-i])/g, (match, p1) => {
      const supers: Record<string, string> = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
        'n': 'ⁿ', 'x': 'ˣ', 'y': 'ʸ', 'i': 'ⁱ', '+': '⁺', '-': '⁻'
      };
      return supers[p1] || `^${p1}`;
    });

    // 3. Resolve latex subscripts e.g. _{H2O} or _{0}
    cleaned = cleaned.replace(/_\{([0-9a-zA-Z\+\-\s]+)\}/g, (match, p1) => {
      const subs: Record<string, string> = {
        '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
        '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
        'a': 'ₐ', 'e': 'ₑ', 'o': 'ₒ', 'x': 'ₓ', 'y': 'ᵧ',
        'p': 'ₚ', 'i': 'ᵢ', '+': '₊', '-': '₋'
      };
      return p1.split('').map((char: string) => subs[char.toLowerCase()] || char).join('');
    });

    // 4. Resolve direct subscripts e.g. H_2_O -> H₂O
    cleaned = cleaned.replace(/_([0-9oaxypi\+\-])/gi, (match, p1) => {
      const subs: Record<string, string> = {
        '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
        '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
        'a': 'ₐ', 'e': 'ₑ', 'o': 'ₒ', 'x': 'ₓ', 'y': 'ᵧ',
        'p': 'ₚ', 'i': 'ᵢ', '+': '₊', '-': '₋'
      };
      return subs[p1.toLowerCase()] || `_${p1}`;
    });

    // Standard stats specific setups
    cleaned = cleaned.replace(/_\{?\\bar\{x\}\}?/gi, '₍x̅₎');
    cleaned = cleaned.replace(/_\{?\\hat\{p\}\}?/gi, '₍p̂₎');
    cleaned = cleaned.replace(/_\{?([a-zA-Z0-9\xb5-\u221e]+)\}?/gi, '_$1');

    // Greek symbols and statistics codes
    cleaned = cleaned.replace(/\\pm/gi, '±');
    cleaned = cleaned.replace(/\\times/gi, '×');
    cleaned = cleaned.replace(/\\cdot/gi, '·');
    cleaned = cleaned.replace(/\\mu_0/gi, 'μ0');
    cleaned = cleaned.replace(/\\mu/gi, 'μ');
    cleaned = cleaned.replace(/\\sigma/gi, 'σ');
    cleaned = cleaned.replace(/\\alpha/gi, 'α');
    cleaned = cleaned.replace(/\\beta/gi, 'β');
    cleaned = cleaned.replace(/\\theta/gi, 'θ');
    cleaned = cleaned.replace(/\\Delta/gi, 'Δ');
    cleaned = cleaned.replace(/\\lambda/gi, 'λ');
    cleaned = cleaned.replace(/\\pi/gi, 'π');
    cleaned = cleaned.replace(/\\le\s+/gi, '≤ ');
    cleaned = cleaned.replace(/\\ge\s+/gi, '≥ ');
    cleaned = cleaned.replace(/\\le/gi, '≤');
    cleaned = cleaned.replace(/\\ge/gi, '≥');
    cleaned = cleaned.replace(/\\approx/gi, '≈');
    cleaned = cleaned.replace(/\\neq/gi, '≠');

    // Remove remaining backslashes
    cleaned = cleaned.replace(/\\/g, '');

    // Strip single or double math dollars
    cleaned = cleaned.replace(/\$\$/g, '');
    cleaned = cleaned.replace(/\$/g, '');

    return cleaned;
  };

  // Split questions and answers into matching red and blue text sections
  const splitQuestionIntoMatchingSections = (questionText: string) => {
    const cleaned = cleanMathFormula(questionText);
    
    // Split on first comma, question mark, or colon if exists, otherwise split in half
    let splitIndex = -1;
    const delimiters = ["?", ",", ":", ";"];
    for (const d of delimiters) {
      const idx = cleaned.indexOf(d);
      if (idx !== -1 && (splitIndex === -1 || idx < splitIndex)) {
        splitIndex = idx + 1; // include the delimiter in the first part
      }
    }

    if (splitIndex !== -1 && splitIndex > 10 && splitIndex < cleaned.length - 10) {
      const part1 = cleaned.substring(0, splitIndex).trim();
      const part2 = cleaned.substring(splitIndex).trim();
      return { part1, part2 };
    }

    const words = cleaned.split(" ");
    if (words.length <= 4) {
      return { part1: cleaned, part2: "" };
    }
    const mid = Math.ceil(words.length / 2);
    const part1 = words.slice(0, mid).join(" ");
    const part2 = words.slice(mid).join(" ");
    return { part1, part2 };
  };

  const splitOptionIntoMatchingSections = (optionText: string) => {
    const cleaned = cleanMathFormula(optionText);
    const prefixMatch = cleaned.match(/^([A-D]\))\s*(.*)/);
    if (prefixMatch) {
      const prefix = prefixMatch[1];
      const rest = prefixMatch[2];
      
      const words = rest.split(" ");
      if (words.length <= 2) {
        return { prefix, part1: rest, part2: "" };
      }
      const mid = Math.ceil(words.length / 2);
      const part1 = words.slice(0, mid).join(" ");
      const part2 = words.slice(mid).join(" ");
      return { prefix, part1, part2 };
    }
    
    const words = cleaned.split(" ");
    if (words.length <= 2) {
      return { prefix: "", part1: cleaned, part2: "" };
    }
    const mid = Math.ceil(words.length / 2);
    const part1 = words.slice(0, mid).join(" ");
    const part2 = words.slice(mid).join(" ");
    return { prefix: "", part1, part2 };
  };

  // Simple Markdown-to-HTML formatter for cheat sheets to avoid react-markdown issues
  const renderCheatSheetHTML = (markdown: string) => {
    if (!markdown) return null;
    
    const lines = markdown.split("\n");
    return lines.map((line, index) => {
      const trimmed = cleanMathFormula(line.trim());
      
      // Headers
      if (trimmed.startsWith("###")) {
        return (
          <h4 key={index} className="text-md font-sans font-bold text-blue-900 mt-5 border-b pb-1">
            {trimmed.replace(/^###\s*/, "")}
          </h4>
        );
      }
      if (trimmed.startsWith("##")) {
        return (
          <h3 key={index} className="text-lg font-sans font-bold text-indigo-950 mt-6 border-b-2 pb-1.5">
            {trimmed.replace(/^##\s*/, "")}
          </h3>
        );
      }
      if (trimmed.startsWith("#")) {
        return (
          <h2 key={index} className="text-xl font-sans font-extrabold text-blue-950 mt-8 mb-3">
            {trimmed.replace(/^#\s*/, "")}
          </h2>
        );
      }

      // Blockquotes
      if (trimmed.startsWith(">")) {
        return (
          <blockquote key={index} className="border-l-4 border-blue-600 bg-blue-50/50 italic px-4 py-3 my-4 rounded-r-lg text-sm text-blue-900 leading-relaxed font-serif">
            {trimmed.replace(/^>\s*/, "")}
          </blockquote>
        );
      }

      // Bullet points
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        // Simple bold within bullets
        const text = trimmed.replace(/^[-*]\s*/, "");
        return (
          <ul key={index} className="list-disc pl-6 space-y-1 my-1">
            <li className="text-sm text-gray-700 leading-relaxed">
              {parseBoldText(text)}
            </li>
          </ul>
        );
      }

      // Empty spaces
      if (!trimmed) {
        return <div key={index} className="h-2"></div>;
      }

      // standard paragraphs or elements
      return (
        <p key={index} className="text-sm text-gray-700 leading-relaxed my-2">
          {parseBoldText(trimmed)}
        </p>
      );
    });
  };

  const parseBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-bold text-gray-950">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-6">
      {/* Back to Launcher Button and Simple Meta */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition cursor-pointer max-w-max"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Prep Launcher</span>
        </button>

        <div className="text-xs text-slate-500 font-mono">
          School: <span className="font-semibold text-indigo-700">{deck.schoolName || "Infinite Campus High"}</span> &nbsp;&bull;&nbsp; Course: <span className="font-semibold text-slate-800">{deck.courseCode}</span>
        </div>
      </div>

      {/* Main Study Deck Dashboard Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-950 to-slate-900 p-6 md:p-8 text-white relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-bold px-2.5 py-1 rounded-full uppercase tracking-widest font-mono">
                {deck.courseCode} Final Study Deck
              </span>
              <h1 id="study-deck-title" className="text-2xl md:text-3xl font-sans tracking-tight font-extrabold mt-2 text-blue-50">
                {cleanMathFormula(deck.summary?.title || "Course Final Study Companion")}
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-2">
                Generated from study notes &bull; {new Date(deck.timestamp).toLocaleDateString()}
              </p>
            </div>
            {deck.additionalNotes && (
              <div className="bg-blue-900/40 border border-blue-800/40 p-3 rounded-xl max-w-xs text-xs text-blue-100 leading-relaxed">
                <span className="font-bold text-indigo-300">Custom Emphasis:</span> {deck.additionalNotes}
              </div>
            )}
          </div>
        </div>

        {/* Custom Tab Bar */}
        <div className="bg-slate-950 border-b border-slate-800 flex overflow-x-auto divide-x divide-slate-850">
          <button
            id="tab-btn-summary"
            onClick={() => setActiveTab("summary")}
            className={`flex items-center space-x-2 px-6 py-4.5 text-xs font-bold font-mono uppercase tracking-wider transition-all relative shrink-0 focus:outline-none cursor-pointer ${
              activeTab === "summary"
                ? "bg-slate-900/90 text-indigo-400 border-t-2 border-t-indigo-500 font-black shadow-[inset_0_1px_15px_rgba(99,102,241,0.1)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <FileText className="h-4 w-4 text-indigo-450" />
            <span>Diagnostic Hub</span>
          </button>

          <button
            id="tab-btn-timeline"
            onClick={() => setActiveTab("timeline")}
            className={`flex items-center space-x-2 px-6 py-4.5 text-xs font-bold font-mono uppercase tracking-wider transition-all relative shrink-0 focus:outline-none cursor-pointer ${
              activeTab === "timeline"
                ? "bg-slate-900/90 text-indigo-400 border-t-2 border-t-indigo-500 font-black shadow-[inset_0_1px_15px_rgba(99,102,241,0.1)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <Calendar className="h-4 w-4 text-indigo-450" />
            <span>5-Day Countdown</span>
          </button>

          <button
            id="tab-btn-flashcards"
            onClick={() => setActiveTab("flashcards")}
            className={`flex items-center space-x-2 px-6 py-4.5 text-xs font-bold font-mono uppercase tracking-wider transition-all relative shrink-0 focus:outline-none cursor-pointer ${
              activeTab === "flashcards"
                ? "bg-slate-900/90 text-indigo-400 border-t-2 border-t-indigo-500 font-black shadow-[inset_0_1px_15px_rgba(99,102,241,0.1)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <Layers className="h-4 w-4 text-indigo-450" />
            <span>Active Recall Cards ({flashcards.length})</span>
          </button>

          <button
            id="tab-btn-quiz"
            onClick={() => setActiveTab("quiz")}
            className={`flex items-center space-x-2 px-6 py-4.5 text-xs font-bold font-mono uppercase tracking-wider transition-all relative shrink-0 focus:outline-none cursor-pointer ${
              activeTab === "quiz"
                ? "bg-slate-900/90 text-indigo-400 border-t-2 border-t-indigo-500 font-black shadow-[inset_0_1px_15px_rgba(99,102,241,0.1)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <CheckSquare className="h-4 w-4 text-indigo-450" />
            <span>Mock Final Exam ({organizedQuiz.length})</span>
          </button>

          {/* Quick PDF Exam Export Action Button in Tab Bar */}
          <div className="ml-auto flex items-center pr-4 py-2 shrink-0">
            <button
              type="button"
              id="btn-quick-export-pdf"
              onClick={() => setShowPdfModal(true)}
              className="inline-flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white rounded-xl text-xs font-mono font-black uppercase tracking-wider transition cursor-pointer shadow-md shadow-indigo-900/20 active:scale-95 border border-white/10"
              title="Export Full Mock Final Exam as Standardized PDF Document"
            >
              <FileDown className="h-4 w-4 text-amber-300" />
              <span>Export Exam (PDF) &bull; {organizedQuiz.length}Q</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8">
          
          {/* Scientific Memory & Final Score Retention Multiplier Panel */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 border-2 border-slate-850 rounded-3xl p-5 md:p-6 mb-8 text-white relative shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl text-left">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-extrabold text-[10px] tracking-widest font-mono rounded-lg uppercase">
                  <span>🧬</span>
                  <span>Empirically Backed Cognitive Optimization Active</span>
                </div>
                <h3 className="text-lg md:text-xl font-sans font-black tracking-tight text-white">
                  Scientifically Proven Finals Memory Multiplier
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-serif">
                  According to landmark educational research (<em>Roediger &amp; Karpicke, 2006, Psychological Science</em>), self-testing via active diagnostic retrieval, spaced repetitions, and high stakes confidence calibration causes a <strong>1.5 standard deviation (approx. 15-20 percentile) increase in final exam accuracy</strong> compared to passive content highlight reviews.
                </p>
                <div className="flex flex-wrap gap-4 pt-1 font-mono text-[10px] text-slate-400">
                  <span className="flex items-center text-emerald-400">
                    <Check className="h-3 w-3 mr-1" /> Active Recall (Leitner Algorithm)
                  </span>
                  <span className="flex items-center text-blue-400">
                    <Check className="h-3 w-3 mr-1" /> State-Dependent Comfort calibration
                  </span>
                  <span className="flex items-center text-purple-400">
                    <Check className="h-3 w-3 mr-1" /> Interleaved Diagnostic Sequencing
                  </span>
                </div>
              </div>

              {/* Real-time calculated scientific statistics based on user's active progress */}
              <div className="shrink-0 bg-black/45 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2 min-w-[210px] relative">
                <div className="absolute -top-2.5 bg-indigo-600 text-white font-mono text-[8px] font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase border border-indigo-500">
                  Real-time Brain State
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Memory Retention Rating</div>
                  <div className="text-3xl font-black font-mono tracking-tight text-emerald-400 mt-1">
                    {calculatedMemoryPct}%
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
                    style={{
                      width: `${calculatedMemoryPct}%`
                    }}
                  />
                </div>
                <div className="text-[9px] font-mono text-slate-400">
                  Estimated Grade Shift: <strong className="text-emerald-300 font-bold font-sans">+1.5 GPA SD</strong>
                </div>
              </div>
            </div>
          </div>

          {/* TAB 1: DIAGNOSTIC HUB */}
          {activeTab === "summary" && (
            <div id="summary-tab-content" className="space-y-8 animate-fade-in text-left">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Academic Curriculum Mapping */}
                <div className="lg:col-span-2 bg-slate-900 border border-indigo-950/75 p-6 rounded-2xl space-y-4 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-505/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest font-mono">
                      [COGNITIVE ARCHITECTURE BLUEPRINT]
                    </h3>
                    <div className="text-[9px] font-mono text-slate-400 font-bold bg-white/5 border border-white/10 px-1.5 py-0.5 rounded uppercase">
                      Class Intel
                    </div>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-sans pt-1">
                    {cleanMathFormula(deck.summary?.curriculumExplanation || "No curriculum explanation provided.")}
                  </p>
                  <p className="text-xs font-mono text-indigo-305/85 border-t border-white/5 pt-2.5 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    <span>SYSTEM COMPATIBILITY: RIGOROUS BENCHMARKS OF STUDENT-DIRECTED TRADITIONAL INSTRUCTION</span>
                  </p>
                </div>

                {/* Campus Survival Tactics */}
                <div className="bg-amber-955/35 border border-amber-900/40 p-6 rounded-2xl space-y-4 shadow-xl text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                  <h3 className="text-xs font-black text-amber-200 uppercase tracking-widest font-mono flex items-center space-x-1 border-b border-amber-900/30 pb-2">
                    <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />
                    <span>CAMPUS SURVIVAL TACTICAL BUFFS</span>
                  </h3>
                  <ul className="space-y-3.5">
                    {topTips.map((tip: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-2.5">
                        <span className="flex items-center justify-center h-5 w-5 bg-amber-500 text-slate-950 rounded text-[10px] font-black shrink-0 font-mono mt-0.5">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-bold text-amber-100/90 leading-relaxed">{cleanMathFormula(tip)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Condensed notes summary */}
              <div className="space-y-3">
                <h3 className="text-xs font-black font-mono text-slate-400 tracking-widest uppercase flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 bg-indigo-550 rounded-full animate-ping" />
                  <span>DATA EXTRACTION MATRIX: CORE DIRECTIVES</span>
                </h3>
                <p className="text-sm text-indigo-100 leading-relaxed bg-slate-950 border border-slate-900 p-5 rounded-2xl font-serif leading-relaxed shadow-lg">
                  {cleanMathFormula(deck.summary?.synthesizedNotesParagraph || "No notes synthesis available.")}
                </p>
              </div>

              {/* Generated dense cheat sheet */}
              <div className="space-y-3 pt-6 border-t border-slate-900">
                <h3 className="text-xs font-black font-mono text-slate-400 tracking-widest uppercase flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 bg-indigo-550 rounded-full" />
                  <span>SECURE HIGH-DENSITY DECRYPTED NOTES SYSTEM</span>
                </h3>
                <div id="cheat-sheet-container" className="bg-slate-955 border-2 border-slate-905 p-6 rounded-2xl shadow-inner max-w-none prose prose-invert overflow-auto text-slate-200 font-mono text-xs leading-relaxed max-h-[500px]">
                  {renderCheatSheetHTML(deck.summary?.coreCheatSheetMarkdown || "")}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDY COUNTDOWN TIMELINE */}
          {activeTab === "timeline" && (
            <div id="timeline-tab-content" className="space-y-6 animate-fade-in text-left">
              <div className="max-w-xl">
                <h3 className="text-xs font-black font-mono text-slate-400 tracking-widest uppercase flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 bg-indigo-550 rounded-full animate-pulse" />
                  <span>SEQUENCE REGRESSION PLAN</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Rigorous daily retrieval intervals to build robust memory paths. Follow this high-fidelity curriculum schedule:
                </p>
              </div>

              <div className="relative border-l-2 border-indigo-950 pl-6 ml-3 space-y-8 py-4">
                {timeline.map((day, idx) => (
                  <div key={idx} className="relative group">
                    {/* Circle Node */}
                    <div className="absolute -left-[31px] top-1.5 bg-slate-950 border-2 border-indigo-900/60 text-indigo-300 rounded-full h-6 w-6 flex items-center justify-center font-mono text-[9px] font-black group-hover:border-indigo-500 transition shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                      {(idx + 1).toString().padStart(2, '0')}
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md hover:border-indigo-500/60 hover:shadow-indigo-500/5 transition duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-black text-indigo-405 bg-indigo-950 border border-indigo-850 px-2 py-0.5 rounded uppercase tracking-wider">
                          {cleanMathFormula(day.dayName)}
                        </span>
                        <span className="text-[8px] font-mono text-slate-500 font-bold uppercase">
                          Phase 0{idx + 1} Approved
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-indigo-100 mt-3 font-mono uppercase tracking-tight">
                        {cleanMathFormula(day.activityTitle)}
                      </h4>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans pt-1 border-t border-slate-850/50">
                        {cleanMathFormula(day.activityDescription)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ACTIVE RECALL FLASHCARDS */}
          {activeTab === "flashcards" && (
            <div id="flashcards-tab-content" className="space-y-6 animate-fade-in max-w-xl mx-auto text-center">
              <div>
                <h3 className="text-xs font-black font-mono text-slate-400 tracking-widest uppercase flex items-center justify-center space-x-2">
                  <span className="h-1.5 w-1.5 bg-indigo-550 rounded-full animate-pulse" />
                  <span>ACTIVE RECALL NEURAL SANDBOX</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 pb-1">
                  Don't just passively read. Force your cognitive pathways to fetch and retrieve the raw intelligence. Click to flip.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 text-left bg-slate-950 border border-slate-905 p-3 rounded-2xl">
                <div className="flex justify-between text-[10px] font-mono font-black text-slate-400">
                  <span>UNITS LOGGED: {currentCardIndex + 1} / {flashcards.length}</span>
                  <span className="text-emerald-400">● {masteredCards.length} COGNITIVELY MASTERED</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                    style={{ width: `${flashcards.length > 0 ? ((currentCardIndex + 1) / flashcards.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Large Tactile Holographic Flashcard */}
              <div
                id="interactive-flashcard"
                onClick={() => setIsFlipped(!isFlipped)}
                className={`h-60 w-full text-left p-6 rounded-2xl shadow-xl flex flex-col justify-between cursor-pointer transform transition-all duration-300 select-none ${
                  isFlipped 
                    ? "border-amber-400 bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-300 shadow-[0_6px_30px_rgba(245,158,11,0.35)] hover:border-orange-500 scale-[1.02]" 
                    : "bg-slate-900 border-slate-800 hover:border-indigo-500 hover:shadow-indigo-500/5 hover:scale-[1.01]"
                }`}
              >
                <div className={`flex items-center justify-between border-b pb-2 ${
                  isFlipped ? "border-amber-950/20" : "border-white/5"
                }`}>
                  <span className={`text-[8px] font-mono font-black uppercase tracking-wider ${
                    isFlipped ? "text-amber-950/70" : "text-slate-500"
                  }`}>
                    [CARD CONSOLE MODULE]
                  </span>
                  <span className={`text-[8px] font-mono font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                    isFlipped 
                      ? "bg-amber-950/20 border-amber-900/30 text-amber-955" 
                      : "bg-indigo-950 border-indigo-900 text-indigo-300"
                  }`}>
                    {isFlipped ? "Side B // Target Fact" : "Side A // Core Question"}
                  </span>
                </div>

                <div className="grow flex items-center justify-center py-4">
                  <p className={`text-center px-4 transition-all duration-200 ${
                    isFlipped 
                      ? "text-slate-950 font-black font-sans tracking-tight text-base md:text-lg leading-relaxed" 
                      : "text-white font-semibold font-sans tracking-wide text-sm md:text-base leading-relaxed"
                  }`}>
                    {isFlipped
                      ? cleanMathFormula(flashcards[currentCardIndex]?.answer || "No answer available")
                      : cleanMathFormula(flashcards[currentCardIndex]?.question || "No question available")}
                  </p>
                </div>

                <div className={`flex items-center justify-center text-[9px] font-mono font-bold border-t pt-2 uppercase ${
                  isFlipped ? "text-amber-950 border-amber-950/20" : "text-slate-500 border-white/5"
                }`}>
                  <RefreshCw className="h-3 w-3 mr-1.5 animate-spin-slow" />
                  <span>Click cardboard deck to rotate side</span>
                </div>
              </div>

              {/* Action and Navigation button deck */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={currentCardIndex === 0}
                  onClick={() => {
                    setCurrentCardIndex(currentCardIndex - 1);
                    setIsFlipped(false);
                  }}
                  className={`p-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 transition cursor-pointer ${
                    currentCardIndex === 0 
                      ? "opacity-30 cursor-not-allowed" 
                      : "hover:border-indigo-500 hover:text-white hover:shadow-indigo-500/5 active:scale-95"
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  disabled={flashcards.length === 0}
                  onClick={() => toggleMastered(currentCardIndex)}
                  className={`px-6 py-3 rounded-xl text-xs font-bold border transition duration-150 flex items-center font-mono uppercase tracking-wider cursor-pointer ${
                    masteredCards.includes(currentCardIndex)
                      ? "bg-emerald-950/40 text-emerald-300 border-emerald-900/60 hover:bg-emerald-900/20"
                      : "bg-slate-900 text-slate-300 border-slate-800 hover:border-indigo-550 hover:text-white"
                  }`}
                >
                  <Bookmark className="h-3 w-3 mr-2" />
                  <span>{masteredCards.includes(currentCardIndex) ? "Cognitively Mastered !" : "Log as Mastered"}</span>
                </button>

                <button
                  type="button"
                  disabled={flashcards.length === 0 || currentCardIndex === flashcards.length - 1}
                  onClick={() => {
                    setCurrentCardIndex(currentCardIndex + 1);
                    setIsFlipped(false);
                  }}
                  className={`p-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 transition cursor-pointer ${
                    flashcards.length === 0 || currentCardIndex === flashcards.length - 1 
                      ? "opacity-30 cursor-not-allowed" 
                      : "hover:border-indigo-550 hover:text-white hover:shadow-indigo-500/5 active:scale-95"
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: INTERACTIVE QUIZ BATTLE ROYALE */}
          {activeTab === "quiz" && (
            <div id="quiz-tab-content" className="space-y-6 animate-fade-in">
              {/* Sahur Sound Effect Overlay */}
              {showSahurOverlay && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                  <div className="bg-gradient-to-br from-orange-600 to-red-500 border-2 border-amber-400 p-8 rounded-3xl max-w-md shadow-2xl space-y-4 relative overflow-hidden animate-bounce">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl" />
                    <div className="text-6xl animate-pulse">🍳📣✨</div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white font-mono uppercase tracking-widest leading-tight">
                      TUNG TUNG SAHUR!!!
                    </h2>
                    <div className="bg-black/40 p-4 rounded-xl space-y-2">
                      {sahurMessages.map((msg, idx) => (
                        <p key={idx} className="text-xs font-mono font-bold text-yellow-300 leading-normal">
                          {msg}
                        </p>
                      ))}
                    </div>
                    <div className="text-[10px] text-orange-100 font-bold uppercase tracking-widest animate-pulse">
                      * GPA standard deviation panic decreased by 89.4% *
                    </div>
                  </div>
                </div>
              )}

              {/* Quiz Header & Battlefield HUD */}
              <div className="bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 rounded-2xl p-5 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-5 border border-red-900/40">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-red-500 text-white font-mono text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                      100% MATCHING SURVIVOR MODE
                    </span>
                    <span className="text-xs text-slate-300 font-mono">
                      10 Questions per Section &bull; Fully Interactive
                    </span>
                  </div>
                  <h3 className="text-lg font-sans font-black tracking-tight text-white flex items-center space-x-1.5 pt-0.5">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <span>Extreme Cognitive Matching Challenge</span>
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Experience landmark educational research. Pair the Crimson-Red &amp; Steel-Blue dual-coded terms on the left to their accurate answers on the right using visual connectors!
                  </p>
                </div>

                {/* Status HUD Info */}
                <div className="flex flex-wrap items-center gap-4 bg-black/40 p-3.5 rounded-xl border border-white/10 shrink-0 select-none font-mono">
                  <div className="text-center px-2">
                    <div className="text-[9px] font-slate-405 uppercase font-bold">Matched</div>
                    <div className="text-sm font-sans font-black text-blue-300 font-mono">
                      {Object.keys(matchingAnswers).length} / {organizedQuiz.length}
                    </div>
                  </div>
                  <div className="w-[1px] h-8 bg-white/15" />
                  <div className="text-center px-2">
                    <div className="text-[9px] font-slate-405 uppercase font-bold">Shield HP</div>
                    <div className={`text-sm font-sans font-black font-mono ${
                      Object.keys(matchingAnswers).length === organizedQuiz.length ? "text-emerald-400 animate-pulse" : "text-amber-400"
                    }`}>
                      {Math.round((Object.keys(matchingAnswers).length / organizedQuiz.length) * 100)}%
                    </div>
                  </div>
                  {submittedQuiz && (
                    <>
                      <div className="w-[1px] h-8 bg-white/15" />
                      <div className="text-center px-2">
                        <div className="text-[9px] font-slate-405 uppercase font-bold">Grade Out</div>
                        <div className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                          ((quizScore / organizedQuiz.length) * 100) >= 90 ? "bg-emerald-500 text-black" : ((quizScore / organizedQuiz.length) * 100) >= 70 ? "bg-blue-500 text-white" : "bg-red-500 text-white"
                        }`}>
                          {quizScore}/{organizedQuiz.length} ({((quizScore / organizedQuiz.length) * 100).toFixed(0)}%)
                        </div>
                      </div>
                    </>
                  )}

                  <div className="w-[1px] h-8 bg-white/15" />
                  <button
                    type="button"
                    onClick={() => setShowPdfModal(true)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-mono font-bold rounded-lg border border-indigo-400/40 transition cursor-pointer active:scale-95 shadow-sm"
                    title="Export mock exam as printable PDF"
                  >
                    <FileDown className="h-3.5 w-3.5 text-amber-300" />
                    <span>PDF ({organizedQuiz.length}Q)</span>
                  </button>
                </div>
              </div>

              {/* Section Selector Matrix */}
              <div className="bg-slate-55 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
                <div className="space-y-0.5 text-left">
                  <h4 className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">
                    Matching Arena - Active Test Sections
                  </h4>
                  <p className="text-xs text-slate-650 font-semibold font-sans">
                    Complete all 10 sets below (10 questions at a time) to submit
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {Array.from({ length: Math.ceil(organizedQuiz.length / 10) }, (_, i) => i).map((sectionIndex) => {
                    const start = sectionIndex * 10 + 1;
                    const end = Math.min((sectionIndex + 1) * 10, organizedQuiz.length);
                    const isCurrent = currentSectionIndex === sectionIndex;
                    
                    let matchedCount = 0;
                    for (let qIdx = sectionIndex * 10; qIdx < end; qIdx++) {
                      if (matchingAnswers[qIdx]) {
                        matchedCount++;
                      }
                    }

                    return (
                      <button
                        key={sectionIndex}
                        type="button"
                        onClick={() => handleSetSectionIndex(sectionIndex)}
                        className={`px-3 py-2 text-xs font-bold rounded-xl border transition flex items-center space-x-1.5 cursor-pointer ${
                          isCurrent
                            ? "bg-slate-950 text-white border-slate-950 font-black shadow-md font-mono"
                            : matchedCount === (end - start + 1)
                              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                              : "bg-white border-slate-200 hover:bg-slate-100 text-slate-705"
                        }`}
                      >
                        <span>Set {sectionIndex + 1} ({start}-{end})</span>
                        {matchedCount > 0 && (
                          <span className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded ${
                            isCurrent ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-755"
                          }`}>
                            {matchedCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Quiz Body Panel - Dual Columns Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                {/* Left Card: Single focus question slot workspace (no scrolling!) */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 space-y-4 shadow-sm relative text-left">
                  {/* COGNITIVE ACTIVE RETRIEVAL • MATCH PAIRS CARD LAYOUT */}
                  <div className="flex items-center justify-between border-b pb-3">
                    <h4 className="text-xs font-mono font-black text-slate-700 uppercase tracking-widest">
                      ACTIVE SYSTEM RETRIEVAL &bull; MATCH PAIRS
                    </h4>
                    <div className="text-[10px] font-mono text-slate-500 font-bold bg-slate-50 px-2.5 py-1 rounded shadow-sm border border-slate-150">
                      🎯 Set {currentSectionIndex + 1} &bull; Unit {((focusedRowIdx !== null && focusedRowIdx >= currentSectionIndex * 10 && focusedRowIdx < (currentSectionIndex * 10) + 10) ? focusedRowIdx : (currentSectionIndex * 10)) - (currentSectionIndex * 10) + 1} Selected
                    </div>
                  </div>

                  {/* 10 Notches Pagination Header */}
                  {(() => {
                    const activeIdx = (focusedRowIdx !== null && focusedRowIdx >= currentSectionIndex * 10 && focusedRowIdx < (currentSectionIndex * 10) + 10)
                      ? focusedRowIdx
                      : (currentSectionIndex * 10);

                    const notchesToShow = Math.min(10, organizedQuiz.length - (currentSectionIndex * 10));

                    return (
                      <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200/80 rounded-xl select-none mb-2">
                        <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-wider shrink-0 hidden sm:inline">
                          🎯 Notch Dial:
                        </span>
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none w-full justify-between sm:justify-start">
                          {Array.from({ length: notchesToShow }).map((_, idx) => {
                            const currentSecIdxAbs = currentSectionIndex * 10 + idx;
                            const isCurrentActive = activeIdx === currentSecIdxAbs;
                            const isCurrentMatched = matchingAnswers[currentSecIdxAbs] !== undefined;

                            let btnStyle = "bg-white text-slate-700 border-slate-200 hover:border-slate-400";
                            if (isCurrentActive) {
                              btnStyle = "bg-indigo-600 text-white border-indigo-600 font-extrabold shadow ring-2 ring-indigo-400/30";
                            } else if (isCurrentMatched) {
                              btnStyle = "bg-emerald-500 text-white border-emerald-500 font-black";
                            }

                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setFocusedRowIdx(currentSecIdxAbs);
                                  setWrongAttemptAnswer(null);
                                }}
                                className={`w-7.5 h-7.5 rounded-xl border text-xs font-mono transition duration-150 flex items-center justify-center shrink-0 cursor-pointer ${btnStyle}`}
                                title={`Focus Question Slot ${idx + 1}`}
                              >
                                {idx + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* ONE QUESTION AT A TIME WORKSPACE CONTAINER */}
                  {(() => {
                    const activeIdx = (focusedRowIdx !== null && focusedRowIdx >= currentSectionIndex * 10 && focusedRowIdx < (currentSectionIndex * 10) + 10)
                      ? focusedRowIdx
                      : (currentSectionIndex * 10);

                    const q = organizedQuiz[activeIdx];
                    if (!q) return null;

                    const userMatchedText = matchingAnswers[activeIdx];
                    const correctVal = q.options[q.correctIndex];
                    const isMatchCorrect = userMatchedText === correctVal;

                    let rowBorderColor = "border-indigo-200 bg-white";
                    if (wrongAttemptAnswer) {
                      rowBorderColor = "border-rose-450 bg-rose-50/10 shadow-[0_0_15px_rgba(239,68,68,0.06)] animate-shake";
                    } else if (userMatchedText) {
                      rowBorderColor = "border-emerald-450 bg-emerald-50/10 shadow-[0_0_15px_rgba(16,185,129,0.06)]";
                    }

                    const promptParts = splitQuestionIntoMatchingSections(q.question);

                    return (
                      <div className="space-y-4">
                        <div className={`p-5 rounded-2xl border-2 transition-all duration-300 relative flex flex-col justify-between ${rowBorderColor}`}>
                          
                          {/* Card Sub-header info */}
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4 select-none">
                            <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">
                              [ ACTIVE SLOT WORKSPACE ]
                            </span>
                            <span className={`text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded border ${
                              isMatchCorrect 
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                                : wrongAttemptAnswer
                                  ? "bg-rose-50 border-rose-200 text-rose-800 animate-pulse"
                                  : "bg-indigo-50 border-indigo-100 text-indigo-700"
                            }`}>
                              {isMatchCorrect ? "✔ Locked-in Correct" : wrongAttemptAnswer ? "❌ Attempt Mismatch" : "⏳ Awaiting Match"}
                            </span>
                          </div>

                          {/* Dual component side by side row layout */}
                          <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 md:gap-7 my-2">
                            {/* Prompt Word / Term Section */}
                            <div className="flex-1 min-h-[70px] flex flex-col justify-center text-left">
                              <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1.5 select-none">
                                Prompt / Retrieval Cue:
                              </span>
                              <div className="text-sm md:text-base font-serif font-black leading-relaxed text-slate-900 select-text">
                                <span className="text-red-700 decoration-red-200">
                                  {promptParts.part1}
                                </span>
                                {promptParts.part2 && (
                                  <span className="text-blue-700 decoration-blue-200 ml-1">
                                    {promptParts.part2}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Circular Connecting Pin */}
                            <div className="hidden md:flex items-center justify-center shrink-0 select-none w-12">
                              <div className="w-full h-[2px] border-t-2 border-indigo-100 relative flex justify-end items-center">
                                <div className={`w-3.5 h-3.5 rounded-full border-2 border-white -mr-1.5 shadow-md transition-colors ${
                                  isMatchCorrect ? "bg-emerald-500" : wrongAttemptAnswer ? "bg-rose-600" : "bg-indigo-600 animate-pulse"
                                }`} />
                              </div>
                            </div>

                            {/* Match Choice Target section */}
                            <div className="flex-1 flex flex-col justify-center min-h-[70px]">
                              <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1.5 select-none text-left">
                                Target Snap Slot:
                              </span>

                              {!userMatchedText ? (
                                <div className="w-full h-full flex items-center">
                                  <div className={`w-full py-4.5 px-4 text-center rounded-xl border-2 border-dashed font-mono text-xs font-black transition flex flex-col items-center justify-center gap-1.5 min-h-[56px] select-none ${
                                    wrongAttemptAnswer 
                                      ? "border-rose-400 bg-rose-50 text-rose-700"
                                      : "border-slate-300 bg-slate-50 text-slate-400"
                                  }`}>
                                    <span>{wrongAttemptAnswer ? "❌ NOT A MATCH!" : "⚡ EMPTY SNAP SLOT"}</span>
                                    <span className="text-[10px] font-sans font-semibold text-slate-400 leading-tight">
                                      {wrongAttemptAnswer ? "Try another option from the deck below" : "Select corresponding term in the pool"}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-full relative flex items-center bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3.5 gap-2 animate-fade-in text-left">
                                  <div className="flex-1 pr-6 flex items-center leading-normal">
                                    {(() => {
                                      const optParts = splitOptionIntoMatchingSections(userMatchedText);
                                      return (
                                        <div className="flex flex-wrap items-baseline gap-1 font-sans font-black text-xs md:text-sm text-slate-900">
                                          {optParts.prefix && (
                                            <span className="text-[9px] font-mono bg-emerald-100 border border-emerald-200 px-1 py-0.5 rounded text-emerald-800 font-mono tracking-tight shrink-0">
                                              {optParts.prefix}
                                            </span>
                                          )}
                                          <span className="text-red-800 underline decoration-red-300">{optParts.part1}</span>
                                          {optParts.part2 && (
                                            <span className="text-blue-800 underline decoration-blue-300">{optParts.part2}</span>
                                          )}
                                        </div>
                                      );
                                    })()}
                                  </div>

                                  {!submittedQuiz && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        clearMatchingAnswer(activeIdx);
                                        setWrongAttemptAnswer(null);
                                      }}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-850 p-1 rounded-md transition cursor-pointer"
                                      title="Clear Connection"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Instant Feedback Notice Panel */}
                          {wrongAttemptAnswer && (
                            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold leading-relaxed flex items-start gap-2 animate-fade-in select-text">
                              <span className="text-sm shrink-0">⚠️</span>
                              <div className="space-y-0.5 text-left">
                                <div className="font-extrabold uppercase font-mono text-[9px] text-rose-900">
                                  Instant Diagnostic Verification
                                </div>
                                <p className="font-sans leading-relaxed text-rose-700">
                                  Hmm, <span className="font-mono bg-rose-100 px-1 py-0.5 rounded text-rose-900 font-bold">"{wrongAttemptAnswer}"</span> is not a match for this slot. Keep searching the options pool!
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Lifeline leakage content within the cards */}
                          {(eliminatedOptions[`leak_${activeIdx}` as any] || submittedQuiz) && (
                            <div className="mt-4 p-4 bg-yellow-50/50 border border-yellow-200 rounded-xl space-y-1.5 text-xs animate-fade-in text-left select-text">
                              <div className="font-extrabold text-amber-950 uppercase font-mono flex items-center space-x-1">
                                <HelpCircle className="h-3.5 w-3.5 text-amber-800" />
                                <span>FINALS LEAK WALKTHROUGH:</span>
                              </div>
                              <p className="text-gray-700 leading-relaxed font-serif pt-1">
                                {cleanMathFormula(q.explanation)}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Local Notches Pagination Buttons */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                          <button
                            type="button"
                            disabled={activeIdx === currentSectionIndex * 10}
                            onClick={() => {
                              setFocusedRowIdx(activeIdx - 1);
                              setWrongAttemptAnswer(null);
                            }}
                            className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black border transition ${
                              activeIdx === currentSectionIndex * 10 
                                ? "text-slate-300 border-slate-100 bg-slate-50 cursor-not-allowed" 
                                : "border-slate-200 hover:bg-slate-50 text-slate-800 cursor-pointer"
                            }`}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <span>Previous Slot</span>
                          </button>

                          <div className="text-[10px] font-mono text-slate-400 font-bold uppercase select-none">
                            Slot {activeIdx - (currentSectionIndex * 10) + 1} of {Math.min(10, organizedQuiz.length - (currentSectionIndex * 10))}
                          </div>

                          <button
                            type="button"
                            disabled={activeIdx === Math.min((currentSectionIndex + 1) * 10, organizedQuiz.length) - 1}
                            onClick={() => {
                              setFocusedRowIdx(activeIdx + 1);
                              setWrongAttemptAnswer(null);
                            }}
                            className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black border transition ${
                              activeIdx === Math.min((currentSectionIndex + 1) * 10, organizedQuiz.length) - 1 
                                ? "text-slate-300 border-slate-100 bg-slate-50 cursor-not-allowed" 
                                : "border-slate-200 hover:bg-slate-50 text-slate-800 cursor-pointer"
                            }`}
                          >
                            <span>Next Slot</span>
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Set-level Navigation Toolbar (Previous Set / Next Set) */}
                  <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-6">
                    <button
                      type="button"
                      disabled={currentSectionIndex === 0}
                      onClick={() => handleSetSectionIndex(currentSectionIndex - 1)}
                      className={`inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition ${
                        currentSectionIndex === 0 ? "text-slate-300 border-slate-100 bg-slate-50 cursor-not-allowed" : "border-slate-200 hover:bg-slate-50 text-slate-800 cursor-pointer"
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous Set</span>
                    </button>

                    <button
                      type="button"
                      disabled={currentSectionIndex === Math.ceil(organizedQuiz.length / 10) - 1}
                      onClick={() => handleSetSectionIndex(currentSectionIndex + 1)}
                      className={`inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition ${
                        currentSectionIndex === Math.ceil(organizedQuiz.length / 10) - 1 ? "text-slate-300 border-slate-100 bg-slate-50 cursor-not-allowed" : "border-slate-200 hover:bg-slate-50 text-slate-800 cursor-pointer"
                      }`}
                    >
                      <span>Next Set</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Right Area: Interactive Battle Royale Lifeline items */}
                <div id="quiz-sidebar-right" className="space-y-4">
                  
                  {/* SNAP DECK: Available Matching Option Cards */}
                  <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden text-left">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="border-b border-white/10 pb-2 flex items-center justify-between">
                      <h4 className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest flex items-center space-x-1.5">
                        <Layers className="h-3.5 w-3.5 text-indigo-400" />
                        <span>SNAP DECK &bull; OPTIONS POOL</span>
                      </h4>
                      <span className="text-[9px] font-mono text-indigo-300 font-bold bg-indigo-950 border border-indigo-800/40 px-2 py-0.5 rounded">
                        Set {currentSectionIndex + 1}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-normal select-none">
                      Click an option card below to match it to Slot {activeMatchingIdx - currentSectionIndex * 10 + 1}!
                    </p>

                    {/* Integrated Quick-Matching Search Bar */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="🔍 Type to search terms / answers..."
                        value={matchingSearchQuery}
                        onChange={(e) => setMatchingSearchQuery(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-805 text-slate-100 placeholder:text-slate-500 rounded-xl py-2 pl-3 pr-8 text-[11px] focus:outline-none focus:border-indigo-505 hover:border-slate-700 transition font-sans text-left"
                      />
                      {matchingSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setMatchingSearchQuery("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-405 hover:text-white text-[9px] font-mono font-bold bg-white/5 hover:bg-white/10 px-1.5 py-0.5 rounded transition cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                      {(() => {
                        const filteredOptions = scrambledSectionOptions.filter((opt) => {
                          if (!matchingSearchQuery.trim()) return true;
                          return opt.toLowerCase().includes(matchingSearchQuery.toLowerCase());
                        });
                        
                        if (filteredOptions.length === 0) {
                          return (
                            <div className="text-center py-8 px-4 text-slate-500 text-xs font-mono">
                              No terms match search text
                            </div>
                          );
                        }
                        
                        return filteredOptions.map((opt, optIdx) => {
                          const matchedRow = findMatchedRowForAnswer(opt);
                          const isPlaced = matchedRow !== null;
                          const isVaporized = eliminatedOptions[activeMatchingIdx]?.includes(opt as any);
                          
                          let cardStyle = "bg-slate-950/65 border-white/10 hover:border-indigo-505 hover:bg-slate-900";
                          let statusText = "Available to Snap";
                          
                          if (isPlaced) {
                            cardStyle = "bg-emerald-950/25 border-emerald-900/40 text-slate-300 opacity-60 cursor-pointer hover:border-emerald-500 hover:opacity-90";
                            statusText = `Snapped to Slot ${matchedRow - currentSectionIndex * 10 + 1}`;
                          } else if (isVaporized) {
                            cardStyle = "bg-blue-950/20 border-blue-900/30 text-slate-500 line-through cursor-not-allowed select-none";
                            statusText = "Vaporized / Eliminated";
                          } else {
                            cardStyle = "bg-slate-950 border-indigo-900/60 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer";
                            statusText = `Ready for Slot ${activeMatchingIdx - currentSectionIndex * 10 + 1}`;
                          }

                          const optParts = splitOptionIntoMatchingSections(opt);

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              disabled={isVaporized || submittedQuiz}
                              onClick={() => handleSelectCard(opt)}
                              className={`w-full text-left rounded-xl p-3 border transition-all duration-200 relative flex flex-col gap-1.5 ${cardStyle}`}
                            >
                              <div className="flex items-start justify-between gap-2 w-full">
                                <div className="flex flex-wrap items-baseline gap-1.5 font-sans font-bold text-xs leading-snug">
                                  {optParts.prefix && (
                                    <span className={`text-[9px] font-mono px-1 py-0.5 rounded font-black border ${
                                      isPlaced 
                                        ? "bg-emerald-950 border-emerald-805 text-emerald-300" 
                                        : isVaporized
                                          ? "bg-blue-950/50 border-blue-900/40 text-slate-600"
                                          : "bg-indigo-950 border-indigo-800 text-indigo-200"
                                    }`}>
                                      {optParts.prefix}
                                    </span>
                                  )}
                                  <span className={isPlaced ? "text-slate-300" : isVaporized ? "text-slate-600" : "text-white"}>
                                    {optParts.part1}
                                  </span>
                                  {optParts.part2 && (
                                    <span className={isPlaced ? "text-slate-400" : isVaporized ? "text-slate-705" : "text-slate-300 font-semibold"}>
                                      {optParts.part2}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-[8px] font-mono font-bold uppercase tracking-wider mt-0.5 border-t border-white/5 pt-1">
                                <span className={
                                  isPlaced 
                                    ? "text-emerald-400" 
                                    : isVaporized 
                                      ? "text-blue-400" 
                                      : "text-indigo-400 animate-pulse"
                                }>
                                  {isPlaced ? "● " : isVaporized ? "▲ " : "○ "} {statusText}
                                </span>

                                {/* Show Class Poll results if used */}
                                {crowdPollResult[activeMatchingIdx] && crowdPollResult[activeMatchingIdx][opt] !== undefined && (
                                  <span className="bg-indigo-950 border border-indigo-805/40 text-indigo-300 font-black px-1.5 py-0.5 rounded">
                                    📊 Poll consensus: {crowdPollResult[activeMatchingIdx][opt]}%
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl text-left">
                    <h4 className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest border-b border-white/10 pb-2">
                      Active Survivor Lifelines / Buffs
                    </h4>
                    
                    <p className="text-[11px] text-slate-300 leading-normal select-none">
                      Strategically activate these single-use abilities on the currently focused row slot.
                    </p>

                    <div className="space-y-3 pt-1">
                      {/* Lifeline 1: Tung Tung Sahur */}
                      <div className="bg-amber-950/40 border border-amber-900/40 rounded-xl p-3 flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="font-extrabold text-xs text-amber-200 font-mono">
                            TUNG TUNG SAHUR ALARM
                          </div>
                          <div className="text-[10px] text-amber-300/85 leading-snug">
                            Let an iron frying pan sound clang and auto-solve the currently selected row correctly!
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={
                            lifelines.sahurAlarm <= 0 || 
                            submittedQuiz || 
                            matchingAnswers[activeMatchingIdx] === organizedQuiz[activeMatchingIdx].options[organizedQuiz[activeMatchingIdx].correctIndex]
                          }
                          onClick={() => useSahurAlarmMatching(activeMatchingIdx)}
                          className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition shrink-0 font-mono ${
                            lifelines.sahurAlarm <= 0 || 
                            submittedQuiz || 
                            matchingAnswers[activeMatchingIdx] === organizedQuiz[activeMatchingIdx].options[organizedQuiz[activeMatchingIdx].correctIndex]
                              ? "bg-slate-850 text-slate-600 border border-slate-800 cursor-not-allowed"
                              : "bg-amber-500 hover:bg-amber-400 text-slate-950 hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer active:scale-95"
                          }`}
                        >
                          🍳 {lifelines.sahurAlarm} Left
                        </button>
                      </div>

                      {/* Lifeline 2: Sussy Radar (50/50) */}
                      <div className="bg-blue-950/45 border border-blue-900/40 rounded-xl p-3 flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="font-extrabold text-xs text-blue-200 font-mono">
                            SUSSY RADAR (50/50 &bull; VAPORIZE)
                          </div>
                          <div className="text-[10px] text-blue-300/85 leading-snug">
                            Vaporizes exactly 2 wrong imposter answer cards from the pool for your focused row.
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={
                            lifelines.sussyRadar <= 0 || 
                            submittedQuiz || 
                            eliminatedOptions[activeMatchingIdx] !== undefined
                          }
                          onClick={() => useSussyRadarMatching(activeMatchingIdx)}
                          className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition shrink-0 font-mono ${
                            lifelines.sussyRadar <= 0 || 
                            submittedQuiz || 
                            eliminatedOptions[activeMatchingIdx] !== undefined
                              ? "bg-slate-850 text-slate-600 border border-slate-800 cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-400 text-white cursor-pointer active:scale-95 hover:shadow-lg hover:shadow-blue-500/10"
                          }`}
                        >
                          👁️ {lifelines.sussyRadar} Left
                        </button>
                      </div>

                      {/* Lifeline 3: Epstein Document Leak */}
                      <div className="bg-yellow-950/40 border border-yellow-905/40 rounded-xl p-3 flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="font-extrabold text-xs text-yellow-200 font-mono">
                            EPSTEIN DOCUMENT LEAK
                          </div>
                          <div className="text-[10px] text-yellow-300/85 leading-snug">
                            Vandalizes examination keys to leak explanation for focused row before submitting!
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={
                            lifelines.epsteinLeak <= 0 || 
                            submittedQuiz || 
                            eliminatedOptions[`leak_${activeMatchingIdx}` as any] !== undefined
                          }
                          onClick={() => useEpsteinLeakMatching(activeMatchingIdx)}
                          className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition shrink-0 font-mono ${
                            lifelines.epsteinLeak <= 0 || 
                            submittedQuiz || 
                            eliminatedOptions[`leak_${activeMatchingIdx}` as any] !== undefined
                              ? "bg-slate-850 text-slate-600 border border-slate-800 cursor-not-allowed"
                              : "bg-yellow-500 hover:bg-yellow-400 text-black cursor-pointer active:scale-95 hover:shadow-lg hover:shadow-yellow-500/10"
                          }`}
                        >
                          🗂️ {lifelines.epsteinLeak} Left
                        </button>
                      </div>

                      {/* Lifeline 4: Ask TS Crowd */}
                      <div className="bg-rose-950/40 border border-red-900/40 rounded-xl p-3 flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="font-extrabold text-xs text-red-200 font-mono">
                            ASK THE 'TS' CROWD
                          </div>
                          <div className="text-[10px] text-red-350/85 leading-snug">
                            Poll the silent cohort to display a live consensus percentage next to each options card.
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={
                            lifelines.tsCrowd <= 0 || 
                            submittedQuiz || 
                            crowdPollResult[activeMatchingIdx] !== undefined
                          }
                          onClick={() => useTsCrowdMatching(activeMatchingIdx)}
                          className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition shrink-0 font-mono ${
                            lifelines.tsCrowd <= 0 || 
                            submittedQuiz || 
                            crowdPollResult[activeMatchingIdx] !== undefined
                              ? "bg-slate-850 text-slate-600 border border-slate-800 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-400 text-white cursor-pointer active:scale-95 hover:shadow-lg hover:shadow-red-500/10"
                          }`}
                        >
                          🗣️ {lifelines.tsCrowd} Left
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submission Panel Block */}
                  <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4 space-y-3 text-left">
                    <h4 className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest">
                      Survival Diagnostics Submission
                    </h4>
                    
                    <div className="space-y-1.5 flex flex-col">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Total Questions Matched:</span>
                        <span className="font-mono font-bold text-gray-850">
                          {Object.keys(matchingAnswers).length} / {organizedQuiz.length}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Battle State:</span>
                        <span className="font-bold text-indigo-750 uppercase font-mono animate-pulse text-[10px]">
                          {Object.keys(matchingAnswers).length === organizedQuiz.length ? "Full Intel Prepared" : "Locked in Battle"}
                        </span>
                      </div>
                    </div>

                    {!submittedQuiz ? (
                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={submitQuiz}
                          disabled={Object.keys(matchingAnswers).length === 0}
                          className={`w-full py-3.5 rounded-xl text-xs font-mono uppercase tracking-wider font-extrabold text-center transition ${
                            Object.keys(matchingAnswers).length < organizedQuiz.length
                              ? "bg-slate-200 text-slate-500 border border-slate-300 hover:border-slate-400 cursor-pointer"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-md shadow-indigo-500/10 active:scale-95 cursor-pointer"
                          }`}
                        >
                          {Object.keys(matchingAnswers).length < organizedQuiz.length 
                            ? `Attempt Submission (${Object.keys(matchingAnswers).length}/${organizedQuiz.length} Answered)` 
                            : "Submit Final Exam Solution Sheet!"}
                        </button>

                        {/* PDF Export Quick Tile */}
                        <div className="pt-2 border-t border-slate-200">
                          <button
                            type="button"
                            onClick={() => setShowPdfModal(true)}
                            className="w-full inline-flex items-center justify-center space-x-2 py-3 bg-white hover:bg-indigo-50/80 border border-slate-250 hover:border-indigo-300 text-slate-800 hover:text-indigo-900 font-extrabold text-xs rounded-xl transition cursor-pointer active:scale-95 font-mono uppercase tracking-wider shadow-sm"
                          >
                            <FileDown className="h-4 w-4 text-indigo-600" />
                            <span>Export PDF Exam ({organizedQuiz.length} Qs)</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-xl text-center space-y-1">
                          <p className="text-[10px] font-mono font-black uppercase text-indigo-900">
                            Battle Score Metric
                          </p>
                          <p className="text-xl font-bold font-sans text-slate-800">
                            {quizScore} / {organizedQuiz.length} Correct
                          </p>
                          <p className="text-[10px] text-indigo-700 font-semibold font-mono">
                            {((quizScore / organizedQuiz.length) * 100).toFixed(0)}% Correct (Survival Odds: {((quizScore / organizedQuiz.length) * 100).toFixed(0)}%)
                          </p>
                        </div>
                        
                        <button
                          type="button"
                          onClick={resetQuiz}
                          className="w-full inline-flex items-center justify-center space-x-2 py-3 bg-slate-800 hover:bg-slate-700 font-extrabold text-white text-xs rounded-xl transition cursor-pointer active:scale-95 font-mono uppercase tracking-wider mb-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span>Reset & Re-enter Battlefield</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowPdfModal(true)}
                          className="w-full inline-flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 font-black text-white text-xs rounded-xl transition cursor-pointer active:scale-95 font-mono uppercase tracking-wider shadow-md shadow-indigo-900/20"
                        >
                          <FileDown className="h-4 w-4 text-amber-300" />
                          <span>Export PDF Exam Packet ({organizedQuiz.length} Qs)</span>
                        </button>

                        {/* Generative AI expansion mechanism */}
                        <div className="pt-3 border-t border-dashed border-slate-200 mt-2 space-y-2 text-left">
                          <button
                            type="button"
                            onClick={handleGenerateMoreQuestions}
                            disabled={isGeneratingMore}
                            className="w-full inline-flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:scale-[1.01] hover:shadow-indigo-500/10 font-black text-white text-xs rounded-xl transition cursor-pointer active:scale-[0.98] font-mono uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isGeneratingMore ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4 text-amber-300" />
                            )}
                            <span>{isGeneratingMore ? "Securing AI Answers..." : "✨ Generate 25 More Questions (AI)"}</span>
                          </button>

                          {generatorError && (
                            <p className="text-[10px] text-rose-600 font-bold font-mono text-center px-1">
                              ⚠️ {generatorError}
                            </p>
                          )}

                          {deck.quiz && deck.quiz.length > 25 && (
                            <p className="text-[10px] text-slate-500 font-bold font-mono text-center">
                              🔥 Extended Set Active! Total DB Size is: <span className="text-indigo-600 font-semibold">{deck.quiz.length}</span> questions.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PDF Export Options Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-750 text-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold uppercase tracking-widest">
                  <FileDown className="h-3 w-3" />
                  <span>Standardized Paper Format</span>
                </div>
                <h3 className="text-xl font-bold font-sans text-white">
                  Export Mock Final Exam (PDF)
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  {deck.courseName || deck.courseCode} &bull; {deck.schoolName || "D'Evelyn High School"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Dynamic Items Counter & Details */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">Total Exam Items Loaded:</span>
                <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-mono font-black rounded-lg shadow-sm">
                  {organizedQuiz.length} Questions
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                {organizedQuiz.length > 25
                  ? `🔥 Extended question bank active (${organizedQuiz.length} items). All newly generated questions are automatically formatted and included in this comprehensive printable exam packet.`
                  : `Formatted as a standard ${organizedQuiz.length}-item college-prep exam booklet with clean margins, letter options (A-D), and student answer sheet.`}
              </p>
            </div>

            {/* Export Configuration Options */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                Packet Configuration
              </span>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 transition cursor-pointer">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-200">Include Official Answer Key & Scoring Matrix</div>
                  <div className="text-[10px] text-slate-400">Rapid reference scoring grid with correct answers for all {organizedQuiz.length} items</div>
                </div>
                <input
                  type="checkbox"
                  checked={includeKeyInPdf}
                  onChange={(e) => setIncludeKeyInPdf(e.target.checked)}
                  className="h-4 w-4 rounded accent-indigo-500 cursor-pointer ml-3 shrink-0"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 transition cursor-pointer">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-200">Include Step-by-Step Pedagogical Explanations</div>
                  <div className="text-[10px] text-slate-400">In-depth mathematical proofs, historical reasoning, and syllabus notes</div>
                </div>
                <input
                  type="checkbox"
                  checked={includeExplanationsInPdf}
                  onChange={(e) => setIncludeExplanationsInPdf(e.target.checked)}
                  className="h-4 w-4 rounded accent-indigo-500 cursor-pointer ml-3 shrink-0"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 transition cursor-pointer">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-200">Include Student Answer Sheet / Bubble Grid</div>
                  <div className="text-[10px] text-slate-400">Standardized score block and response record on page 1</div>
                </div>
                <input
                  type="checkbox"
                  checked={includeBubbleInPdf}
                  onChange={(e) => setIncludeBubbleInPdf(e.target.checked)}
                  className="h-4 w-4 rounded accent-indigo-500 cursor-pointer ml-3 shrink-0"
                />
              </label>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                id="btn-download-exam-pdf"
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className="w-full inline-flex items-center justify-center space-x-2 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs rounded-xl transition cursor-pointer shadow-lg shadow-indigo-500/20 active:scale-95 font-mono uppercase tracking-wider disabled:opacity-50"
              >
                {isExportingPdf ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : pdfExportSuccess ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>
                  {isExportingPdf
                    ? "Generating PDF Document..."
                    : pdfExportSuccess
                    ? "PDF Successfully Downloaded!"
                    : `Download PDF Exam (${organizedQuiz.length} Questions)`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="w-full py-2 text-xs font-mono text-slate-400 hover:text-white transition text-center cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
