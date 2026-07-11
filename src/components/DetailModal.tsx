'use client';

import Image from "next/image";
import { useEffect } from "react";
import { getPokemonName, getPokemonType, POKEMON_TYPE_COLORS } from "@/lib/pokemonNames";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pokemon: {
    id: number;
    name: string;
    types: { type: { name: string } }[];
    height: number;
    weight: number;
    stats: { base_stat: number; stat: { name: string } }[];
    sprites: {
      other: {
        "official-artwork": {
          front_default: string;
        };
      };
    };
  } | null;
}

const STAT_NAME_MAP: { [key: string]: string } = {
  hp: "HP",
  attack: "공격력",
  defense: "방어력",
  "special-attack": "특수공격",
  "special-defense": "특수방어",
  speed: "스피드",
};

const STAT_COLOR_MAP: { [key: string]: string } = {
  hp: "bg-red-400",
  attack: "bg-orange-400",
  defense: "bg-blue-400",
  "special-attack": "bg-purple-400",
  "special-defense": "bg-green-400",
  speed: "bg-pink-400",
};

export default function DetailModal({ isOpen, onClose, pokemon }: DetailModalProps) {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen || !pokemon) return null;

  const pokemonIdFormatted = String(pokemon.id).padStart(4, "0");
  const koreanName = getPokemonName(pokemon.id, pokemon.name);
  const primaryType = pokemon.types[0]?.type.name || "normal";
  const artworkUrl = pokemon.sprites.other["official-artwork"].front_default;

  // Conversion: height (dm -> m), weight (hg -> kg)
  const heightMeters = pokemon.height / 10;
  const weightKg = pokemon.weight / 10;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border-4 border-white animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Type Gradient Background Header */}
        <div className={`p-6 pb-24 text-white relative bg-gradient-to-b from-${primaryType === 'electric' ? 'amber-400' : primaryType === 'grass' ? 'green-500' : primaryType === 'fire' ? 'red-500' : primaryType === 'water' ? 'blue-500' : 'slate-500'} to-transparent`}
             style={{
               background: `linear-gradient(180deg, var(--type-bg, #64748b) 0%, rgba(255,255,255,0) 100%)`,
               // Custom fallback color map in styling
               color: primaryType === 'electric' ? '#1e293b' : '#ffffff',
               ['--type-bg' as any]: primaryType === 'fire' ? '#ef4444' :
                                    primaryType === 'water' ? '#3b82f6' :
                                    primaryType === 'grass' ? '#10b981' :
                                    primaryType === 'electric' ? '#fbbf24' :
                                    primaryType === 'psychic' ? '#ec4899' :
                                    primaryType === 'ice' ? '#22d3ee' :
                                    primaryType === 'dragon' ? '#6366f1' :
                                    primaryType === 'fairy' ? '#f472b6' :
                                    primaryType === 'poison' ? '#a855f7' : '#94a3b8'
             }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all duration-200 cursor-pointer text-current"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Title Info */}
          <div className="flex flex-col gap-1">
            <span className="font-extrabold text-lg opacity-85">No. {pokemonIdFormatted}</span>
            <h2 className="text-3xl font-black tracking-tight">{koreanName}</h2>
            <span className="text-sm font-semibold opacity-75 capitalize">{pokemon.name}</span>
          </div>
        </div>

        {/* Pokemon Image Floating in center */}
        <div className="absolute top-[100px] left-1/2 -translate-x-1/2 w-48 h-48 z-10 drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]">
          {artworkUrl ? (
            <Image
              src={artworkUrl}
              alt={koreanName}
              width={192}
              height={192}
              priority
              className="object-contain"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-sm">
              No Image
            </div>
          )}
        </div>

        {/* Modal Body Container */}
        <div className="pt-24 px-6 pb-6 bg-white rounded-t-3xl relative z-0 flex flex-col gap-6">
          {/* Types List */}
          <div className="flex justify-center gap-2">
            {pokemon.types.map((t, idx) => {
              const typeName = t.type.name;
              const colorClass = POKEMON_TYPE_COLORS[typeName] || "bg-slate-400 text-white border-slate-500";
              return (
                <span
                  key={idx}
                  className={`px-4 py-1.5 rounded-full text-sm font-extrabold shadow-sm border ${colorClass}`}
                >
                  {getPokemonType(typeName)}
                </span>
              );
            })}
          </div>

          {/* Physical Stats (Height, Weight) */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex flex-col items-center border-r border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">키</span>
              <span className="text-lg font-black text-slate-700">{heightMeters} m</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">몸무게</span>
              <span className="text-lg font-black text-slate-700">{weightKg} kg</span>
            </div>
          </div>

          {/* Base Stats */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-black text-slate-700 mb-1">기본 능력치</h3>
            <div className="flex flex-col gap-2.5">
              {pokemon.stats.map((s, idx) => {
                const statName = STAT_NAME_MAP[s.stat.name] || s.stat.name;
                const statColor = STAT_COLOR_MAP[s.stat.name] || "bg-slate-400";
                // Let's cap max stats at 150 for visualization percentage
                const percentage = Math.min((s.base_stat / 150) * 100, 100);

                return (
                  <div key={idx} className="flex items-center text-xs">
                    <span className="w-16 font-bold text-slate-500 text-left">{statName}</span>
                    <span className="w-8 font-extrabold text-slate-700 text-right pr-2">{s.base_stat}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${statColor}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
