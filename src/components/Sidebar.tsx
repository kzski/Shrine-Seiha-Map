"use client";

import { useState } from "react";
import { Shrine, categories } from "@/lib/shrines";
import { getDeitySymbol } from "@/lib/deityIcons";
import {
  CheckCircle2,
  Filter,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";

interface SidebarProps {
  shrines: Shrine[];
  visitedIds: Set<string>;
  selectedShrine: string | null;
  onSelectShrine: (id: string) => void;
}

export default function Sidebar({
  shrines,
  visitedIds,
  selectedShrine,
  onSelectShrine,
}: SidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const visitedCount = visitedIds.size;
  const totalCount = shrines.length;
  const percentage = Math.round((visitedCount / totalCount) * 100);

  const filteredShrines = shrines.filter((shrine) => {
    const matchesCategory = !selectedCategory || shrine.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      shrine.deity.includes(searchQuery) ||
      shrine.name.includes(searchQuery) ||
      shrine.deityReading.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryStats = categories.map((cat) => {
    const catShrines = shrines.filter((s) => s.category === cat);
    const catVisited = catShrines.filter((s) => visitedIds.has(s.id)).length;
    return { name: cat, total: catShrines.length, visited: catVisited };
  });

  return (
    <div className="h-full glass flex flex-col relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-[#d4af37]/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-[#d4af37]/5 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative p-6 border-b border-[#d4af37]/20">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">⛩️</span>
          <h1 className="text-2xl font-semibold text-[#f4e4a6] tracking-wider">
            神制覇
          </h1>
        </div>
        <p className="text-[#a0a0a0] text-sm tracking-wide">
          〜 古事記の神々を巡る旅 〜
        </p>
      </div>

      {/* Progress */}
      <div className="relative p-6 border-b border-[#d4af37]/20">
        <div className="flex justify-between items-end mb-3">
          <span className="text-[#a0a0a0] text-sm">制覇率</span>
          <div className="text-right">
            <span className="text-4xl font-bold text-[#d4af37]">{percentage}</span>
            <span className="text-xl text-[#d4af37]/70">%</span>
          </div>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out relative"
            style={{
              width: `${percentage}%`,
              background: "linear-gradient(90deg, #d4af37, #f4e4a6)",
              boxShadow: "0 0 20px rgba(212, 175, 55, 0.5)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
        </div>
        <p className="text-[#a0a0a0] text-sm mt-2 text-center">
          <span className="text-[#d4af37] font-semibold">{visitedCount}</span>
          <span className="mx-1">/</span>
          <span>{totalCount}</span>
          <span className="ml-1">柱</span>
        </p>
      </div>

      {/* Search */}
      <div className="relative p-4 border-b border-[#d4af37]/20">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]/50" size={20} />
          <input
            type="text"
            placeholder="神名・神社名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-[#d4af37]/20 rounded-xl py-3.5 pl-12 pr-4 text-base text-[#e8e4d9] placeholder-[#a0a0a0]/50 focus:outline-none focus:border-[#d4af37]/50 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="relative border-b border-[#d4af37]/20">
        <button
          onClick={() => setShowCategoryFilter(!showCategoryFilter)}
          className="w-full p-4 flex items-center justify-between text-[#e8e4d9] hover:bg-white/5 active:bg-white/10 transition-colors"
        >
          <span className="flex items-center gap-3">
            <Filter className="text-[#d4af37]" size={18} />
            <span className="text-base">カテゴリ</span>
            {selectedCategory && (
              <span className="text-sm bg-[#d4af37]/20 text-[#d4af37] px-2.5 py-1 rounded-lg">
                {selectedCategory}
              </span>
            )}
          </span>
          {showCategoryFilter ? (
            <ChevronUp className="text-[#d4af37]" size={20} />
          ) : (
            <ChevronDown className="text-[#d4af37]" size={20} />
          )}
        </button>

        {showCategoryFilter && (
          <div className="px-4 pb-4 max-h-64 overflow-y-auto">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left px-4 py-3 rounded-xl text-base mb-2 transition-colors active:scale-[0.98] ${
                !selectedCategory
                  ? "bg-[#d4af37]/20 text-[#d4af37]"
                  : "text-[#a0a0a0] hover:bg-white/5"
              }`}
            >
              すべて表示 ({totalCount})
            </button>
            {categoryStats
              .filter((c) => c.total > 0)
              .map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base mb-2 transition-colors flex justify-between active:scale-[0.98] ${
                    selectedCategory === cat.name
                      ? "bg-[#d4af37]/20 text-[#d4af37]"
                      : "text-[#a0a0a0] hover:bg-white/5"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-sm opacity-70">
                    {cat.visited}/{cat.total}
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Shrine List */}
      <div className="relative flex-1 overflow-y-auto">
        <div className="p-4 pb-20 lg:pb-4">
          <h2 className="text-xs text-[#d4af37]/50 uppercase tracking-widest mb-4">
            神々一覧（{filteredShrines.length}柱）
          </h2>
          <ul className="space-y-2">
            {filteredShrines.map((shrine) => {
              const visited = visitedIds.has(shrine.id);
              const isSelected = selectedShrine === shrine.id;
              return (
                <li key={shrine.id}>
                  <button
                    onClick={() => onSelectShrine(shrine.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all active:scale-[0.98] ${
                      isSelected
                        ? "bg-[#d4af37]/20 border border-[#d4af37]/50 shadow-lg shadow-[#d4af37]/10"
                        : visited
                        ? "bg-[#d4af37]/5 border border-[#d4af37]/20 hover:bg-[#d4af37]/10"
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                          visited
                            ? "bg-[#d4af37]/20 border border-[#d4af37]/50"
                            : "bg-white/5 border border-white/20"
                        }`}
                      >
                        {visited ? (
                          <CheckCircle2 className="text-[#d4af37]" size={22} />
                        ) : (
                          getDeitySymbol(shrine.category, shrine.id)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`font-medium truncate text-base ${
                            visited ? "text-[#d4af37]" : "text-[#e8e4d9]"
                          }`}
                        >
                          {shrine.deity}
                        </p>
                        <p className="text-sm text-[#a0a0a0] truncate">{shrine.name}</p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="relative p-4 border-t border-[#d4af37]/20 text-center">
        <p className="text-xs text-[#a0a0a0]/50">
          Built with Claude Code
        </p>
      </div>
    </div>
  );
}
