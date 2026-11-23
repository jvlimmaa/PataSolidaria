// Fundo decorativo da tela de login: silhuetas de cachorros, gatos,
// patinhas e corações nas cores da marca (verde e laranja da logo).
// Puramente visual: aria-hidden e sem eventos de ponteiro.

type P = { className?: string; style?: React.CSSProperties };

function Dog({ className, style }: P) {
  return (
    <svg viewBox="0 0 100 120" className={className} style={style} fill="currentColor">
      <ellipse cx="48" cy="88" rx="26" ry="30" />
      <circle cx="45" cy="38" r="20" />
      <ellipse cx="63" cy="45" rx="13" ry="9" />
      <circle cx="74" cy="42" r="4" fill="var(--background)" opacity="0.5" />
      <ellipse cx="29" cy="42" rx="8" ry="17" transform="rotate(18 29 42)" />
      <path d="M72 102 C 90 98, 94 82, 88 70" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

function Cat({ className, style }: P) {
  return (
    <svg viewBox="0 0 100 120" className={className} style={style} fill="currentColor">
      <ellipse cx="50" cy="86" rx="27" ry="31" />
      <circle cx="50" cy="40" r="20" />
      <polygon points="32,32 35,8 48,24" />
      <polygon points="68,32 65,8 52,24" />
      <path d="M74 108 C 98 104, 100 76, 86 64" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

function Paw({ className, style }: P) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="currentColor">
      <ellipse cx="50" cy="66" rx="22" ry="19" />
      <ellipse cx="22" cy="42" rx="9" ry="12" transform="rotate(-20 22 42)" />
      <ellipse cx="39" cy="24" rx="9" ry="12" transform="rotate(-6 39 24)" />
      <ellipse cx="61" cy="24" rx="9" ry="12" transform="rotate(6 61 24)" />
      <ellipse cx="78" cy="42" rx="9" ry="12" transform="rotate(20 78 42)" />
    </svg>
  );
}

function Heart({ className, style }: P) {
  return (
    <svg viewBox="0 0 100 90" className={className} style={style} fill="currentColor">
      <path d="M50 86 C 20 64, 2 46, 2 26 C 2 12, 13 2, 27 2 C 37 2, 45 8, 50 16 C 55 8, 63 2, 73 2 C 87 2, 98 12, 98 26 C 98 46, 80 64, 50 86 Z" />
    </svg>
  );
}

const float = (delay: number, dur = 7): React.CSSProperties => ({
  animation: `pet-float ${dur}s ease-in-out ${delay}s infinite`,
});

export function AuthBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Animais maiores nas laterais (escondidos em telas pequenas para não poluir) */}
      <Dog className="absolute -left-6 bottom-6 hidden h-56 w-48 text-primary/15 md:block lg:left-[6%] lg:h-72 lg:w-60" style={float(0, 8)} />
      <Cat className="absolute -right-4 top-24 hidden h-52 w-44 text-accent/20 md:block lg:right-[7%] lg:h-64 lg:w-56" style={float(1.5, 9)} />
      <Cat className="absolute bottom-10 right-[4%] hidden h-32 w-28 -scale-x-100 text-primary/10 lg:block" style={float(3, 7)} />
      <Dog className="absolute left-[3%] top-20 hidden h-28 w-24 -scale-x-100 text-accent/15 lg:block" style={float(2, 10)} />

      {/* Patinhas e corações espalhados */}
      <Paw className="absolute left-[8%] top-[12%] h-10 w-10 rotate-[-20deg] text-primary/15" style={float(0.5)} />
      <Paw className="absolute left-[14%] top-[22%] h-8 w-8 rotate-[-10deg] text-primary/10" style={float(1.2)} />
      <Paw className="absolute right-[10%] bottom-[14%] h-12 w-12 rotate-[25deg] text-accent/20" style={float(2.2)} />
      <Paw className="absolute right-[18%] bottom-[24%] h-8 w-8 rotate-[15deg] text-accent/15" style={float(0.8)} />
      <Paw className="absolute left-[24%] bottom-[8%] h-9 w-9 rotate-[10deg] text-primary/10 sm:block" style={float(1.8)} />
      <Paw className="absolute right-[26%] top-[6%] h-7 w-7 rotate-[-15deg] text-accent/15" style={float(2.6)} />
      <Heart className="absolute right-[22%] top-[30%] hidden h-8 w-9 text-accent/25 md:block" style={float(1, 6)} />
      <Heart className="absolute left-[20%] top-[55%] hidden h-6 w-7 text-accent/20 md:block" style={float(2.4, 6)} />
      <Heart className="absolute left-[6%] top-[45%] h-5 w-6 text-primary/15" style={float(3.2, 6)} />
      <Heart className="absolute right-[6%] top-[60%] h-6 w-7 text-primary/15" style={float(0.3, 6)} />
    </div>
  );
}
