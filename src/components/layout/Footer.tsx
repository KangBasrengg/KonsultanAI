"use client";

import { Heart, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-putih/20 bg-navy-dark pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          <div className="max-w-sm space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10 bg-navy-light border border-putih/20 rounded-xl shadow-md overflow-hidden">
                <Image src="/images/logo-128.webp" alt="KonsultanAI Logo" fill sizes="40px" className="object-cover" />
              </div>
              <span className="font-bold text-xl tracking-tight text-putih">
                Konsultan<span className="text-gold">AI</span>
              </span>
            </Link>
            <p className="text-putih/60 text-xs leading-relaxed mt-2">
              Memahami Hukum Indonesia Dengan Cepat, Mudah, dan Cerdas. Platform Legal Technology kebanggaan bangsa.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-12 md:gap-16 lg:gap-24">
            <div>
              <h3 className="font-semibold text-sm mb-4 text-putih/90">Tautan</h3>
              <ul className="space-y-2 text-xs text-putih/60">
                <li><Link href="#cara-kerja" className="hover:text-gold transition-colors">Cara Kerja</Link></li>
                <li><Link href="#fitur" className="hover:text-gold transition-colors">Keunggulan</Link></li>
                <li><Link href="#harga" className="hover:text-gold transition-colors">Harga Premium</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-4 text-putih/90">Legalitas</h3>
              <ul className="space-y-2 text-xs text-putih/60">
                <li><Link href="/terms-of-service" className="hover:text-gold transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
                <li><Link href="/disclaimer" className="hover:text-gold transition-colors">Disclaimer</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-4 text-putih/90">Dukungan</h3>
              <ul className="space-y-2 text-putih/60">
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
                    <p className="font-medium text-xs text-putih">Laporkan Bug?</p>
                    <p className="text-[10px]">Hubungi Kami</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="https://hoodtech.my.id" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold transition-colors group">
                  <div className="p-2 bg-putih/5 rounded-lg group-hover:bg-gold/10 transition-colors">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-xs text-putih">Hoodtech</p>
                    <p className="text-[10px]">Tentang Kami</p>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
        </div>

        <div className="pt-8 border-t border-putih/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-putih/50">
          <p>© {new Date().getFullYear()} <a href="https://hoodtech.my.id" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">Hoodtech</a>. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-merah/80 fill-merah/80" /> di Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}

