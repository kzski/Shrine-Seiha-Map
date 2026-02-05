"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { db } from "@/lib/db";
import { shrines } from "@/lib/shrines";
import Sidebar from "@/components/Sidebar";
import DeityDetailPanel from "@/components/DeityDetailPanel";
import { Loader2, Menu, X, List, MapIcon } from "lucide-react";

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
  const [isMobileSidebarClosing, setIsMobileSidebarClosing] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [isDetailPanelClosing, setIsDetailPanelClosing] = useState(false);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");

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
      closeMobileSidebar();
      setIsDetailPanelClosing(false);
      setShowDetailPanel(true);
      // モバイルでリスト表示中なら地図に切り替え
      if (mobileView === "list") {
        setMobileView("map");
      }
    }
  }

  function closeMobileSidebar() {
    if (showMobileSidebar) {
      setIsMobileSidebarClosing(true);
      setTimeout(() => {
        setShowMobileSidebar(false);
        setIsMobileSidebarClosing(false);
      }, 300);
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
            onClick={closeMobileSidebar}
          />
          <div
            className={`absolute left-0 top-0 bottom-0 w-[85%] max-w-sm shadow-2xl ${
              isMobileSidebarClosing ? "slide-out-left" : "slide-in-left"
            }`}
          >
            <button
              onClick={closeMobileSidebar}
              className="absolute top-4 right-4 p-3 rounded-full glass-light hover:bg-white/10 transition-colors z-10"
              aria-label="メニューを閉じる"
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

      {/* Main Content Area */}
      <div className="flex-1 relative z-0 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden z-[1000] safe-area-top">
          <div className="glass border-b border-[#d4af37]/20 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="p-3 -ml-2 rounded-xl glass-light hover:bg-white/10 transition-colors active:scale-95"
                aria-label="メニューを開く"
              >
                <Menu className="text-[#d4af37]" size={22} />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⛩️</span>
                <h1 className="text-lg font-semibold text-[#f4e4a6]">神制覇</h1>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[#d4af37] font-bold text-lg">{percentage}%</span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-2">
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

        {/* Map / List View */}
        <div className="flex-1 relative">
          {/* Map View */}
          <div className={`absolute inset-0 ${mobileView === "map" ? "block" : "hidden lg:block"}`}>
            <ShrineMap
              shrines={shrines}
              visitedIds={visitedIds}
              selectedShrine={selectedShrine}
              onSelectShrine={handleSelectShrine}
            />
          </div>

          {/* Mobile List View */}
          <div
            className={`absolute inset-0 lg:hidden overflow-y-auto bg-gradient-to-b from-[#1a1a2e] to-[#2d2d44] ${
              mobileView === "list" ? "block" : "hidden"
            }`}
          >
            <div className="p-4 pb-24">
              <h2 className="text-sm text-[#d4af37]/70 mb-4 tracking-wider">
                神々一覧（{shrines.length}柱）
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {shrines.map((shrine) => {
                  const visited = visitedIds.has(shrine.id);
                  return (
                    <button
                      key={shrine.id}
                      onClick={() => handleSelectShrine(shrine.id)}
                      className={`p-4 rounded-xl text-left transition-all active:scale-[0.98] ${
                        visited
                          ? "bg-[#d4af37]/10 border border-[#d4af37]/30"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      <div className="text-2xl mb-2">
                        {visited ? "✅" : "⛩️"}
                      </div>
                      <p
                        className={`font-medium text-sm truncate ${
                          visited ? "text-[#d4af37]" : "text-[#e8e4d9]"
                        }`}
                      >
                        {shrine.deity}
                      </p>
                      <p className="text-xs text-[#a0a0a0] truncate mt-0.5">
                        {shrine.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Desktop Legend */}
          <div className="absolute bottom-4 left-4 glass rounded-xl p-4 shadow-lg z-[1000] hidden lg:block">
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

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[1000] safe-area-bottom">
          <div className="glass border-t border-[#d4af37]/20">
            <div className="flex">
              <button
                onClick={() => setMobileView("map")}
                className={`flex-1 flex flex-col items-center py-3 transition-colors ${
                  mobileView === "map"
                    ? "text-[#d4af37]"
                    : "text-[#a0a0a0] active:text-[#d4af37]/70"
                }`}
              >
                <MapIcon size={22} />
                <span className="text-xs mt-1">地図</span>
              </button>
              <button
                onClick={() => setMobileView("list")}
                className={`flex-1 flex flex-col items-center py-3 transition-colors ${
                  mobileView === "list"
                    ? "text-[#d4af37]"
                    : "text-[#a0a0a0] active:text-[#d4af37]/70"
                }`}
              >
                <List size={22} />
                <span className="text-xs mt-1">一覧</span>
              </button>
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="flex-1 flex flex-col items-center py-3 text-[#a0a0a0] active:text-[#d4af37]/70 transition-colors"
              >
                <Menu size={22} />
                <span className="text-xs mt-1">メニュー</span>
              </button>
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
