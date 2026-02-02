"use client";

import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Shrine } from "@/lib/shrines";
import { getDeitySymbol } from "@/lib/deityIcons";
import { renderToString } from "react-dom/server";
import { useEffect, useRef } from "react";

interface ShrineMapProps {
  shrines: Shrine[];
  visitedIds: Set<string>;
  selectedShrine: string | null;
  onSelectShrine: (id: string | null) => void;
}

// 日本の境界
const japanBounds: L.LatLngBoundsExpression = [
  [24.0, 122.5],
  [46.0, 146.0],
];

// 鳥居SVGアイコン
function createToriiSvg(color: string, glowColor: string) {
  return `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 柱 -->
      <rect x="12" y="20" width="6" height="40" fill="${color}" rx="1"/>
      <rect x="46" y="20" width="6" height="40" fill="${color}" rx="1"/>
      <!-- 上部の横木（笠木） -->
      <rect x="4" y="8" width="56" height="6" fill="${color}" rx="2"/>
      <!-- 島木 -->
      <rect x="8" y="16" width="48" height="4" fill="${color}" rx="1"/>
      <!-- 貫 -->
      <rect x="14" y="26" width="36" height="3" fill="${color}" rx="1"/>
      <!-- 光彩効果 -->
      <rect x="4" y="8" width="56" height="6" fill="url(#shimmer)" rx="2" opacity="0.5"/>
      <defs>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${glowColor}" stop-opacity="0"/>
          <stop offset="50%" stop-color="${glowColor}" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="${glowColor}" stop-opacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  `;
}

function createIcon(shrine: Shrine, visited: boolean, selected: boolean) {
  const size = selected ? 52 : 44;
  const toriiColor = visited ? "#c9a227" : "#8b2942";
  const glowColor = visited ? "#e8d48b" : "#d4a5b0";
  const animationClass = visited ? "golden-ping" : "mystic-glow";

  const iconHtml = renderToString(
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: visited
          ? "drop-shadow(0 0 8px rgba(212, 175, 55, 0.8))"
          : "drop-shadow(0 0 6px rgba(255, 255, 255, 0.4))",
      }}
      className={animationClass}
      dangerouslySetInnerHTML={{ __html: createToriiSvg(toriiColor, glowColor) }}
    />
  );

  return L.divIcon({
    html: iconHtml,
    className: "custom-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

// クラスタアイコン
function createClusterIcon(cluster: { getChildCount: () => number }) {
  const count = cluster.getChildCount();
  const size = count < 10 ? 48 : count < 30 ? 56 : 64;

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: linear-gradient(135deg, #8b2942, #6b1d32);
        border: 3px solid #c9a227;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: 600;
        font-size: ${size * 0.35}px;
        font-family: 'Noto Serif JP', serif;
        box-shadow: 0 4px 15px rgba(139, 41, 66, 0.4);
      ">
        <span>${count}</span>
      </div>
    `,
    className: "custom-cluster",
    iconSize: L.point(size, size),
    iconAnchor: L.point(size / 2, size / 2),
  });
}

// 地図コントローラー
function MapController({
  selectedShrine,
  shrines,
}: {
  selectedShrine: string | null;
  shrines: Shrine[];
}) {
  const map = useMap();
  const prevSelectedRef = useRef<string | null>(null);

  useEffect(() => {
    map.setMaxBounds(japanBounds);
    map.on("drag", () => {
      map.panInsideBounds(japanBounds, { animate: false });
    });
  }, [map]);

  useEffect(() => {
    if (selectedShrine && selectedShrine !== prevSelectedRef.current) {
      const shrine = shrines.find((s) => s.id === selectedShrine);
      if (shrine) {
        map.flyTo([shrine.lat, shrine.lng], 10, {
          duration: 1.2,
        });
      }
    }
    prevSelectedRef.current = selectedShrine;
  }, [selectedShrine, shrines, map]);

  return null;
}

export default function ShrineMap({
  shrines,
  visitedIds,
  selectedShrine,
  onSelectShrine,
}: ShrineMapProps) {
  return (
    <MapContainer
      center={[36.0, 138.0]}
      zoom={6}
      minZoom={5}
      maxZoom={14}
      maxBounds={japanBounds}
      maxBoundsViscosity={1.0}
      className="h-full w-full"
      style={{ background: "#f5f5f0" }}
    >
      <MapController selectedShrine={selectedShrine} shrines={shrines} />

      {/* Voyager タイル（明るい地図） */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterIcon}
        maxClusterRadius={50}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={false}
        zoomToBoundsOnClick={true}
        disableClusteringAtZoom={11}
      >
        {shrines.map((shrine) => {
          const visited = visitedIds.has(shrine.id);
          const selected = selectedShrine === shrine.id;
          return (
            <Marker
              key={shrine.id}
              position={[shrine.lat, shrine.lng]}
              icon={createIcon(shrine, visited, selected)}
              eventHandlers={{
                click: () => onSelectShrine(shrine.id),
              }}
            >
              <Tooltip direction="top" offset={[0, -44]} className="shrine-tooltip">
                <div className="text-center">
                  <div className="text-2xl mb-1">{getDeitySymbol(shrine.category, shrine.id)}</div>
                  <div className="font-semibold text-[#d4af37]">{shrine.deity}</div>
                  <div className="text-xs text-[#a0a0a0]">{shrine.name}</div>
                  {visited && (
                    <div className="text-xs text-[#d4af37] mt-1">✦ 参拝済 ✦</div>
                  )}
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
