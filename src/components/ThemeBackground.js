"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

export default function ThemeBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("theme-light", "theme-dark");
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted || typeof document === "undefined") {
      return;
    }

    const { classList } = document.body;

    classList.remove("theme-light", "theme-dark");
    classList.add(`theme-${theme}`);
  }, [theme, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 w-full h-full z-0"
      style={{
        backgroundColor: theme === 'light' ? '#F7ECE5' : '#A09A96'
      }}
      aria-hidden="true"
    />
  );
}