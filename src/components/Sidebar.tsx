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
      <div className="relative py-3 px-4 border-b border-[#d4af37]/20">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⛩️</span>
          <h1 className="text-xl font-semibold text-[#f4e4a6] tracking-wider">
            神制覇
          </h1>
          <span className="text-[#a0a0a0] text-xs ml-auto">古事記の神々を巡る旅</span>
        </div>
      </div>

      {/* Progress */}
      <div className="relative py-3 px-4 border-b border-[#d4af37]/20">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[#a0a0a0] text-xs">制覇率</span>
              <span className="text-xs text-[#a0a0a0]">
                <span className="text-[#d4af37] font-semibold">{visitedCount}</span>/{totalCount}柱
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out relative"
                style={{
                  width: `${percentage}%`,
                  background: "linear-gradient(90deg, #d4af37, #f4e4a6)",
                  boxShadow: "0 0 10px rgba(212, 175, 55, 0.5)",
                }}
              />
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-[#d4af37]">{percentage}</span>
            <span className="text-lg text-[#d4af37]/70">%</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative py-2 px-4 border-b border-[#d4af37]/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/50" size={16} />
          <input
            type="text"
            placeholder="神名・神社名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-[#d4af37]/20 rounded-lg py-2 pl-9 pr-3 text-sm text-[#e8e4d9] placeholder-[#a0a0a0]/50 focus:outline-none focus:border-[#d4af37]/50 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="relative border-b border-[#d4af37]/20">
        <button
          onClick={() => setShowCategoryFilter(!showCategoryFilter)}
          className="w-full py-2 px-4 flex items-center justify-between text-[#e8e4d9] hover:bg-white/5 active:bg-white/10 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Filter className="text-[#d4af37]" size={16} />
            <span className="text-sm">カテゴリ</span>
            {selectedCategory && (
              <span className="text-xs bg-[#d4af37]/20 text-[#d4af37] px-2 py-0.5 rounded">
                {selectedCategory}
              </span>
            )}
          </span>
          {showCategoryFilter ? (
            <ChevronUp className="text-[#d4af37]" size={18} />
          ) : (
            <ChevronDown className="text-[#d4af37]" size={18} />
          )}
        </button>

        {showCategoryFilter && (
          <div className="px-4 pb-3 max-h-48 overflow-y-auto">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors active:scale-[0.98] ${
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
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors flex justify-between active:scale-[0.98] ${
                    selectedCategory === cat.name
                      ? "bg-[#d4af37]/20 text-[#d4af37]"
                      : "text-[#a0a0a0] hover:bg-white/5"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs opacity-70">
                    {cat.visited}/{cat.total}
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Shrine List */}
      <div className="relative flex-1 overflow-y-auto">
        <div className="px-3 py-2 pb-20 lg:pb-3">
          <h2 className="text-xs text-[#d4af37]/50 uppercase tracking-widest mb-2 px-1">
            神々一覧（{filteredShrines.length}柱）
          </h2>
          <ul className="space-y-1.5">
            {filteredShrines.map((shrine) => {
              const visited = visitedIds.has(shrine.id);
              const isSelected = selectedShrine === shrine.id;
              return (
                <li key={shrine.id}>
                  <button
                    onClick={() => onSelectShrine(shrine.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all active:scale-[0.98] ${
                      isSelected
                        ? "bg-[#d4af37]/20 border border-[#d4af37]/50 shadow-lg shadow-[#d4af37]/10"
                        : visited
                        ? "bg-[#d4af37]/5 border border-[#d4af37]/20 hover:bg-[#d4af37]/10"
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                          visited
                            ? "bg-[#d4af37]/20 border border-[#d4af37]/50"
                            : "bg-white/5 border border-white/20"
                        }`}
                      >
                        {visited ? (
                          <CheckCircle2 className="text-[#d4af37]" size={18} />
                        ) : (
                          getDeitySymbol(shrine.category, shrine.id)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`font-medium truncate text-sm ${
                            visited ? "text-[#d4af37]" : "text-[#e8e4d9]"
                          }`}
                        >
                          {shrine.deity}
                        </p>
                        <p className="text-xs text-[#a0a0a0] truncate">{shrine.name}</p>
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
      <div className="relative py-2 px-4 border-t border-[#d4af37]/20 text-center">
        <p className="text-xs text-[#a0a0a0]/50">
          Supported by K.SAKAI
        </p>
      </div>
    </div>
  );
}
