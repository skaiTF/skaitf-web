"use client";

import { motion } from "framer-motion";
import { Mail, Github, ChevronDown } from "lucide-react";
import ProjectCard from "./components/ProjectCard";

const projects = [
  {
    title: "skyhud",
    description: "A TF2 Head's Up Display, inspired by many other existing huds, and focused on simplicity.",
    href: "https://github.com/skaiTF/skyhud",
  },
  {
    title: "chaos",
    description: "A productivity plugin for Obsidian to manage organized chaos. Treat your tasks, notes, projects, whatever, as 'things i need to do/look at until this date' in the form of markdown notes.",
    href: "https://github.com/skaiTF/chaos",
  },
];

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <div className="bg-black text-white">
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          className="text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-xl font-medium tracking-tight mb-1">
            Miguel "skai" Silva
          </h1>
          <p className="text-sm text-zinc-400 mb-3">
            Yo, I like making stuff
          </p>
          
          <div className="flex items-center gap-3">
            <a
              href="mailto:me@skaitf.com"
              className="hover:text-white transition-colors duration-200"
              aria-label="Email"
            >
              <Mail size={16} className="text-zinc-500 hover:text-zinc-300" />
            </a>
            <a
              href="https://github.com/skaiTF"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github size={16} className="text-zinc-500 hover:text-zinc-300" />
            </a>
          </div>
        </motion.div>

        <motion.a
          href="#projects"
          className="absolute bottom-12 flex flex-col items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <span className="text-sm tracking-wide">Scroll down</span>
          <ChevronDown size={20} className="animate-bounce-slow" />
        </motion.a>
      </section>

      <section id="projects" className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <motion.div
          className="w-full max-w-xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold mb-8 text-center">Projects</h2>
          
          <div className="flex flex-col gap-4">
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                title={project.title}
                description={project.description}
                href={project.href}
              />
            ))}
          </div>
        </motion.div>
      </section>

      <footer className="px-6 py-10 text-center text-sm text-zinc-500 border-t border-zinc-900">
        <a
          href="https://github.com/skaiTF/skaitf-web"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-zinc-300 transition-colors"
        >
          Source
        </a>
        <span className="mx-2 text-zinc-700">{"•"}</span>
        <span>{"©"} {year} Miguel &quot;skai&quot; Silva</span>
      </footer>
    </div>
  );
}
