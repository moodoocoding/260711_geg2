'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import DetailModal from "@/components/DetailModal";
import { getPokemonName, getPokemonType, POKEMON_TYPE_COLORS, POKEMON_KOREAN_TYPES } from "@/lib/pokemonNames";

interface PokemonDetail {
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
}

interface TypePokemon {
  pokemon: {
    name: string;
    url: string;
  };
}

const ITEMS_PER_PAGE = 24;
const MAX_GEN1_ID = 151;

const getPokemonIdFromUrl = (url: string): number => {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
};

export default function DogamPage() {
  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState("all");
  const [pokemonList, setPokemonList] = useState<PokemonDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for type filtering pagination
  const [allTypePokemon, setAllTypePokemon] = useState<{ name: string; url: string }[]>([]);
  
  // Modal states
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch type list or normal paginated list
  useEffect(() => {
    let active = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        if (selectedType === "all") {
          const offset = (page - 1) * ITEMS_PER_PAGE;
          const limit = Math.min(ITEMS_PER_PAGE, MAX_GEN1_ID - offset);

          if (limit <= 0) {
            if (active) {
              setPokemonList([]);
              setIsLoading(false);
            }
            return;
          }

          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
          );
          if (!response.ok) throw new Error("포켓몬 목록을 불러오지 못했습니다.");
          const data = await response.json();

          const detailPromises = data.results.map(async (item: { url: string }) => {
            const detailRes = await fetch(item.url);
            if (!detailRes.ok) throw new Error("포켓몬 상세 정보를 불러오지 못했습니다.");
            return detailRes.json();
          });

          const details = await Promise.all(detailPromises);
          if (active) {
            setPokemonList(details);
            setIsLoading(false);
          }
        } else {
          // If filtering by type
          let listToPaginate = allTypePokemon;

          // If type changes, we need to fetch the entire list for that type first
          if (allTypePokemon.length === 0 || page === 1) {
            const response = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`);
            if (!response.ok) throw new Error("타입 정보를 불러오지 못했습니다.");
            const data = await response.json();

            // Filter Gen 1 only (ID <= 151)
            const gen1TypePokemon = data.pokemon
              .map((p: TypePokemon) => p.pokemon)
              .filter((p: { url: string }) => getPokemonIdFromUrl(p.url) <= MAX_GEN1_ID);

            listToPaginate = gen1TypePokemon;
            if (active) {
              setAllTypePokemon(gen1TypePokemon);
            }
          }

          const offset = (page - 1) * ITEMS_PER_PAGE;
          const pageItems = listToPaginate.slice(offset, offset + ITEMS_PER_PAGE);

          const detailPromises = pageItems.map(async (item: { url: string }) => {
            const detailRes = await fetch(item.url);
            if (!detailRes.ok) throw new Error("포켓몬 상세 정보를 불러오지 못했습니다.");
            return detailRes.json();
          });

          const details = await Promise.all(detailPromises);
          if (active) {
            setPokemonList(details);
            setIsLoading(false);
          }
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [page, selectedType, allTypePokemon]);

  // Handle Type Filter Change
  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setPage(1); // Reset to first page
    setAllTypePokemon([]); // Reset current type list
    setPokemonList([]);
  };

  // Pagination totals
  const totalItems = selectedType === "all" ? MAX_GEN1_ID : allTypePokemon.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Open modal handler
  const openModal = (pokemon: PokemonDetail) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#fdfdf9] flex flex-col justify-between overflow-x-hidden selection:bg-brand-yellow-light">
      
      {/* Background Decorative Blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[5%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-brand-yellow/10 blur-[80px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-brand-blue/10 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 md:py-6 flex items-center justify-between border-b border-slate-100">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center shadow-md shadow-brand-yellow/30 border-2 border-white">
            <svg className="w-5 h-5 text-brand-blue-dark" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
              <circle cx="12" cy="12" r="3" />
              <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tight text-slate-800">
            포켓몬 <span className="text-brand-blue">탐험대</span>
          </span>
        </Link>

        <nav>
          <ul className="flex items-center gap-4 sm:gap-8">
            <li>
              <Link
                id="nav-pokemon-intro"
                href="/"
                className="text-sm md:text-base font-semibold text-slate-600 hover:text-brand-blue transition-colors duration-200"
              >
                포켓몬 소개
              </Link>
            </li>
            <li>
              <Link
                id="nav-pokemon-encyclopedia"
                href="/dogam"
                className="text-sm md:text-base font-bold text-brand-blue border-b-2 border-brand-blue pb-1"
              >
                포켓몬 도감
              </Link>
            </li>
            <li>
              <Link
                id="nav-adventure-start"
                href="/"
                className="text-sm md:text-base font-bold bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full transition-all duration-300 border border-brand-blue/20"
              >
                모험 시작
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-10 flex-1 flex flex-col gap-10">
        
        {/* Title Section */}
        <div className="text-center flex flex-col gap-3 max-w-2xl mx-auto">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">포켓몬 도감</h1>
          <p className="text-base text-slate-500 font-medium">
            1세대 주요 포켓몬 151마리의 상세 정보를 한눈에 모아보세요. 필터를 사용해 타입별로 찾을 수도 있습니다.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-col gap-3">
          <span className="text-sm font-bold text-slate-400 pl-1">타입 필터</span>
          <div className="flex flex-wrap gap-2 pb-2">
            <button
              onClick={() => handleTypeChange("all")}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black border transition-all duration-200 cursor-pointer ${
                selectedType === "all"
                  ? "bg-brand-blue text-white border-brand-blue shadow-md shadow-brand-blue/20"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              전체
            </button>
            {Object.keys(POKEMON_KOREAN_TYPES).map((typeKey) => {
              const active = selectedType === typeKey;
              return (
                <button
                  key={typeKey}
                  onClick={() => handleTypeChange(typeKey)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black border transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-brand-blue text-white border-brand-blue shadow-md shadow-brand-blue/20"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {POKEMON_KOREAN_TYPES[typeKey]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pokédex Card Grid */}
        {isLoading ? (
          // Skeleton loader
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-100 flex flex-col gap-4 animate-pulse"
              >
                <div className="w-12 h-4 bg-slate-200 rounded-full" />
                <div className="w-32 h-32 bg-slate-100 rounded-full mx-auto" />
                <div className="w-20 h-6 bg-slate-200 rounded-full mx-auto" />
                <div className="flex gap-2 justify-center">
                  <div className="w-12 h-5 bg-slate-150 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error Screen
          <div className="bg-white rounded-3xl p-10 border border-slate-100 flex flex-col items-center gap-4 text-center max-w-md mx-auto shadow-md">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">연결 오류</h3>
            <p className="text-sm text-slate-500">{error}</p>
            <button
              onClick={() => {
                setPage(1);
                setAllTypePokemon([]);
                setIsLoading(true);
              }}
              className="px-6 py-2.5 bg-brand-blue text-white rounded-full font-bold hover:bg-brand-blue-dark transition-all duration-200"
            >
              다시 시도
            </button>
          </div>
        ) : pokemonList.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-3xl p-12 border border-slate-100 flex flex-col items-center gap-3 text-center max-w-md mx-auto">
            <p className="text-lg font-bold text-slate-700">해당 타입의 포켓몬이 없습니다.</p>
            <button
              onClick={() => handleTypeChange("all")}
              className="text-brand-blue font-bold text-sm underline cursor-pointer"
            >
              전체 목록으로 돌아가기
            </button>
          </div>
        ) : (
          // Pokémon Cards
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pokemonList.map((pokemon) => {
              const primaryType = pokemon.types[0]?.type.name || "normal";
              const artworkUrl = pokemon.sprites.other["official-artwork"].front_default;
              const koreanName = getPokemonName(pokemon.id, pokemon.name);

              return (
                <div
                  key={pokemon.id}
                  onClick={() => openModal(pokemon)}
                  className="bg-white rounded-3xl p-6 border border-slate-150/60 shadow-sm hover:-translate-y-2 hover:shadow-xl hover:border-brand-yellow-light/60 transition-all duration-300 flex flex-col justify-between gap-4 cursor-pointer group relative overflow-hidden"
                >
                  {/* Subtle background color based on primary type */}
                  <div
                    className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-300 pointer-events-none"
                    style={{
                      backgroundColor: primaryType === 'fire' ? '#ef4444' :
                                      primaryType === 'water' ? '#3b82f6' :
                                      primaryType === 'grass' ? '#10b981' :
                                      primaryType === 'electric' ? '#fbbf24' :
                                      primaryType === 'psychic' ? '#ec4899' :
                                      primaryType === 'poison' ? '#a855f7' : '#64748b'
                    }}
                  />

                  {/* Card Header (No.) */}
                  <div className="flex justify-between items-center z-10">
                    <span className="text-xs font-black text-slate-400">
                      No. {String(pokemon.id).padStart(4, "0")}
                    </span>
                  </div>

                  {/* Pokemon Image */}
                  <div className="relative w-32 h-32 mx-auto z-10 flex items-center justify-center">
                    <div className="absolute w-24 h-24 rounded-full bg-slate-50 group-hover:bg-brand-yellow/10 transition-colors duration-300 z-0" />
                    {artworkUrl ? (
                      <Image
                        src={artworkUrl}
                        alt={koreanName}
                        width={112}
                        height={112}
                        className="object-contain z-10 group-hover:scale-110 transition-transform duration-300 ease-out"
                        priority={pokemon.id <= 24}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-xs z-10">
                        이미지 없음
                      </div>
                    )}
                  </div>

                  {/* Pokemon Info */}
                  <div className="text-center flex flex-col gap-2 z-10">
                    <h2 className="text-lg font-black text-slate-700 group-hover:text-brand-blue transition-colors duration-200">
                      {koreanName}
                    </h2>
                    
                    {/* Types */}
                    <div className="flex gap-1.5 justify-center">
                      {pokemon.types.map((t, idx) => {
                        const typeName = t.type.name;
                        const colorClass = POKEMON_TYPE_COLORS[typeName] || "bg-slate-400 text-white border-slate-500";
                        return (
                          <span
                            key={idx}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold shadow-sm border ${colorClass}`}
                          >
                            {getPokemonType(typeName)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 py-6 border-t border-slate-100">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-5 py-2.5 rounded-full font-extrabold text-sm border flex items-center gap-1.5 transition-all duration-200 ${
                page === 1
                  ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:scale-95 shadow-sm cursor-pointer"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              이전
            </button>

            <span className="text-sm font-black text-slate-500">
              {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-5 py-2.5 rounded-full font-extrabold text-sm border flex items-center gap-1.5 transition-all duration-200 ${
                page === totalPages
                  ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:scale-95 shadow-sm cursor-pointer"
              }`}
            >
              다음
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 text-xs font-semibold text-slate-400 gap-2">
        <span>© 2026 포켓몬 탐험대. All Rights Reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-brand-blue transition-colors">이용약관</a>
          <a href="#" className="hover:text-brand-blue transition-colors">개인정보처리방침</a>
        </div>
      </footer>

      {/* Detail Info Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pokemon={selectedPokemon}
      />
    </div>
  );
}
