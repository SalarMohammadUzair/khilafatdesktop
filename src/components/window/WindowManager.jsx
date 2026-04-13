import { useState, useCallback } from 'react';
import AppWindow from './AppWindow';
import FileExplorer from '../apps/FileExplorer/FileExplorer';
import ProjectViewer from '../apps/ProjectViewer/ProjectViewer';
import { MdFolder, MdLanguage } from 'react-icons/md';

const APP_DEFAULTS = {
  'file-explorer': { width: 820, height: 520, title: 'File Explorer' },
  'project-viewer': { width: 960, height: 640, title: 'Project' },
};

const APP_ICONS = {
  'file-explorer': <MdFolder size={18} color="#f0c040" />,
  'project-viewer': <MdLanguage size={18} color="#89b4fa" />,
};

export default function WindowManager({
  windows = [], activeWinId,
  onOpenApp, onFocus, onClose, onMinimize,
}) {
  const [geometry, setGeometry] = useState({});

  const getMaxRect = () => ({
    x: 0, y: 0,
    width: window.innerWidth,
    height: window.innerHeight - 52,
  });

  const getDefaultRestoreRect = useCallback((id) => {
    const index = windows.findIndex((w) => w.id === id);
    const win = windows[index];
    const defaults = APP_DEFAULTS[win?.appId] || { width: 700, height: 480 };
    const offset = Math.max(0, index) * 28;
    return {
      x: 80 + offset, y: 50 + offset,
      width: defaults.width, height: defaults.height,
    };
  }, [windows]);

  const handleChange = useCallback((id, rect) => {
    setGeometry((prev) => ({ ...prev, [id]: rect }));
  }, []);

  const handleMaximize = useCallback((id) => {
    setGeometry((prev) => {
      const current = prev[id];
      const win = windows.find((w) => w.id === id);
      const wasImplicitMaximized = !current && !!win?.startMaximized;

      if (current?.isMaximized || wasImplicitMaximized) {
        const restore = current?.restoreRect || getDefaultRestoreRect(id);
        return { ...prev, [id]: { ...restore, isMaximized: false, restoreRect: null } };
      }

      const baseRect = current || getDefaultRestoreRect(id);
      return {
        ...prev,
        [id]: {
          ...getMaxRect(),
          isMaximized: true,
          restoreRect: { x: baseRect.x, y: baseRect.y, width: baseRect.width, height: baseRect.height },
        },
      };
    });
  }, [windows, getDefaultRestoreRect]);

  return (
    <>
      {windows.map((win, index) => {
        const defaults = APP_DEFAULTS[win.appId] || { width: 700, height: 480 };
        const offset = index * 28;
        const storedGeo = geometry[win.id];
        const geo = storedGeo || (win.startMaximized
          ? {
              ...getMaxRect(),
              isMaximized: true,
              restoreRect: { x: 80 + offset, y: 50 + offset, width: defaults.width, height: defaults.height },
            }
          : { x: 80 + offset, y: 50 + offset, width: defaults.width, height: defaults.height }
        );

        const windowTitle = win.title || defaults.title;

        return (
          <AppWindow
            key={win.id}
            id={win.id}
            title={windowTitle}
            icon={
              win.faviconUrl
                ? <img src={win.faviconUrl} alt="" width={18} height={18} draggable={false} style={{ borderRadius: 2 }} onError={(e) => { e.target.style.display = 'none'; }} />
                : (APP_ICONS[win.appId] || <MdLanguage size={18} />)
            }
            x={geo.x}
            y={geo.y}
            width={geo.width}
            height={geo.height}
            isMaximized={!!geo.isMaximized}
            isActive={win.id === activeWinId}
            isMinimized={win.minimized}
            onFocus={onFocus}
            onClose={onClose}
            onMinimize={onMinimize}
            onMaximize={handleMaximize}
            onChange={handleChange}
          >
            {win.appId === 'file-explorer' && (
              <FileExplorer
                initialPath={win.initialPath || '/'}
                onOpenProject={(project) => onOpenApp?.('project-viewer', { project })}
              />
            )}
            {win.appId === 'project-viewer' && win.project && (
              <ProjectViewer project={win.project} />
            )}
          </AppWindow>
        );
      })}
    </>
  );
}
