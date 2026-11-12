"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import SkillTag from "./SkillTag";

export interface Experience {
  company: string;
  /** Path to an image in public/, e.g. "/logos/acme.png". Falls back to the company's initial. */
  logo?: string;
  position: string;
  date: string;
  location: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
}

interface ExperienceCardProps extends Experience {
  /** Looks up a Simple Icons slug for a technology name, so tags match the skills list. */
  iconFor: (name: string) => string | undefined;
}

export default function ExperienceCard({
  company,
  logo,
  position,
  date,
  location,
  description,
  responsibilities,
  technologies,
  iconFor,
}: ExperienceCardProps) {
  return (
    <motion.article
      className="hud-panel p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden border border-white/10 bg-black/30">
            {logo ? (
              <Image src={logo} alt={`${company} logo`} width={48} height={48} className="size-full object-contain" />
            ) : (
              <span className="text-xl font-bold text-accent">{company.charAt(0)}</span>
            )}
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">{position}</h4>
            <p className="text-sm text-accent">{company}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-sm text-zinc-500 sm:items-end">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} /> {date}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={14} /> {location}
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-zinc-300">{description}</p>

      {responsibilities.length > 0 && (
        <>
          <h5 className="mt-5 mb-2 text-xs uppercase tracking-wider text-zinc-500">Key responsibilities</h5>
          <ul className="space-y-1.5 text-sm text-zinc-300">
            {responsibilities.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </>
      )}

      {technologies.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <SkillTag key={tech} name={tech} icon={iconFor(tech)} />
          ))}
        </div>
      )}
    </motion.article>
  );
}
