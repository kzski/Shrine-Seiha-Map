// 神様のカテゴリや属性に基づいたシンボルアイコンを生成
export function getDeitySymbol(category: string, deityId: string): string {
  // 特定の神専用のシンボル
  const specificSymbols: Record<string, string> = {
    amaterasu: "☀️",
    tsukuyomi: "🌙",
    susanoo: "🌊",
    izanagi: "⚡",
    izanami: "🌸",
    okuninushi: "💍",
    konohanasakuya: "🌸",
    kagutsuchi: "🔥",
    takemikazuchi: "⚔️",
    futsunushi: "🗡️",
    ninigi: "🌾",
    jimmu: "👑",
    yamatotakeru: "🦅",
    yatagarasu: "🐦",
    inaba_usagi: "🐰",
    hachiman: "🏹",
    benzaiten: "🎵",
    ebisu: "🐟",
    tenjin: "📚",
    omoikane: "🧠",
    amenouzume: "💃",
    amenotajikarao: "💪",
    watatsumi: "🐉",
    oyamatsumi: "⛰️",
    ukanomitama: "🌾",
    toyoukehime: "🍚",
    sarutahiko: "🛤️",
  };

  if (specificSymbols[deityId]) {
    return specificSymbols[deityId];
  }

  // カテゴリ別のデフォルトシンボル
  const categorySymbols: Record<string, string> = {
    造化三神: "✨",
    神世七代: "🌅",
    三貴子: "👑",
    天岩戸: "🪨",
    出雲神話: "💫",
    天孫降臨: "☁️",
    海幸山幸: "🎣",
    国譲り: "🤝",
    火の神: "🔥",
    食物神: "🌾",
    水の神: "💧",
    風の神: "🌬️",
    鍛冶神: "🔨",
    土の神: "🏺",
    神武東征: "⚔️",
    日本武尊: "🦅",
    八幡神: "🏹",
    住吉神: "⚓",
    宗像神: "🚢",
    天神: "📚",
    春日神: "🦌",
    弁財天: "🎵",
    恵比寿: "🐟",
    大物主: "🐍",
  };

  return categorySymbols[category] || "⛩️";
}

// SVGベースの神様アイコンを生成（ポップアップ用の大きいバージョン）
export function DeityIcon({
  category,
  deityId,
  size = 64,
}: {
  category: string;
  deityId: string;
  size?: number;
}) {
  const symbol = getDeitySymbol(category, deityId);

  // カテゴリに基づく背景色
  const categoryColors: Record<string, { bg: string; border: string }> = {
    造化三神: { bg: "#fef3c7", border: "#f59e0b" },
    神世七代: { bg: "#fce7f3", border: "#ec4899" },
    三貴子: { bg: "#fef9c3", border: "#eab308" },
    天岩戸: { bg: "#e0e7ff", border: "#6366f1" },
    出雲神話: { bg: "#d1fae5", border: "#10b981" },
    天孫降臨: { bg: "#fef3c7", border: "#f59e0b" },
    海幸山幸: { bg: "#cffafe", border: "#06b6d4" },
    国譲り: { bg: "#fee2e2", border: "#ef4444" },
    火の神: { bg: "#fee2e2", border: "#dc2626" },
    食物神: { bg: "#d9f99d", border: "#84cc16" },
    水の神: { bg: "#bfdbfe", border: "#3b82f6" },
    風の神: { bg: "#e0f2fe", border: "#0ea5e9" },
    鍛冶神: { bg: "#f3f4f6", border: "#6b7280" },
    土の神: { bg: "#fde68a", border: "#d97706" },
    神武東征: { bg: "#fecaca", border: "#dc2626" },
    日本武尊: { bg: "#fed7aa", border: "#ea580c" },
    八幡神: { bg: "#fecaca", border: "#b91c1c" },
    住吉神: { bg: "#a5f3fc", border: "#0891b2" },
    宗像神: { bg: "#bae6fd", border: "#0284c7" },
    天神: { bg: "#c7d2fe", border: "#4f46e5" },
    春日神: { bg: "#bbf7d0", border: "#16a34a" },
    弁財天: { bg: "#fbcfe8", border: "#db2777" },
    恵比寿: { bg: "#99f6e4", border: "#14b8a6" },
    大物主: { bg: "#d1d5db", border: "#4b5563" },
  };

  const colors = categoryColors[category] || { bg: "#f3f4f6", border: "#9ca3af" };

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: colors.bg,
        border: `3px solid ${colors.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.5,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      {symbol}
    </div>
  );
}
