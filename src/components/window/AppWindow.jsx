import { useRef, useCallback, useEffect, useState } from 'react';
import './window.css';

export default function AppWindow({
  id, title = 'Window', icon = null, children,
  x = 60, y = 60, width = 640, height = 440,
  isActive = false, isMinimized = false, isMaximized = false,
  onFocus, onClose, onMinimize, onMaximize, onChange,
}) {
  const dragState = useRef(null);
  const resizeState = useRef(null);
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const startDrag = useCallback((e) => {
    if (isMaximized) return;
    if (e.button !== 0) return;
    e.preventDefault();
    onFocus?.(id);
    dragState.current = {
      startMouseX: e.clientX, startMouseY: e.clientY,
      startX: x, startY: y,
    };

    const onMove = (me) => {
      if (!dragState.current) return;
      const { startMouseX, startMouseY, startX, startY } = dragState.current;
      const nx = Math.max(0, startX + (me.clientX - startMouseX));
      const ny = Math.max(0, startY + (me.clientY - startMouseY));
      onChange?.(id, { x: nx, y: ny, width, height });
    };

    const onUp = () => {
      dragState.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [id, x, y, width, height, isMaximized, onFocus, onChange]);

  const startResize = useCallback((e, dir) => {
    if (isMaximized) return;
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    onFocus?.(id);
    resizeState.current = {
      dir, startMouseX: e.clientX, startMouseY: e.clientY,
      startX: x, startY: y, startW: width, startH: height,
    };

    const onMove = (me) => {
      if (!resizeState.current) return;
      const { dir: d, startMouseX, startMouseY, startX, startY, startW, startH } = resizeState.current;
      const dx = me.clientX - startMouseX;
      const dy = me.clientY - startMouseY;
      let nx = startX, ny = startY, nw = startW, nh = startH;
      if (d.includes('e')) nw = Math.max(300, startW + dx);
      if (d.includes('s')) nh = Math.max(200, startH + dy);
      if (d.includes('w')) { nw = Math.max(300, startW - dx); nx = startX + (startW - nw); }
      if (d.includes('n')) { nh = Math.max(200, startH - dy); ny = startY + (startH - nh); }
      onChange?.(id, { x: nx, y: ny, width: nw, height: nh });
    };

    const onUp = () => {
      resizeState.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [id, x, y, width, height, isMaximized, onFocus, onChange]);

  useEffect(() => {
    return () => { dragState.current = null; resizeState.current = null; };
  }, []);

  const TASKBAR_H = 52;
  const maxW = Math.max(300, viewport.width - 16);
  const maxH = Math.max(200, viewport.height - TASKBAR_H - 8);
  const safeW = Math.min(width, maxW);
  const safeH = Math.min(height, maxH);
  const safeX = Math.max(0, Math.min(x, viewport.width - safeW));
  const safeY = Math.max(0, Math.min(y, viewport.height - TASKBAR_H - safeH));

  const windowStyle = isMaximized
    ? { left: 0, top: 0, width: viewport.width, height: viewport.height - TASKBAR_H, zIndex: isActive ? 200 : 100 }
    : { left: safeX, top: safeY, width: safeW, height: safeH, zIndex: isActive ? 200 : 100 };

  return (
    <div
      className={[
        'app-window',
        isActive ? 'is-active' : '',
        isMinimized ? 'is-minimized' : '',
        isMaximized ? 'is-maximized' : '',
      ].filter(Boolean).join(' ')}
      style={windowStyle}
      onMouseDown={() => onFocus?.(id)}
    >
      {!isMaximized && ['n', 's', 'e', 'w', 'nw', 'ne', 'sw', 'se'].map((dir) => (
        <div key={dir} className={`win-resize win-resize-${dir}`} onMouseDown={(e) => startResize(e, dir)} />
      ))}

      <div className="win-titlebar">
        <div className="win-drag-handle" onMouseDown={startDrag}>
          {icon && <div className="win-titlebar-icon">{icon}</div>}
          <span className="win-title">{title}</span>
        </div>
        <div className="win-controls">
          <button className="win-ctrl-btn minimize" onClick={(e) => { e.stopPropagation(); onMinimize?.(id); }} title="Minimize">‒</button>
          <button className={`win-ctrl-btn maximize${isMaximized ? ' is-restored' : ''}`} onClick={(e) => { e.stopPropagation(); onMaximize?.(id); }} title={isMaximized ? 'Restore' : 'Maximize'}>
            {isMaximized ? (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><rect x="2" y="1" width="8" height="8" stroke="currentColor" strokeWidth="1" /><path d="M1 3.5V11h7.5" stroke="currentColor" strokeWidth="1" /></svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><rect x="1.5" y="1.5" width="9" height="9" stroke="currentColor" strokeWidth="1" /></svg>
            )}
          </button>
          <button className="win-ctrl-btn close" onClick={(e) => { e.stopPropagation(); onClose?.(id); }} title="Close">✕</button>
        </div>
      </div>

      <div className="win-body">{children}</div>
    </div>
  );
}
