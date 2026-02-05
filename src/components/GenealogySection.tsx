"use client";

import { Shrine } from "@/lib/shrines";
import { getDeitySymbol } from "@/lib/deityIcons";
import { CheckCircle2, ChevronRight, Users } from "lucide-react";

interface GenealogySectionProps {
  shrines: Shrine[];
  visitedIds: Set<string>;
  onSelectDeity: (id: string) => void;
}

// 主要系統の定義
const genealogyTrees = [
  {
    name: "天津神系譜",
    description: "伊邪那岐から天孫降臨まで",
    rootIds: ["izanagi", "izanami"],
    icon: "☀️",
  },
  {
    name: "出雲系譜",
    description: "須佐之男から出雲の神々",
    rootIds: ["susanoo"],
    icon: "🌊",
  },
  {
    name: "皇統系譜",
    description: "天孫から神武天皇まで",
    rootIds: ["ninigi"],
    icon: "👑",
  },
];

export default function GenealogySection({
  shrines,
  visitedIds,
  onSelectDeity,
}: GenealogySectionProps) {
  const shrineMap = new Map(shrines.map((s) => [s.id, s]));

  // 神の子孫を再帰的に取得
  function getDescendants(
    deityId: string,
    depth: number = 0,
    visited: Set<string> = new Set()
  ): { deity: Shrine; depth: number; children: ReturnType<typeof getDescendants> }[] {
    if (depth > 4 || visited.has(deityId)) return [];
    visited.add(deityId);

    const deity = shrineMap.get(deityId);
    if (!deity) return [];

    const childIds = deity.relations?.children || [];
    const children = childIds.flatMap((childId) =>
      getDescendants(childId, depth + 1, new Set(visited))
    );

    return [{ deity, depth, children }];
  }

  // ツリーノードをレンダリング
  function renderTreeNode(
    node: { deity: Shrine; depth: number; children: ReturnType<typeof getDescendants> },
    isLast: boolean = false
  ) {
    const isVisited = visitedIds.has(node.deity.id);

    return (
      <div key={node.deity.id} className="relative">
        <button
          onClick={() => onSelectDeity(node.deity.id)}
          className={`w-full text-left p-2.5 rounded-lg transition-all active:scale-[0.98] flex items-center gap-3 ${
            isVisited
              ? "bg-[#d4af37]/10 border border-[#d4af37]/30"
              : "bg-white/5 border border-white/10 hover:bg-white/10"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 ${
              isVisited
                ? "bg-[#d4af37]/20 border border-[#d4af37]/50"
                : "bg-white/5 border border-white/20"
            }`}
          >
            {isVisited ? (
              <CheckCircle2 className="text-[#d4af37]" size={16} />
            ) : (
              getDeitySymbol(node.deity.category, node.deity.id)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`font-medium text-sm truncate ${
                isVisited ? "text-[#d4af37]" : "text-[#e8e4d9]"
              }`}
            >
              {node.deity.deity}
            </p>
            <p className="text-xs text-[#a0a0a0] truncate">{node.deity.category}</p>
          </div>
          <ChevronRight className="text-[#a0a0a0] flex-shrink-0" size={16} />
        </button>

        {node.children.length > 0 && (
          <div className="ml-4 mt-1 pl-4 border-l border-[#d4af37]/20 space-y-1">
            {node.children.map((child, idx) =>
              renderTreeNode(child, idx === node.children.length - 1)
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-b from-[#1a1a2e] to-[#2d2d44] overflow-y-auto">
      <div className="p-4 pb-24">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-[#d4af37]" size={20} />
            <h2 className="text-lg font-semibold text-[#f4e4a6]">神話系譜</h2>
          </div>
          <p className="text-xs text-[#a0a0a0]">
            神々の系譜を辿り、神話の世界を探求しましょう
          </p>
        </div>

        {/* 系譜ツリー */}
        <div className="space-y-6">
          {genealogyTrees.map((tree) => {
            const treeNodes = tree.rootIds.flatMap((rootId) =>
              getDescendants(rootId)
            );

            return (
              <div key={tree.name} className="glass rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{tree.icon}</span>
                  <div>
                    <h3 className="text-base font-medium text-[#f4e4a6]">
                      {tree.name}
                    </h3>
                    <p className="text-xs text-[#a0a0a0]">{tree.description}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {treeNodes.map((node, idx) =>
                    renderTreeNode(node, idx === treeNodes.length - 1)
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 統計 */}
        <div className="mt-6 p-4 glass rounded-xl">
          <p className="text-xs text-[#d4af37]/70 mb-2">系譜に登場する神々</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#a0a0a0]">参拝済</span>
            <span className="text-lg font-bold text-[#d4af37]">
              {visitedIds.size} / {shrines.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
