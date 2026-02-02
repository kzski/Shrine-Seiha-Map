"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { db } from "@/lib/db";
import { shrines } from "@/lib/shrines";
import Sidebar from "@/components/Sidebar";
import DeityDetailPanel from "@/components/DeityDetailPanel";
import { Loader2, Menu, X } from "lucide-react";

const ShrineMap = dynamic(() => import("@/components/ShrineMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#0c0c14]">
      <div className="text-center">
        <div className="text-6xl mb-6 animate-pulse">⛩️</div>
        <Loader2 className="animate-spin text-[#d4af37] mx-auto mb-4" size={32} />
        <p className="text-[#a0a0a0]">神々の地図を展開中...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShrine, setSelectedShrine] = useState<string | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [isDetailPanelClosing, setIsDetailPanelClosing] = useState(false);

  useEffect(() => {
    loadVisits();
  }, []);

  async function loadVisits() {
    try {
      const visits = await db.visits.toArray();
      const ids = new Set(visits.map((v) => v.shrineId));
      setVisitedIds(ids);
    } catch (error) {
      console.error("Failed to load visits:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVisit(shrineId: string) {
    try {
      await db.visits.add({
        shrineId,
        visitedAt: new Date(),
      });
      setVisitedIds((prev) => new Set([...prev, shrineId]));
    } catch (error) {
      console.error("Failed to save visit:", error);
    }
  }

  function handleSelectShrine(shrineId: string | null) {
    if (shrineId) {
      setSelectedShrine(shrineId);
      setShowMobileSidebar(false);
      setIsDetailPanelClosing(false);
      setShowDetailPanel(true);
    }
  }

  function handleCloseDetailPanel() {
    setIsDetailPanelClosing(true);
    setTimeout(() => {
      setShowDetailPanel(false);
      setSelectedShrine(null);
      setIsDetailPanelClosing(false);
    }, 300);
  }

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0c0c14] relative">
        <div className="text-center z-10">
          <div className="text-8xl mb-8 animate-pulse">⛩️</div>
          <Loader2 className="animate-spin text-[#d4af37] mx-auto mb-4" size={40} />
          <p className="text-[#a0a0a0] text-lg tracking-wider">神々の記録を読み込み中...</p>
        </div>
      </div>
    );
  }

  const percentage = Math.round((visitedIds.size / shrines.length) * 100);
  const selectedShrineData = shrines.find((s) => s.id === selectedShrine);

  return (
    <div className="h-screen w-screen flex overflow-hidden relative">
      {/* Desktop Sidebar */}
      <div className="w-96 flex-shrink-0 hidden lg:block relative z-10">
        <Sidebar
          shrines={shrines}
          visitedIds={visitedIds}
          selectedShrine={selectedShrine}
          onSelectShrine={handleSelectShrine}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-[2000] lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowMobileSidebar(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 shadow-2xl slide-in-right">
            <button
              onClick={() => setShowMobileSidebar(false)}
              className="absolute top-4 right-4 p-2 rounded-full glass-light hover:bg-white/10 transition-colors z-10"
            >
              <X className="text-[#d4af37]" size={24} />
            </button>
            <Sidebar
              shrines={shrines}
              visitedIds={visitedIds}
              selectedShrine={selectedShrine}
              onSelectShrine={handleSelectShrine}
            />
          </div>
        </div>
      )}

      {/* Map */}
      <div className="flex-1 relative z-0">
        <ShrineMap
          shrines={shrines}
          visitedIds={visitedIds}
          selectedShrine={selectedShrine}
          onSelectShrine={handleSelectShrine}
        />

        {/* Mobile Header */}
        <div className="absolute top-4 left-4 right-4 lg:hidden z-[1000]">
          <div className="glass rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="p-2 rounded-lg glass-light hover:bg-white/10 transition-colors"
              >
                <Menu className="text-[#d4af37]" size={24} />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⛩️</span>
                <h1 className="text-lg font-semibold text-[#f4e4a6]">神制覇</h1>
              </div>
              <span className="text-[#d4af37] font-bold text-lg">{percentage}%</span>
            </div>
            <div className="mt-3">
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    background: "linear-gradient(90deg, #d4af37, #f4e4a6)",
                    boxShadow: "0 0 10px rgba(212, 175, 55, 0.5)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 glass rounded-xl p-4 shadow-lg z-[1000]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6"
                style={{
                  filter: "drop-shadow(0 0 4px rgba(255, 255, 255, 0.4))",
                }}
                dangerouslySetInnerHTML={{
                  __html: `<svg viewBox="0 0 64 64" fill="#e8e4d9"><rect x="12" y="20" width="6" height="40" rx="1"/><rect x="46" y="20" width="6" height="40" rx="1"/><rect x="4" y="8" width="56" height="6" rx="2"/><rect x="8" y="16" width="48" height="4" rx="1"/><rect x="14" y="26" width="36" height="3" rx="1"/></svg>`,
                }}
              />
              <span className="text-sm text-[#a0a0a0]">未参拝</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6"
                style={{
                  filter: "drop-shadow(0 0 4px rgba(212, 175, 55, 0.6))",
                }}
                dangerouslySetInnerHTML={{
                  __html: `<svg viewBox="0 0 64 64" fill="#d4af37"><rect x="12" y="20" width="6" height="40" rx="1"/><rect x="46" y="20" width="6" height="40" rx="1"/><rect x="4" y="8" width="56" height="6" rx="2"/><rect x="8" y="16" width="48" height="4" rx="1"/><rect x="14" y="26" width="36" height="3" rx="1"/></svg>`,
                }}
              />
              <span className="text-sm text-[#d4af37]">参拝済</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {showDetailPanel && selectedShrineData && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-[1500] lg:bg-transparent"
            onClick={handleCloseDetailPanel}
          />
          <DeityDetailPanel
            shrine={selectedShrineData}
            visited={visitedIds.has(selectedShrineData.id)}
            onVisit={() => handleVisit(selectedShrineData.id)}
            onClose={handleCloseDetailPanel}
            isClosing={isDetailPanelClosing}
          />
        </>
      )}
    </div>
  );
}
