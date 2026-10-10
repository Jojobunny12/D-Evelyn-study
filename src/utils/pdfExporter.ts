import { jsPDF } from "jspdf";
import { QuizQuestion, StudyDeck } from "../types";

export interface PdfExportOptions {
  includeAnswerKey?: boolean;
  includeBubbleSheet?: boolean;
  includeExplanations?: boolean;
}

export function generateMockExamPdf(
  deck: StudyDeck,
  questions: QuizQuestion[],
  options: PdfExportOptions = {}
): jsPDF {
  const {
    includeAnswerKey = true,
    includeBubbleSheet = true,
    includeExplanations = true,
  } = options;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter", // 612 x 792 pt
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const totalQuestions = questions.length;
  const estimatedTime = Math.max(30, Math.round(totalQuestions * 1.5));

  // Helper for adding new page with header
  const checkAddPage = (requiredSpace: number) => {
    if (y + requiredSpace > pageHeight - margin - 20) {
      doc.addPage();
      y = margin;
      drawRunningHeader();
    }
  };

  const drawRunningHeader = () => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(130, 140, 155);
    doc.text(
      `${deck.courseName || deck.courseCode} — Cumulative Mock Final Exam (${totalQuestions} Questions)`,
      margin,
      25
    );
    doc.text(
      `Course Code: ${deck.courseCode}`,
      pageWidth - margin,
      25,
      { align: "right" }
    );
    doc.setDrawColor(220, 225, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, 28, pageWidth - margin, 28);
    y = Math.max(y, 45);
  };

  // ==========================================
  // 1. FIRST PAGE: OFFICIAL EXAM COVER / HEADER
  // ==========================================
  // Header badge
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 38, 4, 4, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("STANDARDIZED CUMULATIVE HIGH SCHOOL FINAL EXAMINATION", margin + 12, y + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(
    `Official Syllabus Aligned • Total Items: ${totalQuestions} Questions • Time Allowed: ${estimatedTime} Minutes`,
    margin + 12,
    y + 29
  );

  y += 50;

  // Course Details Box
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 48, 4, 4, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(deck.courseName || `Course ${deck.courseCode}`, margin + 12, y + 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Course Code: ${deck.courseCode}  |  School: ${deck.schoolName || "D'Evelyn High School / Academic Prep"}`,
    margin + 12,
    y + 32
  );
  doc.text(
    `Exam Format: Section I (${totalQuestions} Multiple Choice Items) • Active Retrieval Standard`,
    margin + 12,
    y + 42
  );

  y += 56;

  // Student Info Inputs Box
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.75);
  doc.rect(margin, y, contentWidth, 36);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);

  // Student Name
  doc.text("STUDENT FULL NAME:", margin + 8, y + 14);
  doc.setDrawColor(203, 213, 225);
  doc.line(margin + 110, y + 16, margin + 290, y + 16);

  // Date
  doc.text("DATE:", margin + 305, y + 14);
  doc.line(margin + 335, y + 16, margin + 410, y + 16);

  // Period
  doc.text("PERIOD:", margin + 425, y + 14);
  doc.line(margin + 465, y + 16, margin + contentWidth - 10, y + 16);

  // Score Box line
  doc.text("RAW SCORE: ________ / " + totalQuestions, margin + 8, y + 29);
  doc.text("PERCENTAGE GRADE: ________ %", margin + 180, y + 29);
  doc.text("LETTER GRADE: ________", margin + 370, y + 29);

  y += 46;

  // Instructions
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text("GENERAL EXAMINATION INSTRUCTIONS:", margin, y);
  y += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const instructions = [
    `1. This exam booklet contains ${totalQuestions} multiple-choice items designed to assess comprehensive subject mastery.`,
    `2. Read each question carefully and select the single best answer from the four options (A, B, C, or D).`,
    `3. Write all scratch work clearly in the margins. Only designated choices recorded on the answer grid will be scored.`,
    `4. Pacing Recommendation: Allocate approximately 75 to 90 seconds per question. Answer all questions—there is no penalty for guessing.`,
  ];
  instructions.forEach((line) => {
    doc.text(line, margin + 4, y);
    y += 11;
  });

  y += 8;

  // Optional Bubble Sheet on Page 1 if totalQuestions <= 50
  if (includeBubbleSheet && totalQuestions <= 50) {
    checkAddPage(60);
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, contentWidth, totalQuestions > 25 ? 54 : 32, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text("QUICK STUDENT ANSWER GRID:", margin + 8, y + 12);

    const cols = totalQuestions > 25 ? 25 : totalQuestions;
    const itemWidth = (contentWidth - 16) / cols;

    // First row (1 to 25)
    for (let i = 0; i < Math.min(25, totalQuestions); i++) {
      const qNum = i + 1;
      const xPos = margin + 8 + i * itemWidth;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`${qNum}`, xPos + itemWidth / 2, y + 21, { align: "center" });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(30, 41, 59);
      doc.text("[   ]", xPos + itemWidth / 2, y + 28, { align: "center" });
    }

    // Second row (26 to 50 if applicable)
    if (totalQuestions > 25) {
      for (let i = 25; i < totalQuestions; i++) {
        const qNum = i + 1;
        const xPos = margin + 8 + (i - 25) * itemWidth;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`${qNum}`, xPos + itemWidth / 2, y + 38, { align: "center" });
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(30, 41, 59);
        doc.text("[   ]", xPos + itemWidth / 2, y + 46, { align: "center" });
      }
      y += 58;
    } else {
      y += 36;
    }
  }

  // Divider before questions
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(1.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 16;

  // ==========================================
  // 2. SECTION I: ALL EXAM QUESTIONS
  // ==========================================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`SECTION I: MULTIPLE-CHOICE QUESTIONS (1 – ${totalQuestions})`, margin, y);
  y += 16;

  questions.forEach((q, idx) => {
    const qNum = idx + 1;
    
    // Clean prompt
    let promptClean = q.question.trim();
    // Strip redundant leading [Q1], Question 1: etc if present
    promptClean = promptClean.replace(/^(\[?Q\d+\]?|Question\s*\d+:?)\s*/i, "").trim();

    // Prepare question text with bold prefix
    const qHeader = `Question ${qNum}. `;
    
    // Calculate required space for question + 4 options
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const splitPrompt = doc.splitTextToSize(promptClean, contentWidth - 30);
    const estimatedHeight = splitPrompt.length * 12 + q.options.length * 13 + 24;

    checkAddPage(estimatedHeight);

    // Question numbering badge / container
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y - 2, contentWidth, splitPrompt.length * 12 + 6, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(qHeader, margin + 6, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    
    // Print prompt lines
    doc.text(splitPrompt, margin + 68, y + 8);
    y += splitPrompt.length * 12 + 10;

    // Print options
    q.options.forEach((opt, optIdx) => {
      let optText = opt.trim();
      const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
      // Clean option prefix if already starts with A), (A), etc.
      optText = optText.replace(/^[A-D][\).\s\-:]+\s*/i, "").trim();

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`(${letter})`, margin + 20, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);

      const splitOpt = doc.splitTextToSize(optText, contentWidth - 55);
      doc.text(splitOpt, margin + 40, y);
      y += Math.max(12, splitOpt.length * 11);
    });

    y += 10; // Spacing between questions
  });

  // ==========================================
  // 3. ANSWER KEY & PEDAGOGICAL EXPLANATIONS
  // ==========================================
  if (includeAnswerKey) {
    doc.addPage();
    y = margin;

    // Header banner for Solutions
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(margin, y, contentWidth, 34, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("SECTION II: OFFICIAL ANSWER KEY & STEP-BY-STEP EXPLANATIONS", margin + 12, y + 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225);
    doc.text(
      `Grading Rubric & Full Analytical Solutions for All ${totalQuestions} Items`,
      margin + 12,
      y + 26
    );

    y += 46;

    // Compact Summary Matrix of Answers
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text("1. RAPID SCORING KEY:", margin, y);
    y += 12;

    const rowItems = totalQuestions > 25 ? 25 : totalQuestions;
    const colWidth = contentWidth / rowItems;

    // Row 1 (1 to 25)
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, contentWidth, 24, "FD");

    for (let i = 0; i < Math.min(25, totalQuestions); i++) {
      const q = questions[i];
      const correctLetter = String.fromCharCode(65 + q.correctIndex);
      const xPos = margin + i * colWidth;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Q${i + 1}`, xPos + colWidth / 2, y + 8, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(16, 185, 129); // emerald-600
      doc.text(correctLetter, xPos + colWidth / 2, y + 19, { align: "center" });
    }
    y += 28;

    // Row 2 (26 to 50 if applicable)
    if (totalQuestions > 25) {
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 24, "FD");

      for (let i = 25; i < totalQuestions; i++) {
        const q = questions[i];
        const correctLetter = String.fromCharCode(65 + q.correctIndex);
        const xPos = margin + (i - 25) * colWidth;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`Q${i + 1}`, xPos + colWidth / 2, y + 8, { align: "center" });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(16, 185, 129);
        doc.text(correctLetter, xPos + colWidth / 2, y + 19, { align: "center" });
      }
      y += 32;
    }

    y += 10;

    // Detailed Explanations
    if (includeExplanations) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text("2. DETAILED QUESTION RATIONALE & STEP-BY-STEP PROOFS:", margin, y);
      y += 14;

      questions.forEach((q, idx) => {
        const qNum = idx + 1;
        const correctLetter = String.fromCharCode(65 + q.correctIndex);
        const correctOptionRaw = q.options[q.correctIndex] || "";
        const cleanCorrectOption = correctOptionRaw.replace(/^[A-D][\).\s\-:]+\s*/i, "").trim();

        const explanationText = q.explanation || "Direct curriculum mastery point.";
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        const splitExp = doc.splitTextToSize(explanationText, contentWidth - 30);
        const reqSpace = splitExp.length * 10 + 26;

        checkAddPage(reqSpace);

        // Box for explanation item
        doc.setDrawColor(226, 232, 240);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin, y - 2, contentWidth, splitExp.length * 10 + 20, 2, 2, "FD");

        // Left accent bar
        doc.setFillColor(16, 185, 129); // emerald
        doc.rect(margin, y - 2, 3, splitExp.length * 10 + 20, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`Question ${qNum}: Correct Answer (${correctLetter})`, margin + 10, y + 8);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(`— "${cleanCorrectOption}"`, margin + 175, y + 8);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text("Reasoning / Solution:", margin + 10, y + 18);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);
        doc.text(splitExp, margin + 98, y + 18);

        y += splitExp.length * 10 + 26;
      });
    }
  }

  // Add page numbers and footers across all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);

    // Bottom divider
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);

    // Footer text
    doc.text(
      `${deck.schoolName || "D'Evelyn High School"} • ${deck.courseName || deck.courseCode} Mock Final Exam (${totalQuestions} Total Questions)`,
      margin,
      pageHeight - 14
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 14,
      { align: "right" }
    );
  }

  return doc;
}

export function downloadMockExamPdf(
  deck: StudyDeck,
  questions: QuizQuestion[],
  options: PdfExportOptions = {}
): void {
  const doc = generateMockExamPdf(deck, questions, options);
  const totalQ = questions.length;
  const sanitizedCode = (deck.courseCode || "EXAM").replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `${sanitizedCode}_Mock_Final_Exam_${totalQ}Q.pdf`;
  doc.save(fileName);
}
