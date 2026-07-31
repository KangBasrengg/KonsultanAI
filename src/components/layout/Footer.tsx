"use client";

import { Heart, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-putih/20 bg-navy-dark pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10 bg-navy-light border border-putih/20 rounded-xl shadow-md overflow-hidden">
                <Image src="/images/logo-128.webp" alt="KonsultanAI Logo" fill sizes="40px" className="object-cover" />
              </div>
              <span className="font-bold text-xl tracking-tight text-putih">
                Konsultan<span className="text-gold">AI</span>
              </span>
            </Link>
            <p className="text-putih/60 max-w-sm leading-relaxed">
              Memahami Hukum Indonesia Dengan Cepat, Mudah, dan Cerdas. Platform Legal Technology kebanggaan bangsa.
            </p>
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-merah/40 text-[#ff6b6b] text-xs font-semibold w-max">
                <span className="w-2 h-2 rounded-full bg-merah"></span>
                Karya Anak Bangsa
              </div>


            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6">Tautan</h3>
            <ul className="space-y-4 text-putih/60">
              <li><Link href="#cara-kerja" className="hover:text-gold transition-colors">Cara Kerja</Link></li>
              <li><Link href="#fitur" className="hover:text-gold transition-colors">Keunggulan</Link></li>
              <li><Link href="#harga" className="hover:text-gold transition-colors">Harga Premium</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6">Legalitas</h3>
            <ul className="space-y-4 text-putih/60">
              <li><Link href="/terms-of-service" className="hover:text-gold transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-gold transition-colors">Disclaimer</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6">Dukungan</h3>
            <ul className="space-y-4 text-putih/60">
              <li>
                <a href="https://www.instagram.com/konsultanai/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold transition-colors group">
                  <div className="p-2 bg-putih/5 rounded-lg group-hover:bg-gold/10 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-putih">Laporkan Bug?</p>
                    <p className="text-xs">Hubungi Kami</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="https://hoodtech.my.id" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold transition-colors group">
                  <div className="p-2 bg-putih/5 rounded-lg group-hover:bg-gold/10 transition-colors">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-putih">Hoodtech</p>
                    <p className="text-xs">Lihat Portofolio</p>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-putih/20 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-putih/60">
          <p>© {new Date().getFullYear()} Hoodtech. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-4 h-4 text-merah fill-merah" /> di Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}

