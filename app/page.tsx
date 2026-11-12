"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, Github, ChevronDown, Lock } from "lucide-react";
import ProjectCard from "./components/ProjectCard";
import ExperienceCard, { type Experience } from "./components/ExperienceCard";
import SkillTag from "./components/SkillTag";
import ContributionGraph, { useContributions } from "./components/ContributionGraph";
import TokenStats from "./components/TokenStats";
import Section from "./components/Section";
import { DeerScene } from "./components/Deer";
import pfp from "./icon.png";

const projects = [
  {
    title: "skyhud",
    description: "A TF2 Head's Up Display, inspired by many other existing huds, and focused on simplicity.",
    href: "https://github.com/skaiTF/skyhud",
    skills: ["TF2", "VGUI"],
  },
  {
    title: "chaos",
    description: "A productivity plugin for Obsidian to manage organized chaos. Treat your tasks, notes, projects, whatever, as 'things i need to do/look at until this date' in the form of markdown notes.",
    href: "https://github.com/skaiTF/chaos",
    skills: ["TypeScript", "Obsidian"],
  },
];

// Placeholder entry: replace with your real experience. Add more objects for more jobs (newest first).
const experience: Experience[] = [
  {
    company: "KPMG",
    logo: "/logos/kpmg.webp", // path without "public", must start with "/" (file lives in public/logos/)
    position: "Software Engineer Intern",
    date: "Feb 2026 – May 2026",
    location: "Porto, Portugal (Hybrid)",
    description: "Worked on a multi-agent AI system to support call centre operators in real time.",
    responsibilities: [
      "Designed a real-time multi-agent AI system for telecom call centres, covering the full support lifecycle from live transcription to automated service order creation.",
      "Built a Python/LangGraph orchestration backend coordinating specialised agents for ASR, sentiment analysis, contact-reason classification, and remote diagnostics.",
      "Integrated CRM, network monitoring, and interaction history into a structured live summary surfaced to the human agent during the call.",
      "Implemented automated service order pre-filling with SLA context and appointment scheduling, triggered when remote resolution was not viable.",
    ],
    technologies: ["Python", "LangGraph", "RAG", "FastAPI", "LangFuse", "Django", "Pytest"],
  },
];

// `icon` is a Simple Icons slug (https://simpleicons.org). Leave it out when no logo exists.
const skillGroups = [
  {
    title: "Languages",
    skills: [
      { name: "TypeScript", icon: "typescript" },
      { name: "Java", icon: "openjdk" },
      { name: "Python", icon: "python" },
      { name: "Rust", icon: "rust" },
      { name: "SQL" },
      { name: "Bash", icon: "gnubash" },
    ],
  },
  {
    title: "Frameworks & Libraries",
    skills: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "Spring Boot", icon: "springboot" },
      { name: "FastAPI", icon: "fastapi" },
      { name: "Django", icon: "django" },
    ],
  },
  {
    title: "AI & LLMs",
    skills: [
      { name: "LangGraph", icon: "langgraph" },
      { name: "RAG" },
      { name: "LangFuse" },
    ],
  },
  {
    title: "APIs & Messaging",
    skills: [
      { name: "gRPC" },
      { name: "GraphQL", icon: "graphql" },
      { name: "RabbitMQ", icon: "rabbitmq" },
    ],
  },
  {
    title: "Databases",
    skills: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "Redis", icon: "redis" },
      { name: "SQL Server" },
      { name: "SQLite", icon: "sqlite" },
    ],
  },
  {
    title: "DevOps & Tools",
    skills: [
      { name: "Docker", icon: "docker" },
      { name: "Kubernetes", icon: "kubernetes" },
      { name: "Linux", icon: "linux" },
      { name: "Git", icon: "git" },
      { name: "GitHub Actions", icon: "githubactions" },
      { name: "Pytest", icon: "pytest" },
      { name: "Prometheus", icon: "prometheus" },
      { name: "Grafana", icon: "grafana" },
    ],
  },
];

const skillIcons = new Map<string, string | undefined>(
  skillGroups.flatMap((group) => group.skills.map((skill) => [skill.name, skill.icon] as const))
);
const iconFor = (name: string) => skillIcons.get(name);

