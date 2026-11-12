"use client";

import { motion } from "framer-motion";
import { Antler } from "./Deer";

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export default function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="px-6 py-24">
      <motion.div
        className="mx-auto w-full max-w-5xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h2 className="flex items-center gap-3 text-3xl font-bold">
            <Antler className="text-accent" />
            {title}
          </h2>
          <span className="section-underline mt-3" />
        </div>
        {children}
      </motion.div>
    </section>
  );
}
