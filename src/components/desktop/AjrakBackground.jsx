import { memo } from 'react';
import './AjrakBackground.css';

function AjrakBackground() {
  return (
    <div className="ajrak-bg">
      {/* Layer 1: Primary Ajrak pattern */}
      <svg className="ajrak-svg ajrak-layer-1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="ajrak-stars" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill="none" />
            {/* Outer 8-pointed star */}
            <polygon points="40,2 50,22 70,12 56,32 78,38 56,44 70,64 50,54 40,74 30,54 10,64 24,44 2,38 24,32 10,12 30,22"
              fill="none" stroke="rgba(137,180,250,0.35)" strokeWidth="1" />
            {/* Inner star */}
            <polygon points="40,14 47,28 62,22 52,34 68,38 52,42 62,54 47,48 40,62 33,48 18,54 28,42 12,38 28,34 18,22 33,28"
              fill="none" stroke="rgba(166,227,161,0.25)" strokeWidth="0.8" />
            {/* Innermost square rotated */}
            <rect x="32" y="30" width="16" height="16" rx="1"
              fill="none" stroke="rgba(245,194,231,0.2)" strokeWidth="0.6"
              transform="rotate(45,40,38)" />
            {/* Center jewel */}
            <circle cx="40" cy="38" r="3" fill="rgba(249,226,175,0.2)" />
            <circle cx="40" cy="38" r="1.2" fill="rgba(245,194,231,0.35)" />
            {/* Corner connectors - small diamonds */}
            <rect x="-2" y="-2" width="5" height="5" fill="rgba(137,180,250,0.12)" transform="rotate(45,0,0)" />
            <rect x="78" y="-2" width="5" height="5" fill="rgba(137,180,250,0.12)" transform="rotate(45,80,0)" />
            <rect x="-2" y="78" width="5" height="5" fill="rgba(137,180,250,0.12)" transform="rotate(45,0,80)" />
            <rect x="78" y="78" width="5" height="5" fill="rgba(137,180,250,0.12)" transform="rotate(45,80,80)" />
            {/* Border lines */}
            <line x1="0" y1="0" x2="40" y2="2" stroke="rgba(137,180,250,0.08)" strokeWidth="0.4" />
            <line x1="80" y1="0" x2="40" y2="2" stroke="rgba(137,180,250,0.08)" strokeWidth="0.4" />
            <line x1="0" y1="80" x2="40" y2="74" stroke="rgba(137,180,250,0.08)" strokeWidth="0.4" />
            <line x1="80" y1="80" x2="40" y2="74" stroke="rgba(137,180,250,0.08)" strokeWidth="0.4" />
          </pattern>

          <pattern id="ajrak-medallion" x="0" y="0" width="160" height="160" patternUnits="userSpaceOnUse">
            <rect width="160" height="160" fill="none" />
            {/* Large octagonal frame */}
            <polygon points="80,6 116,24 134,60 134,100 116,136 80,154 44,136 26,100 26,60 44,24"
              fill="none" stroke="rgba(245,194,231,0.15)" strokeWidth="1.2" />
            {/* Inner octagon */}
            <polygon points="80,22 108,36 122,64 122,96 108,124 80,138 52,124 38,96 38,64 52,36"
              fill="none" stroke="rgba(137,180,250,0.12)" strokeWidth="0.8" />
            {/* Inner star of david / hexagram */}
            <polygon points="80,28 96,64 132,64 102,88 112,124 80,100 48,124 58,88 28,64 64,64"
              fill="none" stroke="rgba(166,227,161,0.1)" strokeWidth="0.7" />
            {/* Cross axes */}
            <line x1="80" y1="6" x2="80" y2="154" stroke="rgba(249,226,175,0.06)" strokeWidth="0.5" />
            <line x1="26" y1="80" x2="134" y2="80" stroke="rgba(249,226,175,0.06)" strokeWidth="0.5" />
            <line x1="44" y1="24" x2="116" y2="136" stroke="rgba(249,226,175,0.04)" strokeWidth="0.4" />
            <line x1="116" y1="24" x2="44" y2="136" stroke="rgba(249,226,175,0.04)" strokeWidth="0.4" />
          </pattern>

          <pattern id="ajrak-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="0.6" fill="rgba(137,180,250,0.12)" />
            <circle cx="0" cy="0" r="0.4" fill="rgba(245,194,231,0.08)" />
            <circle cx="16" cy="0" r="0.4" fill="rgba(245,194,231,0.08)" />
            <circle cx="0" cy="16" r="0.4" fill="rgba(245,194,231,0.08)" />
            <circle cx="16" cy="16" r="0.4" fill="rgba(245,194,231,0.08)" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#ajrak-dots)" />
        <rect width="100%" height="100%" fill="url(#ajrak-stars)" />
        <rect width="100%" height="100%" fill="url(#ajrak-medallion)" />
      </svg>

      {/* Layer 2: Offset drifting pattern for moiré */}
      <svg className="ajrak-svg ajrak-layer-2" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="ajrak-stars-2" x="40" y="40" width="80" height="80" patternUnits="userSpaceOnUse">
            <polygon points="40,2 50,22 70,12 56,32 78,38 56,44 70,64 50,54 40,74 30,54 10,64 24,44 2,38 24,32 10,12 30,22"
              fill="none" stroke="rgba(245,194,231,0.15)" strokeWidth="0.7" />
            <circle cx="40" cy="38" r="2.5" fill="rgba(249,226,175,0.15)" />
            <rect x="34" y="32" width="12" height="12" rx="1"
              fill="none" stroke="rgba(166,227,161,0.1)" strokeWidth="0.5"
              transform="rotate(45,40,38)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ajrak-stars-2)" />
      </svg>

      {/* Glow orbs */}
      <div className="ajrak-glow ajrak-glow-1" />
      <div className="ajrak-glow ajrak-glow-2" />
      <div className="ajrak-glow ajrak-glow-3" />

      {/* Vignette */}
      <div className="ajrak-vignette" />
    </div>
  );
}

export default memo(AjrakBackground);
