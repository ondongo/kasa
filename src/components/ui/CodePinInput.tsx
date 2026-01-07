"use client";

import { useState, useRef, useEffect } from "react";

export default function CodePinInput({
  length = 6,
  onChange,
  value = "",
}: {
  length?: number;
  onComplete?: (code: string) => void;
  onChange?: (code: string) => void;
  value?: string;
}) {
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Synchroniser avec la prop value (pour auto-complétion)
  useEffect(() => {
    if (value && value.length === length) {
      const newCode = value.split("").slice(0, length);
      setCode(newCode);
    } else if (!value) {
      setCode(Array(length).fill(""));
    }
  }, [value, length]);

  const handleChange = (index: number, value: string) => {
    // Accepter seulement les chiffres
    const digit = value.replace(/[^0-9]/g, "");

    if (digit.length === 0) {
      // Permettre la suppression
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
      // Appeler onChange avec le code mis à jour
      const updatedCode = [...newCode];
      const fullCode = updatedCode.join("");
      if (onChange) {
        onChange(fullCode);
      }
    } else {
      // Prendre le dernier caractère entré
      const newCode = [...code];
      newCode[index] = digit.slice(-1);
      setCode(newCode);

      // Appeler onChange avec le code mis à jour
      const fullCode = newCode.join("");
      if (onChange) {
        onChange(fullCode);
      }

      // Passer à l'input suivant
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // Si l'input est vide, revenir au précédent
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");

    const newCode = [...code];
    for (let i = 0; i < length && i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);

    // Appeler onChange avec le code collé
    const fullCode = newCode.join("");
    if (onChange) {
      onChange(fullCode);
    }

    // Focus sur le dernier input rempli ou le dernier si tout est rempli
    const lastIndex = Math.min(pastedData.length - 1, length - 1);
    inputRefs.current[lastIndex]?.focus();
  };

  return (
    <div className="flex gap-2 items-center justify-center">
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          className="w-12 h-12 text-center text-xl font-semibold rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] outline-none
                     dark:bg-input/30
                     placeholder:text-muted-foreground
                     focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
                     hover:border-ring/50
                     disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          value={digit}
          autoFocus={index === 0}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}
