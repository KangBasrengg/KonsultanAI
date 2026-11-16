"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Landmark, Sparkles, ArrowRight, Scale } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export interface PoliticalArticleDetail {
  id: string;
  title: string;
  slug: string;
  tag: string;
  content: string;
  createdAt: string;
}

export interface RelatedNewsItem {
  id: string;
  title: string;
  slug: string;
  tag: string;
  createdAt: string;
}

interface Props {
  article: PoliticalArticleDetail;
  relatedNews: RelatedNewsItem[];
}

export default function BeritaDetailClient({ article, relatedNews }: Props) {
  return (
    <main className="min-h-screen bg-navy text-putih selection:bg-gold/30 selection:text-gold flex flex-col">
      <Navbar />

      <section className="flex-1 pt-28 md:pt-36 pb-20 relative">
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gold/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 max-w-7xl">
          <Link
            href="/berita-politik"
            className="inline-flex items-center gap-2 text-sm text-putih/60 hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Berita Politik</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/30">
              <Landmark className="w-3.5 h-3.5" />
              <span>{article.tag}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-putih/60 bg-putih/5 px-3.5 py-1.5 rounded-full border border-putih/10">
              <Calendar className="w-3.5 h-3.5 text-gold/80" />
              <span>
                {new Date(article.createdAt).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-10 leading-tight text-putih">
            {article.title}
          </h1>

          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-navy-light/50 border border-putih/15 rounded-3xl p-6 sm:p-10 lg:p-14 mb-12 shadow-2xl relative overflow-hidden backdrop-blur-sm"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-gold/5 blur-[90px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
            <div className="prose prose-invert prose-lg max-w-none text-putih/85 leading-relaxed relative z-10 prose-headings:text-putih prose-headings:font-bold prose-h1:text-2xl prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-strong:text-putih prose-em:text-gold/90 prose-a:text-gold prose-li:text-putih/85 prose-hr:border-putih/15 prose-blockquote:border-gold prose-blockquote:bg-putih/5 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:rounded-r-xl">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>
          </motion.article>

          {/* CTA Konsultasi */}
          <div className="bg-gradient-to-r from-navy-light via-navy-light/80 to-gold/15 border border-gold/30 rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl mb-14">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-gold uppercase tracking-wider mb-2">
                <Scale className="w-4 h-4" />
                <span>Konsultasi Hukum & Politik</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-putih mb-2">
                Ingin Mengulas Lebih Dalam Topik Ini atau Isu Politik Lainnya?
              </h2>
              <p className="text-sm text-putih/70 leading-relaxed">
                Gunakan fitur Konsultasi AI kategori Politik &amp; Tata Negara untuk mendapatkan telaah hukum dan wawasan objektif sesuai regulasi terbaru.
              </p>
            </div>
            <Link
              href="/intake"
              className="shrink-0 bg-gold hover:bg-gold-light text-navy font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-gold/25 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Konsultasi Sekarang</span>
            </Link>
          </div>

          {/* Berita Lainnya */}
          {relatedNews.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-putih">
                  Berita Politik <span className="text-gold">Lainnya</span>
                </h2>
                <Link
                  href="/berita-politik"
                  className="text-xs sm:text-sm font-semibold text-gold hover:underline inline-flex items-center gap-1"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedNews.map((item) => (
                  <Link
                    key={item.id}
                    href={`/berita-politik/${item.slug}`}
                    className="bg-navy-light/40 border border-putih/10 hover:border-gold/40 rounded-2xl p-6 flex flex-col justify-between transition-all group"
                  >
                    <div>
                      <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-putih/5 border border-putih/10 text-gold mb-3">
                        {item.tag}
                      </span>
                      <h3 className="font-bold text-base text-putih group-hover:text-gold transition-colors line-clamp-2 leading-snug mb-3">
                        {item.title}
                      </h3>
                    </div>
                    <div className="pt-3 border-t border-putih/10 flex items-center justify-between text-xs text-putih/50">
                      <span>
                        {new Date(item.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-gold font-semibold inline-flex items-center gap-1">
                        Baca <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
