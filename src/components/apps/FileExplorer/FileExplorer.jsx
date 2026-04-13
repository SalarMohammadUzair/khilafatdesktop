import { useState, useEffect, useMemo, useCallback } from 'react';
import useProjectFS from '../../../hooks/useProjectFS';
import { MEMBERS, KHILAFAT_WORKS } from '../../../data/projects';
import { MdArrowBack, MdArrowForward, MdArrowUpward, MdHome, MdSearch, MdPerson, MdWorkspaces } from 'react-icons/md';
import './FileExplorer.css';

function FolderIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" fill="#f0c040" stroke="#c89a10" strokeWidth="0.5" />
    </svg>
  );
}

function ProjectIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="#89b4fa" />
      <path d="M8 12h8M12 8v8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MemberIcon({ accent, size = 18 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: accent || '#666',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <MdPerson size={size * 0.65} color="#0e0e0e" />
    </div>
  );
}

function Breadcrumb({ currentPath, onNavigate }) {
  const segments = currentPath === '/' ? [] : currentPath.split('/').filter(Boolean);
  const crumbs = [
    { label: 'Home', path: '/' },
    ...segments.map((seg, i) => ({
      label: seg,
      path: '/' + segments.slice(0, i + 1).join('/'),
    })),
  ];

  return (
    <div className="fe-breadcrumb">
      <span className="fe-breadcrumb-home" onClick={() => onNavigate('/')}>
        <MdHome size={15} />
      </span>
      {crumbs.map((crumb, i) => (
        <span key={crumb.path} className="fe-breadcrumb-segment">
          <span style={{ opacity: 0.4, margin: '0 2px' }}>›</span>
          <span
            className={`fe-breadcrumb-label${i === crumbs.length - 1 ? ' is-current' : ''}`}
            onClick={() => onNavigate(crumb.path)}
          >
            {crumb.label}
          </span>
        </span>
      ))}
    </div>
  );
}

