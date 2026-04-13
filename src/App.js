import { useState, useCallback } from 'react';
import { OSProvider } from './context/OSContext';
import Desktop from './components/desktop/Desktop';
import WindowManager from './components/window/WindowManager';
import './index.css';

function App() {
  const [windows, setWindows] = useState([]);
  const [activeWinId, setActiveWinId] = useState(null);

  const handleOpenApp = useCallback((appId, launchData = null) => {
    const id = `${appId}-${Date.now()}`;
    const newWin = {
      id,
      appId,
      minimized: false,
      startMaximized: appId === 'project-viewer',
      title: appId === 'file-explorer'
        ? 'File Explorer'
        : launchData?.project?.name || launchData?.data?.name || (appId === 'image-viewer' ? 'Image Viewer' : appId === 'video-player' ? 'Video Player' : 'App'),
      initialPath: launchData?.initialPath || '/',
      project: launchData?.project || null,
      data: launchData?.data || null,
      faviconUrl: launchData?.project?.url
        ? `https://icon.horse/icon/${new URL(launchData.project.url).hostname}`
        : null,
    };

    setWindows((prev) => [...prev, newWin]);
    setActiveWinId(id);
  }, []);

  const handleFocus = useCallback((id) => {
    setActiveWinId(id);
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: false } : w)));
  }, []);

  const handleClose = useCallback((id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveWinId((cur) => (cur === id ? null : cur));
  }, []);

  const handleMinimize = useCallback((id) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
    setActiveWinId((cur) => (cur === id ? null : cur));
  }, []);

  return (
    <OSProvider>
      <Desktop
        openWindows={windows}
        activeWinId={activeWinId}
        onOpenApp={handleOpenApp}
        onFocus={handleFocus}
      />
      <WindowManager
        windows={windows}
        activeWinId={activeWinId}
        onOpenApp={handleOpenApp}
        onFocus={handleFocus}
        onClose={handleClose}
        onMinimize={handleMinimize}
      />
    </OSProvider>
  );
}

export default App;
