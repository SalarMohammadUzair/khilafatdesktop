import { memo, useMemo } from 'react';
import TaskbarClock from './TaskbarClock';
import { MdFolder, MdLanguage } from 'react-icons/md';
import { useOS } from '../../context/OSContext';

function Taskbar({ windows = [], activeWinId, onFocus, onOpenApp }) {
  const { language, setLanguage, t } = useOS();
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
          title={t('File Explorer')}
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
        <div className="lang-toggle" onClick={() => setLanguage(lang => lang === 'EN' ? 'UR' : 'EN')}>
          <span className={language === 'UR' ? 'is-active' : ''}>UR</span>
          <span className={language === 'EN' ? 'is-active' : ''}>EN</span>
        </div>
        <TaskbarClock />
      </div>
    </div>
  );
}

export default memo(Taskbar);
