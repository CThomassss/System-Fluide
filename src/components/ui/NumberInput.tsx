"use client";

import { useState } from "react";

interface NumberInputProps {
  label: string;
  unit: string;
  value: number | null;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  id: string;
}

export function NumberInput({
  label,
  unit,
  value,
  onChange,
  min = 0,
  max = 999,
  id,
}: NumberInputProps) {
  const [raw, setRaw] = useState(value ? String(value) : "");

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-condensed text-sm font-semibold text-foreground/70">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-xl border-2 border-surface-light bg-surface px-4 py-3 focus-within:border-orange transition-colors">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            const n = parseInt(e.target.value, 10);
            if (!isNaN(n)) onChange(n);
            if (e.target.value === "") onChange(0);
          }}
          onBlur={() => {
            const n = parseInt(raw, 10);
            if (isNaN(n) || n < min) {
              setRaw("");
              onChange(0);
            } else if (n > max) {
              setRaw(String(max));
              onChange(max);
            }
          }}
          min={min}
          max={max}
          className="w-full bg-transparent text-lg font-semibold outline-none text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-sm text-foreground/50 font-condensed">{unit}</span>
      </div>
    </div>
  );
}
