"use client";

import { useState, useEffect } from "react";
import { FileText, X, Clock, ChevronRight, Inbox } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Consultation {
  id: string;
  chronology: string;
  ai_analysis: string;
  created_at: string;
}

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  async function fetchHistory() {
    setLoading(true);
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        setConsultations(data.consultations || []);
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    } finally {
      setLoading(false);
    }
  }

  const selected = consultations.find(c => c.id === selectedId);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-lg bg-navy-dark border-l border-putih/20 flex flex-col h-full animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-putih/20 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gold" />
            <h2 className="text-putih font-bold text-lg">
              {selected ? "Detail Konsultasi" : "Riwayat Konsultasi"}
            </h2>
          </div>
          <button
            type="button"
            onClick={selected ? () => setSelectedId(null) : onClose}
            className="w-8 h-8 rounded-lg bg-putih/5 flex items-center justify-center hover:bg-putih/10 transition-colors"
          >
            {selected ? <ChevronRight className="w-4 h-4 text-putih/70 rotate-180" /> : <X className="w-4 h-4 text-putih/70" />}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
              <p className="text-putih/40 text-sm">Memuat riwayat...</p>
            </div>
          ) : selected ? (
            /* Detail View */
            <div className="space-y-4">
              <div className="text-xs text-putih/40 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(selected.created_at)}
              </div>

              {/* Chronology */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-putih/60 uppercase tracking-wider">Kronologi</h3>
                <div className="p-4 bg-navy-light border border-putih/20 rounded-xl text-sm text-putih/80 whitespace-pre-wrap leading-relaxed">
                  {selected.chronology}
                </div>
              </div>

              {/* AI Analysis */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gold/70 uppercase tracking-wider">Analisis AI</h3>
                <div className="p-4 bg-gold/5 border border-gold/20 rounded-xl text-sm text-putih/90 prose dark:prose-invert prose-sm max-w-none prose-p:leading-relaxed">
                  <ReactMarkdown>{selected.ai_analysis}</ReactMarkdown>
                </div>
              </div>
            </div>
          ) : consultations.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-putih/5 flex items-center justify-center">
                <Inbox className="w-8 h-8 text-putih/20" />
              </div>
              <p className="text-putih/40 text-sm">Belum ada riwayat konsultasi</p>
              <p className="text-putih/25 text-xs">Mulai konsultasi pertama Anda di kolom chat</p>
            </div>
          ) : (
            /* List View */
            <div className="space-y-2">
              {consultations.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className="w-full text-left p-4 bg-navy-light/50 border border-putih/15 rounded-xl hover:border-gold/20 hover:bg-navy-light transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-putih font-medium line-clamp-2 leading-snug">
                        {item.chronology.length > 120
                          ? item.chronology.substring(0, 120) + "..."
                          : item.chronology}
                      </p>
                      <p className="text-xs text-putih/30 mt-2 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-putih/20 group-hover:text-gold transition-colors shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

