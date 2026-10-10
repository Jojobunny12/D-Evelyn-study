export interface DeducedCourseInfo {
  code: string;
  name: string;
  department: 'English' | 'Social Studies' | 'Foreign Language' | 'Mathematics' | 'Science' | 'Fine Arts' | 'Electives';
  description: string;
  curriculumDetails: string;
  examFocus: string;
  studyStrategy: string;
}

export function deduceCourse(inputCode: string): DeducedCourseInfo {
  const code = (inputCode || "").trim();
  const upper = code.toUpperCase();
  
  // Default values
  let department: DeducedCourseInfo['department'] = 'Electives';
  let name = "";
  let description = "";
  let curriculumDetails = "";
  let examFocus = "";
  let studyStrategy = "";

  // 1. Check SCED prefix (the first two digits representing standard high school subject categories)
  let scedSubject = "";
  if (/^\d{2}/.test(upper)) {
    scedSubject = upper.substring(0, 2);
  }

  const hasWord = (word: string) => upper.includes(word);
  const hasAnyWord = (words: string[]) => words.some(word => upper.includes(word));

  // MATHEMATICS
  if (
    scedSubject === "02" ||
    hasAnyWord(["ALG", "CALC", "TRIG", "GEOM", "MATH", "STAT", "ALGEBRA", "CALCULUS", "GEOMETRY", "TRIGONOMETRY", "STATISTICS", "PRECALC", "PROBABILITY", "MATH_"])
  ) {
    department = "Mathematics";
    if (hasWord("ALG") || hasWord("ALGEBRA")) {
      const isNum3 = hasWord("3") || hasWord("III");
      const isNum2 = hasWord("2") || hasWord("II") || hasWord("02056");
      name = `Algebra ${isNum3 ? "III" : isNum2 ? "II" : "I"}`;
    } else if (hasWord("CALC") || hasWord("CALCULUS")) {
      name = hasWord("BC") ? "Calculus BC" : "Calculus AB";
    } else if (hasWord("TRIG") || hasWord("TRIGONOMETRY")) {
      name = "Trigonometry";
    } else if (hasWord("GEOM") || hasWord("GEOMETRY")) {
      name = "Geometry";
    } else if (hasWord("STAT") || hasWord("STATISTICS")) {
      name = "Statistics";
    } else if (hasWord("PRECALC") || hasWord("PRE CALCULUS") || hasWord("PRE-CALC")) {
      name = "Precalculus";
    } else {
      name = "Mathematics";
    }

    description = `A comprehensive high school ${name} course designed to build mathematical reasoning, formal analytical problem solving, and algebraic fluency.`;
    curriculumDetails = "Axiomatic frameworks, rigorous equation solving, parameter transformations, proof structures, and computational accuracy.";
    examFocus = "Step-by-step problem layout, verifying restrictions, precise algebraic simplifications, and graphing key boundaries.";
    studyStrategy = "Solve target practice problems, verify your steps with active diagnostics, read cheat sheets for core formulas, and keep variables aligned.";
  }
  // SCIENCE
  else if (
    scedSubject === "03" ||
    hasAnyWord(["CHEM", "PHYS", "BIO", "SCI", "CHEMISTRY", "PHYSICS", "BIOLOGY", "SCIENCE", "ASTRONOMY", "GEOLOGY", "ECOLOGY", "ANATOMY", "PHYSIOLOGY", "ENVSCI", "EARTH", "COSMO"])
  ) {
    department = "Science";
    if (hasWord("CHEM") || hasWord("CHEMISTRY")) {
      name = "Chemistry";
    } else if (hasWord("PHYS") || hasWord("PHYSICS")) {
      name = "Physics";
    } else if (hasWord("BIO") || hasWord("BIOLOGY")) {
      name = "Biology";
    } else if (hasWord("ENV") || hasWord("ECOLOGY") || hasWord("EARTH")) {
      name = "Environmental Science";
    } else if (hasWord("ANAT") || hasWord("PHYSIOLOGY")) {
      name = "Anatomy & Physiology";
    } else if (hasWord("ASTRO") || hasWord("COSMO")) {
      name = "Astronomy";
    } else {
      name = "Science";
    }

    description = `An intensive, inquiry-driven high school study of ${name} principles, quantitative laboratory equations, and structural material balances.`;
    curriculumDetails = "Stoichiometric calculations, dimensional analysis, reaction mechanisms, biochemical systems, laws of motion, conservation principles, and empirical research modeling.";
    examFocus = "Unit conversions, diagram annotations, Le Chatelier shifts, formula balancing, and rigorous short-answer reasoning justifications.";
    studyStrategy = "Draft process diagrams from memory, track variable units through all stoichiometric equations, review structural constants, and practice diagnostic exams.";
  }
  // SOCIAL STUDIES / HISTORY
  else if (
    scedSubject === "04" ||
    hasAnyWord(["HIST", "CIV", "GOV", "EURO", "APUSH", "US_HIST", "WHIST", "ECON", "PSYCH", "SOC", "HISTORY", "CIVICS", "GOVERNMENT", "EUROPEAN", "GEOGRAPHY", "SOCIOLOGY", "PSYCHOLOGY", "HUMANITIES"])
  ) {
    department = "Social Studies";
    if (hasWord("APUSH") || hasWord("US_HIST") || hasWord("AMER") || hasWord("U.S.") || hasWord("USA")) {
      name = "United States History";
    } else if (hasWord("EURO")) {
      name = "European History";
    } else if (hasWord("WORLD") || hasWord("WHIST")) {
      name = "World History";
    } else if (hasWord("CIV") || hasWord("CIVICS")) {
      name = "Civics";
    } else if (hasWord("GOV") || hasWord("CONSTITUTION")) {
      name = "Government & Politics";
    } else if (hasWord("ECON")) {
      name = "Economics";
    } else if (hasWord("PSYCH")) {
      name = "Psychology";
    } else if (hasWord("GEOG") || hasWord("GEOGRAPHY")) {
      name = "Geography";
    } else {
      name = "Social Studies";
    }

    description = `A rigorous thematic investigation of ${name}, tracking intellectual, socioeconomic, administrative, and spatial conflicts across historical eras.`;
    curriculumDetails = "Primary source analysis, argument development, geopolitical power balances, socio-economic trends, institutional treaties, and chronological timeline reviews.";
    examFocus = "Interpreting historical documents, comparing ideological schools of thought, causal argumentation, and structured short-essay responses.";
    studyStrategy = "Align major historical conflicts on visual timelines, match conceptual manifestos directly to their philosophical authors, and write quick essay outlines.";
  }
  // ENGLISH / LITERATURE
  else if (
    scedSubject === "01" ||
    hasAnyWord(["ENG", "LIT", "COMP", "WRIT", "JOURN", "ENGLISH", "LITERATURE", "WRITING", "COMPOSITION", "RHETORIC"])
  ) {
    department = "English";
    if (hasWord("COMP") || hasWord("WRIT") || hasWord("WRITING") || hasWord("COMPOSITION")) {
      name = "Composition & Rhetoric";
    } else if (hasWord("LIT") || hasWord("LITERATURE")) {
      name = "Literature";
    } else if (hasWord("JOURN")) {
      name = "Journalism";
    } else {
      name = "English Language Arts";
    }

    description = `An advanced, critical reading and analytical composition course focused on deconstructing literature, analyzing rhetoric, and mastering style syntax.`;
    curriculumDetails = "Ethos, pathos, logos, syntax mechanisms, essay patterns, literary terms, reading comprehension, and structured comparative critiques.";
    examFocus = "Rhetorical device identification, reading passage annotations, comparative theme matching, and timed source-argument synthesis essays.";
    studyStrategy = "Annotate sample prompts, rehearse thesis designs under 5-minute constraints, memorize target rhetorical devices, and polish comma punctuation guidelines.";
  }
  // FOREIGN / WORLD LANGUAGES
  else if (
    scedSubject === "06" || upper.startsWith("24") ||
    hasAnyWord(["SPAN", "LAT", "FREN", "GERM", "CHIN", "JAPN", "LANG", "SPANISH", "LATIN", "FRENCH", "GERMAN", "CHINESE", "MANDARIN", "ITALIAN", "PORTUGUESE", "RUSSIAN"])
  ) {
    department = "Foreign Language";
    if (hasWord("SPAN") || hasWord("SPANISH")) {
      name = "Spanish";
    } else if (hasWord("LAT") || hasWord("LATIN")) {
      name = "Latin";
    } else if (hasWord("FREN") || hasWord("FRENCH")) {
      name = "French";
    } else if (hasWord("GERM") || hasWord("GERMAN")) {
      name = "German";
    } else if (hasWord("CHIN") || hasWord("CHINESE") || hasWord("MAND")) {
      name = "Chinese";
    } else {
      name = "World Language";
    }

    description = `An immersive modern and classical language program of ${name} focusing on verb morphological conjugation, syntactic translation, and structural comprehension.`;
    curriculumDetails = "Grammar declensions, verb mood and tense conjugations, syntax parsing, cultural context, and direct vocabulary translation rules.";
    examFocus = "Declension identification matrices, matching terms across vocabulary prompts, parsing multi-clause subjunctive phrases, and active reading translation.";
    studyStrategy = "Recite conjugation and declension ending charts recursively, build direct vocabulary recall pairs, and annotate grammar rules.";
  }
  // FINE AND PERFORMING ARTS (e.g. Photography 1, Art, Drama, Music)
  else if (
    scedSubject === "05" ||
    hasAnyWord(["PHOTO", "ART", "DRAW", "PAINT", "CERAM", "MUSE", "BAND", "CHOIR", "THEAT", "DRAMA", "GRAPH", "DSGN", "DESIGN", "PHOTOGRAPHY", "SCULPTURE", "CERAMICS", "ORCHESTRA", "ACTING", "DANCE"])
  ) {
    department = "Fine Arts";
    if (hasWord("PHOTO") || hasWord("PHOTOGRAPHY")) {
      name = "Photography";
    } else if (hasWord("DRAW") || hasWord("PAINT") || hasWord("ART")) {
      name = "Visual Arts";
    } else if (hasWord("CERAM") || hasWord("SCULPTURE") || hasWord("CERAMICS")) {
      name = "Ceramics & Sculpture";
    } else if (hasWord("BAND") || hasWord("MUSE") || hasWord("ORCHESTRA") || hasWord("MUSIC")) {
      name = "Instrumental Music";
    } else if (hasWord("CHOIR") || hasWord("VOCAL")) {
      name = "Vocal Music";
    } else if (hasWord("THEAT") || hasWord("DRAMA") || hasWord("ACTING")) {
      name = "Theater & Drama";
    } else if (hasWord("GRAPH") || hasWord("DSGN") || hasWord("DESIGN")) {
      name = "Graphic Design";
    } else {
      name = "Fine Arts";
    }

    description = `A rich, critique-driven and practical study of ${name} principles, aesthetic design matrices, structural forms, and physical compositions.`;
    curriculumDetails = "Aperture ratios, ISO exposure variables, shutter boundaries, color theories, spatial alignment rules, rule of thirds, medium-specific techniques, design principles, and historical critique models.";
    examFocus = "Matching technical descriptors (such as ISO speed, depth of field), analyzing structural compositions, critiquing artwork formats, and identifying historical art design phases.";
    studyStrategy = "Assemble a visual study sheet of design components, memorize exact sensor or speed multipliers, and review critiquing frameworks.";
  }
  // ELECTIVES / COMPUTER SCIENCE
  else {
    department = "Electives";
    if (scedSubject === "10" || hasAnyWord(["10157", "CS", "COMP", "PROGRAM", "CODING", "PYTHON", "JAVA", "HTML", "SOFTWARE"])) {
      if (hasAnyWord(["10157", "10157H05012", "CS_COMP_SCI"])) {
        name = "AP Computer Science A";
      } else {
        name = "Computer Science";
      }
      description = "An advanced college-prep study of algorithmic computing, programming logic, data structures, and structural software designs in Java.";
      curriculumDetails = "Variables, primitive types, conditional operators, iteration loops, classes and objects, standard 1D and 2D arrays, inheritance hierarchies, and recursive algorithms.";
      examFocus = "Single-line array trace tracing, nested loop output diagnostics, object inheritance parameter passing, and writing clean structural function bodies.";
      studyStrategy = "Trace variable values using standard state charts. Draw recurrence trees for recursive methods, and practice writing clean Java loop controls under AP time bounds.";
    } else if (hasAnyWord(["BUS", "FIN", "MARK", "BUSINESS", "MARKETING", "FINANCE", "ACCOUNT"])) {
      name = "Business & Finance";
      description = "A practical high school course in financial literacy, commercial markets, operational accounting, and economic systems.";
      curriculumDetails = "Asset calculations, compound interests, basic ledgers, market trends, supply/demand curves, and budget models.";
      examFocus = "Reconciling balances, solving rate multipliers, applying market graphs, and answering corporate policy scenarios.";
      studyStrategy = "Formulate compound interest checks on sample ledgers, practice balance sheet equations, and map market curves.";
    } else if (hasAnyWord(["PE", "GYM", "HEALTH", "NUTRITION", "SPORTS"])) {
      name = "Health & Wellness";
      description = "An active study of physical education parameters, nutritional safety limits, anatomy structures, and aggregate health metrics.";
      curriculumDetails = "Safety protocols, physiological reactions, dietary charts, and healthy habit strategies.";
      examFocus = "Matching bone and muscle systems, explaining dietary rules, identifying aerobic vs. anaerobic boundaries.";
      studyStrategy = "Label body diagrams, categorize nutritional factors, and memorize exercise guidelines.";
    } else {
      // General fallbacks if nothing matches
      name = inputCode.length <= 15 ? inputCode : "Academic Elective";
      description = `A cumulative high school course focused on structured research, cognitive skill building, and thematic problem solving in ${name}.`;
      curriculumDetails = "Axiomatic frameworks, rigorous concept maps, step-by-step reasoning structures, and technical terminology mastery.";
      examFocus = "Technical matching questions, short essay analytical proofs, and rigorous data-interpretation blocks.";
      studyStrategy = "Deconstruct historical concepts, outline major structures, and review active recall diagnostics recursively.";
    }
  }

  // 3. Level additions (Honors, AP, IB)
  const isAP = hasWord("AP") || hasWord("ADVANCED PLACEMENT") || (scedSubject === "05" && upper.includes("A")) || upper.endsWith("AP") || upper.startsWith("AP");
  const isHonors = hasWord("HONORS") || hasWord("HONOR") || hasWord("HON") || (scedSubject !== "" && upper.charAt(5) === "H") || upper.endsWith("H") || upper.startsWith("H");
  const isIB = hasWord("IB") || hasWord("INTERNATIONAL BACCALAUREATE") || upper.startsWith("IB") || upper.endsWith("IB");

  let finalName = name;
  if (isAP && !finalName.startsWith("AP")) {
    finalName = "AP " + finalName;
  } else if (isIB && !finalName.startsWith("IB")) {
    finalName = "IB " + finalName;
  } else if (isHonors && !finalName.includes("Honors")) {
    finalName = finalName + " Honors";
  }

  // Append a structural number if found in user's string
  const numRegex = /\b(1|2|3|4|I|II|III|IV)\b/;
  const match = upper.match(numRegex);
  if (match && !finalName.includes(match[1]) && finalName !== "Calculus BC" && finalName !== "Calculus AB") {
    finalName = finalName + " " + match[1];
  }

  return {
    code: inputCode,
    name: finalName,
    department,
    description,
    curriculumDetails,
    examFocus,
    studyStrategy
  };
}
