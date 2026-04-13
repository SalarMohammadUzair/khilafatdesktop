import { memo } from 'react';

function DesktopIcon({ id, label, icon, selected, onSelect, onOpen, style }) {
  return (
    <div
      className={`desktop-icon${selected ? ' is-selected' : ''}`}
      style={style}
      onClick={(e) => { e.stopPropagation(); onSelect?.(id); }}
      onDoubleClick={() => onOpen?.()}
    >
      <div className="desktop-icon-img">{icon}</div>
      <span className="desktop-icon-label">{label}</span>
    </div>
  );
}

export default memo(DesktopIcon);
