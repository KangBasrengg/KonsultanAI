"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Clock } from "lucide-react";
import Link from "next/link";

interface LimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function LimitModal({ isOpen, onClose, message }: LimitModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[100] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-navy border border-gold/30 rounded-3xl p-8 max-w-md w-full shadow-2xl pointer-events-auto relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold to-yellow-300" />
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-putih/50 hover:text-putih hover:bg-putih/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8 mt-4">
                <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-gold/20 animate-ping rounded-full" />
                  <Crown className="w-10 h-10 text-gold" />
                </div>
                <h3 className="text-2xl font-bold text-putih mb-4">Limit Akses Tercapai</h3>
                <p className="text-putih/70 leading-relaxed text-sm mb-4">
                  {message || "Anda telah mencapai limit penggunaan fitur AI. Token Anda akan di-reset otomatis setiap 2 hari untuk menjaga kestabilan server."}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gold/80 bg-gold/10 py-2 px-4 rounded-lg inline-flex">
                  <Clock className="w-4 h-4" />
                  <span>Tunggu 2 hari atau upgrade sekarang</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link 
                  href="/#harga"
                  onClick={onClose}
                  className="flex items-center justify-center w-full py-4 bg-gold text-navy font-bold rounded-xl hover:bg-gold-light transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
                >
                  Berlangganan Sekarang
                </Link>
                <button
                  onClick={onClose}
                  className="w-full py-4 text-putih/60 font-medium hover:text-putih hover:bg-putih/5 rounded-xl transition-colors"
                >
                  Nanti Saja
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