export default function Home() {
  const year = new Date().getFullYear();
  const contributions = useContributions();

  return (
    <div className="text-white">
      <section className="relative min-h-screen flex items-center overflow-hidden px-6">
        <DeerScene className="absolute inset-x-0 bottom-0 h-48 w-full md:h-72" />

        <motion.div
          className="relative mx-auto w-full max-w-5xl text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Negative margin cancels the large "M" glyph's side bearing so it lines up with the subtitle */}
          <h1 className="-ml-[0.065em] text-6xl font-bold mb-2">
            Miguel &quot;skai&quot; Silva
          </h1>
          <p className="text-xl text-zinc-400 mb-4">Software engineer</p>

          <div className="flex items-center gap-3">
            <a href="mailto:me@skaitf.com" aria-label="Email">
              <Mail size={16} className="text-zinc-400 hover:text-accent transition-colors" />
            </a>
            <a
              href="https://github.com/skaiTF"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github size={16} className="text-zinc-400 hover:text-accent transition-colors" />
            </a>
          </div>
        </motion.div>

        <motion.a
          href="#about"
          className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-400 hover:text-accent transition-colors cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <span className="text-sm tracking-wide">Scroll down</span>
          <ChevronDown size={20} className="animate-bounce-slow" />
        </motion.a>
      </section>

      <div className="below-hero">
      <Section id="about" title="About">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="hud-panel aspect-square w-48 shrink-0 self-center overflow-hidden border border-accent/60 md:self-start">
            <Image
              src={pfp}
              alt="Miguel's profile picture"
              className="h-full w-full object-cover"
              placeholder="blur"
            />
          </div>
          <div className="hud-panel flex-1 p-6 text-zinc-300 leading-relaxed">
            <p>Hi! I&apos;m a software engineer from Portugal interested in all things tech.</p>
            <p>I started programming by accident in 2021 when I started developing my first project, skyhud, and haven&apos;t stopped since.</p>
            <p>What was once a small hobby quickly became one of my favorite things to do, having recently graduated from <a href="https://www.isep.ipp.pt/"><u>ISEP</u></a> with a telecommunications and informatics engineering degree where I further improved my skills and gained important knowledge in software development, networking and electronics.</p>
            <p>Currently, I spend most of my time working on personal projects and learning new things.</p>
          </div>
        </div>
      </Section>

      <Section id="projects" title="Projects">
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              href={project.href}
              skills={project.skills}
            />
          ))}
        </div>
      </Section>

      <Section id="stats" title="Stats">
        <TokenStats />
        <ContributionGraph state={contributions} />
      </Section>

      <Section id="experience" title="Experience & Skills">
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
          <div>
            <h3 className="mb-4 text-sm uppercase tracking-wider text-zinc-500">Experience</h3>
            <div className="flex flex-col gap-4">
              {experience.map((job) => (
                <ExperienceCard key={`${job.company}-${job.date}`} {...job} iconFor={iconFor} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm uppercase tracking-wider text-zinc-500">Skills</h3>
            <div className="hud-panel flex flex-col gap-6 p-6">
              {skillGroups.map((group) => (
                <div key={group.title}>
                  <h4 className="mb-3 text-sm text-white">{group.title}</h4>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <SkillTag key={skill.name} name={skill.name} icon={skill.icon} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section id="vault" title="Vault">
        <div className="hud-panel flex flex-col items-center justify-center gap-3 p-12 text-center">
          <Lock size={28} className="text-zinc-600" />
          <p className="text-zinc-500">My Obsidian vault. Coming soon.</p>
        </div>
      </Section>

      <Section id="contact" title="Contact">
        <div className="hud-panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-zinc-300">Want to get in touch? Reach out.</p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:me@skaitf.com"
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-accent transition-colors"
            >
              <Mail size={16} /> me@skaitf.com
            </a>
            <a
              href="https://github.com/skaiTF"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-accent transition-colors"
            >
              <Github size={16} /> skaiTF
            </a>
          </div>
        </div>
      </Section>

      <footer className="hud-bar px-6 py-10 text-center text-sm text-zinc-400">
        <a
          href="https://github.com/skaiTF/skaitf-web"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-accent transition-colors"
        >
          Source
        </a>
        <span className="mx-2 text-zinc-700">{"•"}</span>
        <span>{"©"} {year} Miguel &quot;skai&quot; Silva</span>
      </footer>
      </div>
    </div>
  );
}
