"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Lock, CheckCircle2, Award, ChevronRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import DOMPurify from 'isomorphic-dompurify';

type QuizData = {
  id: string;
  question: string;
  options: string[]; // Supabase JSONB is returned as JS array
  correct_option_index: number;
};

type MaterialData = {
  id: string;
  category_id: string;
  title: string;
  content: string;
  is_premium: boolean;
  required_tier: string;
  legal_categories?: { name: string };
};

interface LearningMaterialClientProps {
  material: MaterialData;
  quizzes: QuizData[];
  hasAccess: boolean;
  isLoggedIn: boolean;
}

export default function LearningMaterialClient({ material, quizzes, hasAccess, isLoggedIn }: LearningMaterialClientProps) {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Handle options that might be returned as JSON strings instead of arrays
  let parsedOptions = [];
  if (quizzes.length > 0) {
    const opts = quizzes[currentQuiz].options;
    try {
      parsedOptions = typeof opts === 'string' ? JSON.parse(opts) : opts;
    } catch (e) {
      console.error("Error parsing options:", e);
      parsedOptions = [];
    }
  }

  const handleOptionSelect = (index: number) => {
    if (showResult) return; // Prevent changing answer
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;

    setShowResult(true);
    if (selectedOption === quizzes[currentQuiz].correct_option_index) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuiz < quizzes.length - 1) {
      setCurrentQuiz(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    }
  };

  return (
    <main className="min-h-screen selection:bg-gold/30 flex flex-col">
      <Navbar />

      {/* Content Section */}
      <section className="flex-1 pt-32 pb-20 relative">
        {/* Removed noise.png to prevent 404 */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gold/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-4xl">
          <Link href={`/learning/category/${material.legal_categories?.name?.toLowerCase().replace(/&/g, 'dan').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || ''}`} className="inline-flex items-center gap-2 text-putih/60 hover:text-gold transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Kategori
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-semibold text-putih/50 bg-putih/5 px-3 py-1.5 rounded-full border border-putih/10">
              {material.legal_categories?.name || "Kategori Umum"}
            </span>
            {material.is_premium && (
              <span className="text-xs font-bold text-navy bg-gold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                <Award className="w-3 h-3" /> {material.required_tier.toUpperCase()}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
            {material.title}
          </h1>

          {/* Paywall / Content Area */}
          {!hasAccess ? (
            <div className="bg-navy-light border border-putih/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden mt-12">
              <div className="w-20 h-20 rounded-full bg-putih/5 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-gold" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Materi Eksklusif</h2>
              <p className="text-putih/60 mb-8 max-w-lg mx-auto">
                {isLoggedIn
                  ? `Materi ini membutuhkan paket langganan ${material.required_tier.toUpperCase()}. Upgrade akun Anda untuk mengakses seluruh materi eksklusif.`
                  : "Silakan masuk (login) terlebih dahulu atau berlangganan untuk mengakses materi eksklusif ini."}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={isLoggedIn ? "/#harga" : "/?login=true"}>
                  <button className="w-full sm:w-auto px-8 py-3 bg-gold text-navy rounded-full font-bold hover:bg-gold-light transition-transform hover:scale-105">
                    {isLoggedIn ? "Upgrade Paket" : "Login Sekarang"}
                  </button>
                </Link>
                <Link href="/learning">
                  <button className="w-full sm:w-auto px-8 py-3 bg-putih/5 text-putih rounded-full font-bold hover:bg-putih/10 transition-colors border border-putih/10">
                    Cari Materi Gratis
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-navy-light/40 border border-putih/10 rounded-[2rem] p-8 md:p-12 mb-12 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                <div
                  className="prose prose-invert prose-lg max-w-none text-putih/80 leading-relaxed relative z-10"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(material.content
                      // Handle blockquotes starting with >
                      .replace(/(> .*(\n> .*)*)/g, (match) => {
                        return `<div class="border-l-4 border-gold pl-6 py-5 my-8 bg-putih/5 rounded-r-2xl text-putih/90 italic shadow-inner">${match.replace(/> /g, '').replace(/\n/g, '<br/>')}</div>`;
                      })
                      // Handle headings
                      .replace(/### (.*?)(?=\n|$)/g, '<h3 class="text-2xl font-bold text-putih mt-10 mb-4 flex items-center gap-3"><div class="w-2 h-6 bg-gold rounded-full"></div>$1</h3>')
                      // Handle numbered lists (basic formatting)
                      .replace(/(\d+)\. \*\*(.*?)\*\*(.*?)(?=\n|$)/g, '<div class="flex gap-4 mt-6 mb-2"><div class="shrink-0 w-8 h-8 rounded-full bg-putih/10 text-gold flex items-center justify-center font-bold border border-putih/10">$1</div><div><strong class="text-putih text-xl block mb-1">$2</strong>$3</div></div>')
                      // Handle remaining bold text
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-putih font-semibold">$1</strong>')
                      // Handle remaining newlines
                      .replace(/\n/g, '<br/>')
                    )
                  }}
                />
              </div>

              {/* Quiz Section */}
              {quizzes.length > 0 && (
                <div className="mt-16 bg-navy-dark border border-putih/10 rounded-3xl p-8 md:p-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-[50px] rounded-full pointer-events-none"></div>

                  <div className="flex items-center gap-2 mb-8 border-b border-putih/10 pb-6">
                    <CheckCircle2 className="w-6 h-6 text-gold" />
                    <h3 className="text-2xl font-bold">Evaluasi Pemahaman</h3>
                    <span className="ml-auto text-sm font-medium text-putih/50 bg-putih/5 px-3 py-1 rounded-full">
                      Pertanyaan {currentQuiz + 1} dari {quizzes.length}
                    </span>
                  </div>

                  <p className="text-xl mb-8 font-medium">
                    {quizzes[currentQuiz].question}
                  </p>

                  <div className="space-y-4 mb-8">
                    {parsedOptions.map((opt: string, idx: number) => {
                      const isCorrect = idx === quizzes[currentQuiz].correct_option_index;
                      const isSelected = selectedOption === idx;

                      let optionStyle = "border-putih/20 bg-putih/5 hover:bg-putih/10";
                      if (showResult) {
                        if (isCorrect) optionStyle = "border-green-500 bg-green-500/20 text-green-300";
                        else if (isSelected) optionStyle = "border-red-500 bg-red-500/20 text-red-300";
                        else optionStyle = "border-putih/10 bg-transparent opacity-50";
                      } else if (isSelected) {
                        optionStyle = "border-gold bg-gold/20";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleOptionSelect(idx)}
                          disabled={showResult}
                          className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center gap-4 ${optionStyle}`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-gold bg-gold text-navy' : 'border-putih/30'}`}>
                            {isSelected && !showResult && <div className="w-2 h-2 rounded-full bg-navy"></div>}
                            {showResult && isCorrect && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {!showResult ? (
                    <button
                      onClick={handleCheckAnswer}
                      disabled={selectedOption === null}
                      className={`w-full py-4 rounded-xl font-bold transition-all ${selectedOption === null ? 'bg-putih/5 text-putih/30 cursor-not-allowed' : 'bg-gold text-navy hover:bg-gold-light hover:scale-[1.02]'}`}
                    >
                      Cek Jawaban
                    </button>
                  ) : (
                    <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
                      {currentQuiz < quizzes.length - 1 ? (
                        <button
                          onClick={handleNextQuiz}
                          className="flex-1 py-4 bg-navy-light text-putih border border-putih/20 hover:border-gold hover:text-gold rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                          Pertanyaan Selanjutnya <ChevronRight className="w-5 h-5" />
                        </button>
                      ) : (
                        <div className="flex-1 text-center bg-green-500/20 border border-green-500/30 text-green-400 p-6 rounded-2xl">
                          <p className="font-bold text-xl mb-1">Kuis Selesai!</p>
                          <p>Skor Anda: {quizScore}/{quizzes.length}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
