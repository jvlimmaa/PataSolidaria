// Fundo decorativo da tela de login: cachorros, gatos, trilhas de patinhas
// e corações nas cores da marca (verde e laranja da logo).
// Puramente visual: aria-hidden e sem eventos de ponteiro.
import { useId } from "react";

type P = { className?: string; style?: React.CSSProperties };

// Cachorro sentado, de frente, com orelhas caídas, coleira e plaquinha de coração.
function Dog({ className, style }: P) {
  const m = "pet" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg viewBox="0 0 120 140" className={className} style={style} fill="currentColor">
      <mask id={m}>
        <rect width="120" height="140" fill="#fff" />
        {/* olhos, brilho do focinho, coleira e patas */}
        <circle cx="50" cy="40" r="3.6" fill="#000" />
        <circle cx="70" cy="40" r="3.6" fill="#000" />
        <ellipse cx="60" cy="51" rx="5" ry="3.4" fill="#000" />
        <path d="M60 55 v5 M53 60 q7 5 14 0" stroke="#000" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M38 74 q22 10 44 0" stroke="#000" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* plaquinha de coração na coleira */}
        <path d="M60 88 c-5 -3 -7 -5 -7 -8 c0 -2 2 -3 3.5 -3 c1.5 0 2.7 1 3.5 2 c0.8 -1 2 -2 3.5 -2 c1.5 0 3.5 1 3.5 3 c0 3 -2 5 -7 8 Z" fill="#000" />
        <path d="M51 132 v-12 M69 132 v-12" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      </mask>
      <g mask={`url(#${m})`}>
        <path d="M60 62 C 36 62, 28 92, 30 116 C 31 130, 42 136, 60 136 C 78 136, 89 130, 90 116 C 92 92, 84 62, 60 62 Z" />
        <ellipse cx="60" cy="42" rx="24" ry="23" />
        <ellipse cx="60" cy="55" rx="14" ry="10" />
        <ellipse cx="34" cy="46" rx="10" ry="21" transform="rotate(18 34 46)" />
        <ellipse cx="86" cy="46" rx="10" ry="21" transform="rotate(-18 86 46)" />
        <path d="M88 124 C 104 122, 112 106, 106 92" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Gato sentado, de frente, com orelhas pontudas, bigodes e rabo enrolado.
function Cat({ className, style }: P) {
  const m = "pet" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg viewBox="0 0 120 140" className={className} style={style} fill="currentColor">
      <mask id={m}>
        <rect width="120" height="140" fill="#fff" />
        <ellipse cx="50" cy="44" rx="3" ry="4.5" fill="#000" />
        <ellipse cx="70" cy="44" rx="3" ry="4.5" fill="#000" />
        <path d="M57 52 h6 l-3 3.5 Z" fill="#000" />
        <path d="M60 55.5 q-3 4 -7 2 M60 55.5 q3 4 7 2" stroke="#000" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M44 53 l-16 -3 M44 57 l-16 3 M76 53 l16 -3 M76 57 l16 3" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M33 26 l5 -10 l6 8 Z M87 26 l-5 -10 l-6 8 Z" fill="#000" opacity="0.5" />
        <path d="M53 132 v-10 M67 132 v-10" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      </mask>
      <g mask={`url(#${m})`}>
        <path d="M60 60 C 40 60, 32 90, 34 114 C 35 130, 45 136, 60 136 C 75 136, 85 130, 86 114 C 88 90, 80 60, 60 60 Z" />
        <ellipse cx="60" cy="46" rx="25" ry="21" />
        <path d="M37 38 L 33 8 L 56 28 Z" strokeLinejoin="round" stroke="currentColor" strokeWidth="4" />
        <path d="M83 38 L 87 8 L 64 28 Z" strokeLinejoin="round" stroke="currentColor" strokeWidth="4" />
        <path d="M84 130 C 108 130, 114 104, 102 90 C 96 83, 102 74, 110 80" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Paw({ className, style }: P) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="currentColor">
      <path d="M50 48 C 34 48, 24 62, 26 74 C 28 86, 40 86, 50 82 C 60 86, 72 86, 74 74 C 76 62, 66 48, 50 48 Z" />
      <ellipse cx="20" cy="42" rx="9" ry="12" transform="rotate(-25 20 42)" />
      <ellipse cx="38" cy="22" rx="9" ry="12.5" transform="rotate(-8 38 22)" />
      <ellipse cx="62" cy="22" rx="9" ry="12.5" transform="rotate(8 62 22)" />
      <ellipse cx="80" cy="42" rx="9" ry="12" transform="rotate(25 80 42)" />
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

// Trilha de pegadas: patinhas alternando esquerda/direita, acendendo em sequência como se alguém estivesse andando.
function PawTrail({ className, angle, steps = 6, color }: { className?: string; angle: number; steps?: number; color: string }) {
  return (
    <div className={`absolute ${className ?? ""}`} style={{ rotate: `${angle}deg` }}>
      {Array.from({ length: steps }, (_, i) => (
        <Paw
          key={i}
          className={`absolute h-7 w-7 opacity-[0.15] ${color}`}
          style={{
            left: i * 46,
            top: i % 2 ? 20 : -4,
            rotate: "90deg",
            animation: `paw-step ${steps * 0.7}s ease-in-out ${i * 0.7}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

const float = (delay: number, dur = 7): React.CSSProperties => ({
  animation: `pet-float ${dur}s ease-in-out ${delay}s infinite`,
});

export function AuthBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Bichos grandes nas laterais (só em telas médias para cima) */}
      <Dog className="absolute bottom-4 left-[5%] hidden h-64 w-56 text-primary opacity-[0.16] md:block lg:h-80 lg:w-72" style={float(0, 8)} />
      <Cat className="absolute right-[5%] top-24 hidden h-60 w-52 text-accent opacity-[0.22] md:block lg:h-72 lg:w-64" style={float(1.5, 9)} />
      <Cat className="absolute left-[4%] top-16 hidden h-32 w-28 text-accent opacity-[0.16] lg:block" style={float(3, 7)} />
      <Dog className="absolute bottom-8 right-[6%] hidden h-36 w-32 text-primary opacity-[0.13] lg:block" style={float(2, 10)} />

      {/* Trilhas de patinhas */}
      <PawTrail className="bottom-[12%] left-[22%] hidden md:block" angle={-28} steps={7} color="text-accent" />
      <PawTrail className="right-[14%] top-[8%]" angle={155} steps={5} color="text-primary" />
      <PawTrail className="bottom-[4%] right-[30%] md:hidden" angle={-160} steps={4} color="text-accent" />

      {/* Patinhas soltas e corações */}
      <Paw className="absolute left-[10%] top-[40%] h-9 w-9 rotate-[-20deg] text-primary opacity-[0.12]" style={float(0.5)} />
      <Paw className="absolute right-[24%] bottom-[30%] hidden h-8 w-8 rotate-[20deg] text-accent opacity-[0.18] md:block" style={float(1.2)} />
      <Paw className="absolute left-[6%] bottom-[38%] h-6 w-6 rotate-[10deg] text-accent opacity-[0.16] md:hidden" style={float(2)} />
      <Heart className="absolute right-[24%] top-[28%] hidden h-8 w-9 text-accent opacity-[0.3] md:block" style={float(1, 6)} />
      <Heart className="absolute left-[21%] top-[30%] hidden h-6 w-7 text-primary opacity-[0.18] md:block" style={float(2.4, 6)} />
      <Heart className="absolute left-[8%] top-[18%] h-5 w-6 text-accent opacity-[0.25] lg:hidden" style={float(3.2, 6)} />
      <Heart className="absolute right-[8%] top-[64%] h-6 w-7 text-primary opacity-[0.16]" style={float(0.3, 6)} />
    </div>
  );
}
