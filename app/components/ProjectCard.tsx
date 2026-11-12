"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  href: string;
  skills: string[];
}

export default function ProjectCard({ title, description, href, skills }: ProjectCardProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hud-card flex h-full flex-col p-6 cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-2">
            {title}
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {description}
          </p>
        </div>
        <ExternalLink 
          size={18} 
          className="text-zinc-500 group-hover:text-accent transition-colors flex-shrink-0 mt-1" 
        />
      </div>
      {skills.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          {skills.map((skill) => (
            <span key={skill} className="hud-tag">
              {skill}
            </span>
          ))}
        </div>
      )}
    </motion.a>
  );
}
