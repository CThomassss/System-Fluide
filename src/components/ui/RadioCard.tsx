"use client";

import { motion } from "framer-motion";

interface RadioCardProps {
  selected: boolean;
  onSelect: () => void;
  label: string;
  description?: string;
  name: string;
  value: string;
}

export function RadioCard({
  selected,
  onSelect,
  label,
  description,
  name,
  value,
}: RadioCardProps) {
  return (
    <motion.label
      className={`relative flex cursor-pointer flex-col gap-1 rounded-xl border-2 p-4 transition-colors ${
        selected
          ? "border-accent bg-accent/10"
          : "border-surface-light bg-surface hover:border-surface-light/80"
      }`}
      whileTap={{ scale: 0.98 }}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <span className="font-display text-lg font-semibold">{label}</span>
      {description && (
        <span className="text-sm text-foreground/60">{description}</span>
      )}
      {selected && (
        <motion.div
          className="absolute top-3 right-3 h-3 w-3 rounded-full bg-accent"
          layoutId={`radio-${name}`}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.label>
  );
}
