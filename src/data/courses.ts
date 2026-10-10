export interface Course {
  code: string;
  name: string;
  department: 'English' | 'Social Studies' | 'Foreign Language' | 'Mathematics' | 'Science' | 'Fine Arts' | 'Electives';
  description: string;
  curriculumDetails: string;
  examFocus: string;
  studyStrategy: string;
}

export const PRESET_COURSES: Course[] = [
  {
    code: "ENG09",
    name: "Literature & Composition 9",
    department: 'English',
    description: "Classic foundations in epic poetry, drama, and analytical essay writing. Explores archetypes, grammatical precision, and structured arguments.",
    curriculumDetails: "Deep reading of Homer's 'The Odyssey', Shakespeare's 'Romeo and Juliet', and classic novels. Strong focus on sentence diagramming and structured 5-paragraph analytical compositions.",
    examFocus: "Comprehensive literary term matching, detailed reading comprehension passage analyses, and a timed multi-source analytical essay on epic themes.",
    studyStrategy: "Synthesize themes from epic journeys, memorize core Greek and Roman myth archetypes, and review sentence patterns and comma splice rules."
  },
  {
    code: "ENG10",
    name: "Literature & Composition 10",
    department: 'English',
    description: "World Literature focusing on the evolution of moral dilemmas, classical tragedy, and advanced rhetorical devices across cultures.",
    curriculumDetails: "Studies of Sophocles' Antigone, Shakespeare's Julius Caesar, Dante's Inferno (excerpt selections), and European realism.",
    examFocus: "Rhetorical device identification, Dante's cantos identification, passage close reading, and a persuasive rhetorical essay.",
    studyStrategy: "Create concept maps tracing moral pathways in Tragedy. Practice outlining thesis statements for complex prompt scenarios in under 10 minutes."
  },
  {
    code: "ENG11",
    name: "American Literature & Composition 11",
    department: 'English',
    description: "An intensive study of American thought, transcendentalism, realism, and modernism, tracing the American Dream and its critiques.",
    curriculumDetails: "The Scarlet Letter, essays by Emerson and Thoreau, The Great Gatsby, poetry of Dickinson and Whitman, and modern American plays.",
    examFocus: "Historical-literary contextual matching, rhetoric analysis of primary political files, and a high-stakes thematic comparison essay.",
    studyStrategy: "Track the evolution of the 'American Self' across historical periods. Focus on linking literary styles directly to historical anxieties."
  },
  {
    code: "ENG_AP_LANG",
    name: "AP English Language & Composition",
    department: 'English',
    description: "College-level rhetoric course specializing in non-fiction argumentation, synthesis, and rhetorical analysis of historical speeches.",
    curriculumDetails: "A rigorous exploration of classical rhetoric (ethos, pathos, logos), argument structure (Toulmin/Rogerian models), and stylistic syntax analysis.",
    examFocus: "45 multiple-choice questions testing rhetorical reading, and three timed essays (Synthesis, Rhetorical Analysis, Argumentation).",
    studyStrategy: "Deconstruct past AP prompts. Write thesis statements backed by standard evidence matrices. Memorize 30 key rhetorical strategies."
  },
  {
    code: "CIV09",
    name: "Eastern Civilization",
    department: 'Social Studies',
    description: "Foundational freshman history course. A thorough historical survey of civilizations in Asia, Africa, and the Middle East.",
    curriculumDetails: "Covers ancient Mesopotamia, Indus Valley, dynastic Chinese philosophy (Confucianism, Daoism, Legalism), the rise of Islam, and African kingdoms.",
    examFocus: "Large-scale map identifications, chronological sequencing, core philosophical matching, and comparative short-response questions.",
    studyStrategy: "Build visual flashcards for dynastic timelines and religious paradigms. Focus heavily on comparing political structures across ancient river valleys."
  },
  {
    code: "CIV10",
    name: "Western Civilization",
    department: 'Social Studies',
    description: "A highly rigorous, hallmark sophomore survey of the history and philosophical values of Western Civilization from Greece to the modern era.",
    curriculumDetails: "Greco-Roman philosophy, the evolution of Christian Europe, Feudalism, the Scientific Revolution, Enlightenment, and the major wars of the 20th century.",
    examFocus: "Demanding Primary Source document-based analysis, extensive matching of philosophers to their texts, and an intensive historical essay.",
    studyStrategy: "Standard honors history demands dates and specific causal chains. Review your lecture notes recursively. Memorize the major intellectual shifts from Scholasticism to secular Humanism."
  },
  {
    code: "HIST11",
    name: "United States History",
    department: 'Social Studies',
    description: "A comprehensive investigation of American political, social, and economic developments from pre-Columbian times to the late 20th century.",
    curriculumDetails: "Constitutional principles, sectionalism, Civil War, Industrialization, Progressive Era, Cold War, and modern civil rights struggles.",
    examFocus: "Detailed factual multiple-choice questions, chronological alignment matrices, and a major prompt-based essay.",
    studyStrategy: "Study the development of Federal power vs. States' rights. Outline major legislative packages and Supreme Court decisions chronologically."
  },
  {
    code: "AP_EURO",
    name: "AP European History",
    department: 'Social Studies',
    description: "Advanced study of European history from 1450 to the present, focusing on cultural, diplomatic, economic, and social themes.",
    curriculumDetails: "Renaissance, Reformation, Absolutism, French Revolution, Industrialization, Imperialism, World Wars, and the European Union.",
    examFocus: "Stimulus-based multiple choice, short-answer questions (SAQs), document-based question (DBQ), and a long essay question (LEQ).",
    studyStrategy: "Practice the DBQ format under rigid time constraints. Focus on sourcing (HIPP analysis) for at least four documents per essay."
  },
  {
    code: "LATIN_I",
    name: "Classical Latin I",
    department: 'Foreign Language',
    description: "Foundational classical language course focusing on Wheelock's grammar, morphology, vocabulary, and direct translation.",
    curriculumDetails: "Noun declensions (1st-3rd), verb conjugations (1st-4th) in active indicative tenses, basic syntax, and mythology readings.",
    examFocus: "Strict vocabulary recall, noun-adjective agreement conjugation matrices, and translating complex multi-clause sentences from Latin to English.",
    studyStrategy: "Recite declension and conjugation endings daily. Write out the grammatical 'identity card' (case, number, gender) for every noun in practice tests."
  },
  {
    code: "LATIN_II",
    name: "Classical Latin II",
    department: 'Foreign Language',
    description: "Intensive classical language instruction introducing complex subjunctive moods, participles, and intermediate historical translations.",
    curriculumDetails: "Wheelock's Chapters 20-40. Focus on indirect statements, subjunctive mood clauses (cum, purpose, result), and Caesar's campaign texts.",
    examFocus: "Parsing subjunctive verbs, identifying complex clauses, and a prolonged diagnostic translation passage (no dictionaries).",
    studyStrategy: "Create conditional logic tables for subjunctive clauses. Understand the distinct marker words that trigger indirect commands vs. result clauses."
  },
  {
    code: "LATIN_IV_AP",
    name: "AP Latin (Vergil & Caesar)",
    department: 'Foreign Language',
    description: "College-level translation and poetic analysis focusing on Vergil's Aeneid and Caesar's De Bello Gallico.",
    curriculumDetails: "Grammar review, Latin dactylic hexameter scansion, stylistic figures of speech, and political/philosophical themes of Roman expansion.",
    examFocus: "Sight translation passages, poetic scansion, short-answer essay questions analyzing textual intent, and thematic essays aligning Vergil and Caesar.",
    studyStrategy: "Memorize major high-frequency vocabulary. Practice scanning lines of epic poetry. Maintain a running spreadsheet of figures of speech (chiasmus, litotes, asyndeton)."
  },
  {
    code: "MATH_GEOM",
    name: "Euclidean Proof-Based Geometry",
    department: 'Mathematics',
    description: "A historically demanding, traditional proof-based course. Focuses on logical reasoning, axiomatic structures, and spatial relationships.",
    curriculumDetails: "Postulates, Euclidean axioms, congruent triangles, polygon proofs, circle geometry, trigonometry basics, and coordinate geometry proofs.",
    examFocus: "Requires writing multiple 2-column formal geometric proofs from scratch (representing 40% of standard points), alongside computational problems.",
    studyStrategy: "Maintain an 'Axiom & Theorem' cheat sheet. Never assume a geometric property is true because it looks correct in the diagram; every statement requires a deductive warrant."
  },
  {
    code: "MATH_ALG2",
    name: "Algebra II & Trigonometry",
    department: 'Mathematics',
    description: "Rigorous study of polynomial, exponential, logarithmic, and trigonometric functions with focus on algebraic manipulation and graphing.",
    curriculumDetails: "Complex numbers, quadratic equations, matrix mathematics, conic sections, unit circle trigonometry, and sequence/series formulas.",
    examFocus: "Extended multi-step algebraic solving, graphing conic sections from equations, and proofs of basic trigonometric identities.",
    studyStrategy: "Understand the visual shifts of graphs when parameters are adjusted. Do not just memorize recipes; know why logarithms are inverses of exponents."
  },
  {
    code: "MATH_AP_CALC_AB",
    name: "AP Calculus AB",
    department: 'Mathematics',
    description: "College-level study of single-variable limits, derivatives, integrals, and their real-world physical and geometric applications.",
    curriculumDetails: "Limits, derivative rules, Mean Value Theorem, optimization, Riemann sums, Fundamental Theorem of Calculus, and volume of solids of revolution.",
    examFocus: "AP format: Section I (Multiple Choice - calculator and non-calculator) and Section II (Free Response Questions - FRQs requiring absolute steps).",
    studyStrategy: "Focus on presenting logical steps in FRQs. Show coordinates, indicate variables, write the integral, and state structural units. AP graders give zero credit if intermediate math is omitted."
  },
  {
    code: "SCI_CHEM",
    name: "Rigorous Honors Chemistry",
    department: 'Science',
    description: "A legendary sophomore chemistry course, highly respected for analytical rigor, strict mathematical stoichiometric balancing, and lab accuracy.",
    curriculumDetails: "Stoichiometry, limiting reactants, gas actions, thermodynamics, modern atomic state configurations, aqueous solutions, and chemical equilibrium equations.",
    examFocus: "Highly quantitative multiple choice, complex limiting reagent math without a calculator, and a deep data-interpretation multi-step solving block.",
    studyStrategy: "Honors Chem requires incredible unit-analysis discipline. Write out full dimensional analysis tracks for stoichiometry. Ensure your significant figures are absolutely precise on every single final calculation."
  },
  {
    code: "SCI_BIO",
    name: "Standard Honors Biology",
    department: 'Science',
    description: "An intensive overview of living systems, biochemistry, heredity, and evolutionary biology using analytical inquiry methods.",
    curriculumDetails: "Cellular respiration and photosynthesis biochemical loops, DNA transcription/translation mechanics, classic genetics, and ecosystem dynamics.",
    examFocus: "Diagram labelings, complex biochemical process sequencing, pedigree charts, and reasoning essays based on experimental lab models.",
    studyStrategy: "Draw out the Krebs cycle and light reactions by hand. Focus on understanding pathways logically rather than just memorizing vocabulary labels."
  },
  {
    code: "AP_CHEM",
    name: "AP Chemistry",
    department: 'Science',
    description: "Double-period equivalent college chemistry focusing on kinetics, gas equilibria, acid-base chemistry, and classical thermodynamics.",
    curriculumDetails: "Spectroscopy, kinetics reaction mechanisms, Le Chatelier's shifts, buffer systems, Henderson-Hasselbalch applications, entropy/free energy, and electrochemistry.",
    examFocus: "Rigorous AP Chem multiple-choice catalog and 7 long-form analytical Free Response Questions.",
    studyStrategy: "Practice buffer pH solving and electrochemistry cell notation. Work through AP FRQs from past years with a countdown timer."
  },
  {
    code: "02064H05022",
    name: "Algebra III Honors",
    department: 'Mathematics',
    description: "Immersive study of functions, analytic trigonometry, conic section geometries, and discrete sequences with hardcore university preparation focus.",
    curriculumDetails: "Deep matrices operation, root theorem calculations, advanced rational expressions, unit circles, trigonometric double-angle analytic proofs, and logarithmic systems.",
    examFocus: "Traditional cumulative honors diagnostics: solving non-calculator trigonometric roots, finding standard form of conics, and inverse function properties.",
    studyStrategy: "Recite identities hourly. Convert logarithmic roots meticulously. Review matrix determinant formula patterns to bypass grade standard deviation drops."
  },
  {
    code: "SCI_CHEM_H",
    name: "Chemistry Honors",
    department: 'Science',
    description: "An intensive honors-level chemistry syllabus delving into atomic structures, chemical equilibria, reaction stoichiometry, and acid-base thermodynamics.",
    curriculumDetails: "Stoichiometry moles, limiting reactants, molecular gas constants, electron arrangements, chemical bonding models, and equilibrium formulas.",
    examFocus: "Comprehensive reaction balancing, dimensional analysis calculations without calculator, gas laws, and VSEPR molecular geometry charts.",
    studyStrategy: "Practice unit cancellations via dimensional analysis method. Draw Lewis structures for ionic and covalent bonds. Practice redox equation balance steps."
  },
  {
    code: "ARTS_PHOTO",
    name: "Photography I",
    department: 'Fine Arts',
    description: "An introduction to the aesthetic and technical fundamentals of digital photography, manual camera settings, and creative compositions.",
    curriculumDetails: "Foundations of light, exposure triangle (Aperture, Shutter Speed, ISO), camera formats, depth of field compression, and historical artistic themes.",
    examFocus: "Exposure triangle calculations, shutter speed action-freeze questions, depth of field differences under various f-stops, and rule of thirds visual alignment critiques.",
    studyStrategy: "Sketch the exposure triangle. Memorize common f-stops (f/1.8 to f/22) and their bokeh results, and practice critiquing composition formats."
  },
  {
    code: "10157H05012",
    name: "AP Computer Science A",
    department: 'Electives',
    description: "Official D'Evelyn High School AP Computer Science A syllabus covering object-oriented programming, standard Java algorithms, array structures, and recursion.",
    curriculumDetails: "Java primitive types, reference types, Boolean expressions, control flow, Writing classes, 1D/2D arrays, Arraylists, Inheritance, and Recursion.",
    examFocus: "Tricky loop traces, 2D array matrix logic, object inheritance behavior, polymorphism, and writing AP-style free response functions.",
    studyStrategy: "Trace variable state tables line-by-line, practice AP Java FRQs without an IDE, and memorize standard search/sort algorithm loops."
  },
  {
    code: "CS_COMP_SCI",
    name: "AP Computer Science A",
    department: 'Electives',
    description: "A college-level introductory computer science syllabus covering object-oriented programming, logical control flows, and core algorithm designs in Java.",
    curriculumDetails: "Variables, primitive types, conditional operators, iteration loops, classes and objects, standard 1D and 2D arrays, inheritance hierarchies, and recursive algorithms.",
    examFocus: "Single-line array trace tracing, nested loop output diagnostics, object inheritance parameter passing, and writing clean structural function bodies.",
    studyStrategy: "Trace variable values using standard state charts. Draw recurrence trees for recursive methods, and practice writing clean Java loop controls under AP time bounds."
  }
];
