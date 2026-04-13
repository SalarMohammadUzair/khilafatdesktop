import { memo, useMemo } from 'react';
import TaskbarClock from './TaskbarClock';
import { MdFolder, MdLanguage } from 'react-icons/md';

function Taskbar({ windows = [], activeWinId, onFocus, onOpenApp }) {
  const openAppIds = useMemo(() => new Set(windows.map((w) => w.appId)), [windows]);

  return (
    <div className="taskbar">
      <div className="taskbar-left">
        <span className="taskbar-brand">KhilafatDesktop</span>
      </div>

      <div className="taskbar-center">
        {/* Pinned: File Explorer */}
        <button
          type="button"
          className={`taskbar-icon-btn${openAppIds.has('file-explorer') ? ' is-open' : ''}${
            windows.some((w) => w.appId === 'file-explorer' && w.id === activeWinId) ? ' is-focused' : ''
          }`}
          onClick={() => onOpenApp?.('file-explorer')}
          title="File Explorer"
        >
          <MdFolder size={22} color="#f0c040" />
        </button>

        {/* Running windows */}
        {windows.map((win) => {
          // Skip file explorer in the running list — it's already pinned
          if (win.appId === 'file-explorer') {
            // But still show extra file explorer instances
            const explorerWindows = windows.filter((w) => w.appId === 'file-explorer');
            if (explorerWindows.indexOf(win) === 0) return null; // first one is covered by pinned
          }

          return (
            <button
              key={win.id}
              type="button"
              className={`taskbar-icon-btn is-open${win.id === activeWinId ? ' is-focused' : ''}`}
              onClick={() => onFocus?.(win.id)}
              title={win.title}
            >
              {win.faviconUrl ? (
                <img
                  src={win.faviconUrl}
                  alt=""
                  width={20}
                  height={20}
                  draggable={false}
                  style={{ borderRadius: 2 }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : win.appId === 'file-explorer' ? (
                <MdFolder size={20} color="#f0c040" />
              ) : (
                <MdLanguage size={20} color="#89b4fa" />
              )}
            </button>
          );
        })}
      </div>

      <div className="taskbar-right">
        <TaskbarClock />
      </div>
    </div>
  );
}

export default memo(Taskbar);
