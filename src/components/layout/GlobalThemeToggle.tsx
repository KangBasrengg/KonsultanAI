"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function GlobalThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-[100]">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="w-12 h-12 bg-navy-light/80 backdrop-blur-md border border-putih/20 hover:border-gold text-gold rounded-full flex items-center justify-center transition-all shadow-lg shadow-black/20 hover:scale-110 group"
        aria-label="Toggle theme globally"
        title="Ubah Tema"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-300" />
        )}
      </button>
    </div>
  );
}
