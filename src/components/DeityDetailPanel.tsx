"use client";

import { Shrine } from "@/lib/shrines";
import { getDeitySymbol } from "@/lib/deityIcons";
import { X, MapPin, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";

interface DeityDetailPanelProps {
  shrine: Shrine;
  visited: boolean;
  onVisit: () => void;
  onClose: () => void;
  isClosing: boolean;
}

// 神様の通り名（異名・別称）
const deityEpithets: Record<string, string> = {
  amaterasu: "高天原の至高神",
  tsukuyomi: "夜を統べる者",
  susanoo: "荒ぶる海の支配者",
  izanagi: "国土を生みし父神",
  izanami: "万物を産みし母神",
  okuninushi: "幽世の大王",
  konohanasakuya: "桜花の如く咲き誇る姫",
  kagutsuchi: "灼熱の化身",
  takemikazuchi: "雷鳴轟く武神",
  futsunushi: "神剣を振るう者",
  ninigi: "天より降りし穂の神",
  jimmu: "初代の天子",
  yamatotakeru: "東国を平らげし英雄",
  yatagarasu: "太陽に仕える霊鳥",
  omoikane: "八百万の知恵袋",
  amenouzume: "神々を笑わせし舞姫",
  amenotajikarao: "岩戸を開きし力持ち",
  sarutahiko: "道を照らす導き手",
  oyamatsumi: "山々を統べる大神",
  watatsumi: "海原の龍王",
  ukanomitama: "稲穂を司る豊穣神",
  toyoukehime: "食物を恵む女神",
  hachiman: "武家の守護神",
  benzaiten: "福徳を授ける天女",
  ebisu: "商いの神",
  tenjin: "学問の神",
  inaba_usagi: "縁を結ぶ白き使者",
};

// 神話の一節
const mythologyQuotes: Record<string, string> = {
  amaterasu: "「我は高天原を照らす者なり」",
  tsukuyomi: "「夜の国を治めよと命じられたり」",
  susanoo: "「八雲立つ 出雲八重垣 妻籠みに 八重垣作る その八重垣を」",
  izanagi: "「この漂える国を修め理り固め成せ」",
  izanami: "「愛しき我が夫よ、かくなさば汝の国の人草、一日に千頭絞り殺さむ」",
  okuninushi: "「汝、兄神たちの試練を越え、この国の王となれ」",
  takemikazuchi: "「この葦原中国は我が子孫の治むべき国なり」",
  jimmu: "「橿原の宮に都を定め、天下を治めん」",
  yamatotakeru: "「倭は国のまほろば たたなづく青垣 山隠れる 倭し麗し」",
};

export default function DeityDetailPanel({
  shrine,
  visited,
  onVisit,
  onClose,
  isClosing,
}: DeityDetailPanelProps) {
  const epithet = deityEpithets[shrine.id] || shrine.category + "の神";
  const quote = mythologyQuotes[shrine.id];

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-[2000] ${
        isClosing ? "slide-out-right" : "slide-in-right"
      }`}
    >
      <div className="h-full bg-gradient-to-b from-[#1a1a2e] to-[#2d2d44] border-l border-[#c9a227]/30 flex flex-col shadow-2xl">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full glass-light hover:bg-white/10 transition-colors z-10"
        >
          <X className="text-[#d4af37]" size={24} />
        </button>

        {/* ヘッダー部分 */}
        <div className="relative pt-8 pb-6 px-6 border-b border-[#d4af37]/20">
          {/* 背景の装飾 */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-[#d4af37] to-transparent blur-3xl" />
          </div>

          <div className="relative flex items-start gap-5">
            {/* シンボル */}
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${
                visited
                  ? "bg-gradient-to-br from-[#d4af37]/30 to-[#d4af37]/10 border-2 border-[#d4af37]"
                  : "bg-white/5 border-2 border-white/20"
              }`}
              style={{
                boxShadow: visited
                  ? "0 0 30px rgba(212, 175, 55, 0.4)"
                  : "0 0 20px rgba(255, 255, 255, 0.1)",
              }}
            >
              {getDeitySymbol(shrine.category, shrine.id)}
            </div>

            <div className="flex-1 min-w-0">
              {/* 通り名 */}
              <p className="text-sm text-[#d4af37]/80 mb-1 tracking-wider">{epithet}</p>
              {/* 神名 */}
              <h2 className="text-2xl font-semibold text-[#f4e4a6] mb-1">{shrine.deity}</h2>
              {/* 読み */}
              <p className="text-sm text-[#a0a0a0]">{shrine.deityReading}</p>
            </div>
          </div>

          {/* 神話の引用 */}
          {quote && (
            <div className="mt-6 p-4 glass-light rounded-lg">
              <p className="text-sm text-[#e8e4d9]/80 italic leading-relaxed">{quote}</p>
            </div>
          )}
        </div>

        {/* コンテンツ部分 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 鎮座地 */}
          <div className="fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="text-[#d4af37]" size={18} />
              <h3 className="text-sm font-medium text-[#d4af37] tracking-wider">鎮座地</h3>
            </div>
            <div className="pl-6">
              <p className="text-lg text-[#e8e4d9] font-medium">{shrine.name}</p>
              <p className="text-sm text-[#a0a0a0]">{shrine.location}</p>
            </div>
          </div>

          {/* 神格 */}
          <div className="fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-[#d4af37]" size={18} />
              <h3 className="text-sm font-medium text-[#d4af37] tracking-wider">神格</h3>
            </div>
            <p className="pl-6 text-[#e8e4d9]/90 leading-relaxed">{shrine.description}</p>
          </div>

          {/* 神話 */}
          <div className="fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="text-[#d4af37]" size={18} />
              <h3 className="text-sm font-medium text-[#d4af37] tracking-wider">神話</h3>
            </div>
            <p className="pl-6 text-[#e8e4d9]/90 leading-relaxed">{shrine.mythology}</p>
          </div>

          {/* ご利益 */}
          <div className="fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="p-4 glass-light rounded-lg">
              <p className="text-xs text-[#d4af37]/70 mb-1">ご利益</p>
              <p className="text-[#f4e4a6] font-medium">{shrine.blessing}</p>
            </div>
          </div>

          {/* カテゴリ */}
          <div className="fade-in" style={{ animationDelay: "0.5s" }}>
            <span className="inline-block px-3 py-1 text-sm bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full text-[#d4af37]">
              {shrine.category}
            </span>
          </div>
        </div>

        {/* フッター（参拝ボタン） */}
        <div className="p-6 border-t border-[#d4af37]/20">
          {visited ? (
            <div className="flex items-center justify-center gap-3 py-4 glass-light rounded-xl text-[#d4af37]">
              <CheckCircle2 size={24} />
              <span className="text-lg font-medium">参拝済</span>
            </div>
          ) : (
            <button
              onClick={onVisit}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8962d] text-[#0c0c14] font-semibold text-lg hover:from-[#f4e4a6] hover:to-[#d4af37] transition-all shadow-lg hover:shadow-[#d4af37]/30"
            >
              ⛩️ 参拝を記録する
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
