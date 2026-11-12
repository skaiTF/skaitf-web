"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { DeerMark } from "./Deer";

const links = [
  { label: "About", id: "about" },
  { label: "Projects", id: "projects" },
  { label: "Stats", id: "stats" },
  { label: "Experience", id: "experience" },
  { label: "Vault", id: "vault" },
  { label: "Contact", id: "contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Highlight the link for whichever section crosses the middle of the screen.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    for (const { id } of links) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      className="hud-bar fixed inset-x-0 top-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Padding outside the max-width container, same as Section, so the logo lines up with the headings */}
      <div className="px-6">
      <nav aria-label="Main" className="mx-auto flex h-14 max-w-5xl items-center justify-between">
        <Link href="/#" className="flex items-center gap-3 text-lg font-bold text-white">
          {/* -ml-1 cancels the icon's built-in left padding so its edge lines up with the hero text */}
          <DeerMark size={26} className="-ml-1 text-accent" />
          skaiTF
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {links.map((link) => {
            const isActive = active === link.id;
            return (
              <li key={link.id}>
                <a
                  href={`/#${link.id}`}
                  className={`relative py-1 text-sm transition-colors duration-200 hover:text-accent ${
                    isActive ? "text-white" : "text-zinc-400"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-0.5 bg-accent transition-transform duration-300 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="text-zinc-400 transition-colors hover:text-accent md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            className="flex flex-col gap-1 overflow-hidden border-t border-white/10 px-6 py-3 md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`/#${link.id}`}
                  onClick={() => setOpen(false)}
                  className={`block border-l-2 py-2 pl-3 text-sm transition-colors hover:text-accent ${
                    active === link.id ? "border-accent text-white" : "border-transparent text-zinc-400"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