export default function FileExplorer({ initialPath = '/', onOpenProject }) {
  const { listDir } = useProjectFS();

  const [history, setHistory] = useState([initialPath]);
  const [histIdx, setHistIdx] = useState(0);
  const currentPath = history[histIdx];
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [addrFocused, setAddrFocused] = useState(false);
  const [addrInput, setAddrInput] = useState(initialPath);

  useEffect(() => setAddrInput(currentPath), [currentPath]);

  const navigate = useCallback((path) => {
    setHistory((prev) => [...prev.slice(0, histIdx + 1), path]);
    setHistIdx((i) => i + 1);
    setSelected(null);
  }, [histIdx]);

  const goBack = () => { if (histIdx > 0) { setHistIdx((i) => i - 1); setSelected(null); } };
  const goForward = () => { if (histIdx < history.length - 1) { setHistIdx((i) => i + 1); setSelected(null); } };
  const goUp = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    navigate(parts.length === 0 ? '/' : '/' + parts.join('/'));
  };

  const handleOpen = useCallback((entry) => {
    if (!entry) return;
    if (entry.type === 'folder') {
      navigate((currentPath === '/' ? '' : currentPath) + '/' + entry.name);
      return;
    }
    if (entry.type === 'project') {
      onOpenProject?.(entry);
    }
  }, [currentPath, navigate, onOpenProject]);

  const entries = listDir(currentPath);
  const visibleEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.name.toLowerCase().includes(q));
  }, [entries, searchQuery]);

  const sidebarLinks = useMemo(() => [
    ...MEMBERS.map((m) => ({
      label: m.name,
      path: `/${m.name}`,
      accent: m.accent,
      type: 'member',
    })),
    { sep: true },
    {
      label: KHILAFAT_WORKS.name,
      path: `/${KHILAFAT_WORKS.name}`,
      accent: KHILAFAT_WORKS.accent,
      type: 'group',
    },
    { sep: true },
    { label: 'Home', path: '/', type: 'home' },
  ], []);

  return (
    <div className="fe-shell" onClick={() => setSelected(null)}>
      {/* Navigation bar */}
      <div className="fe-navbar">
        <div className="fe-nav-controls">
          <button className="fe-nav-btn" onClick={goBack} disabled={histIdx === 0} title="Back"><MdArrowBack size={16} /></button>
          <button className="fe-nav-btn" onClick={goForward} disabled={histIdx === history.length - 1} title="Forward"><MdArrowForward size={16} /></button>
          <button className="fe-nav-btn" onClick={goUp} disabled={currentPath === '/'} title="Up"><MdArrowUpward size={16} /></button>
        </div>

        <div className="fe-addressbar-wrap">
          {addrFocused ? (
            <input
              className="fe-addr-input"
              value={addrInput}
              autoFocus
              onChange={(e) => setAddrInput(e.target.value)}
              onBlur={() => setAddrFocused(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const p = addrInput.trim() || '/';
                  navigate(p.startsWith('/') ? p : '/' + p);
                  setAddrFocused(false);
                }
                if (e.key === 'Escape') setAddrFocused(false);
                e.stopPropagation();
              }}
              onClick={(e) => e.stopPropagation()}
              spellCheck={false}
            />
          ) : (
            <div className="fe-breadcrumb-bar" onClick={(e) => { e.stopPropagation(); setAddrFocused(true); }}>
              <Breadcrumb currentPath={currentPath} onNavigate={navigate} />
            </div>
          )}
        </div>

        <div className="fe-search-wrap">
          <MdSearch size={16} />
          <input
            className="fe-search-input"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => { if (e.key === 'Escape') setSearchQuery(''); e.stopPropagation(); }}
          />
        </div>
      </div>

      {/* Body: sidebar + main */}
      <div className="fe-body">
        <div className="fe-sidebar">
          <div className="fe-sidebar-links">
            {sidebarLinks.map((item, i) =>
              item.sep ? (
                <div key={`sep-${i}`} className="fe-sidebar-sep" />
              ) : (
                <button
                  key={item.path}
                  className={`fe-sidebar-link${currentPath === item.path ? ' is-active' : ''}`}
                  onClick={() => navigate(item.path)}
                  style={currentPath === item.path && item.accent ? { borderLeft: `3px solid ${item.accent}` } : {}}
                >
                  <span className="fe-sidebar-link-icon">
                    {item.type === 'member' ? (
                      <MemberIcon accent={item.accent} size={18} />
                    ) : item.type === 'group' ? (
                      <MdWorkspaces size={16} color={item.accent} />
                    ) : (
                      <MdHome size={16} color="#f58b2e" />
                    )}
                  </span>
                  {item.label}
                </button>
              )
            )}
          </div>
        </div>

        <div className="fe-main" onClick={(e) => { e.stopPropagation(); setSelected(null); }}>
          {visibleEntries.length === 0 ? (
            <div className="fe-empty">
              {searchQuery.trim() ? 'No results found.' : 'This folder is empty.'}
            </div>
          ) : (
            <table className="fe-list">
              <thead className="fe-list-header">
                <tr>
                  <th style={{ width: '40%' }}>Name</th>
                  <th style={{ width: '20%' }}>Type</th>
                  <th style={{ width: '40%' }}>
                    {currentPath === '/' ? 'Role' : 'Description'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className={`fe-list-row${selected === entry.id ? ' is-selected' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setSelected(entry.id); }}
                    onDoubleClick={() => handleOpen(entry)}
                  >
                    <td>
                      <span className="fe-list-cell-name">
                        {entry.type === 'folder' ? <FolderIcon /> : <ProjectIcon />}
                        {entry.name}
                      </span>
                    </td>
                    <td>{entry.type === 'folder' ? 'Member Folder' : entry.projectType || 'Project'}</td>
                    <td>{entry.type === 'folder' ? (entry.modified || '') : (entry.description || '')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="fe-statusbar">
        <span className="fe-statusbar-panel">
          {visibleEntries.length} item{visibleEntries.length !== 1 ? 's' : ''}
        </span>
        {selected && (
          <span className="fe-statusbar-panel">
            {entries.find((e) => e.id === selected)?.name}
          </span>
        )}
      </div>
    </div>
  );
}
