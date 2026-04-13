import { useState, useEffect, useMemo, useCallback } from 'react';
import useProjectFS from '../../../hooks/useProjectFS';
import { useOS } from '../../../context/OSContext';
import { MEMBERS, KHILAFAT_WORKS, GALLERY_FOLDER } from '../../../data/projects';
import { MdArrowBack, MdArrowForward, MdArrowUpward, MdHome, MdSearch, MdPerson, MdWorkspaces, MdPhotoLibrary, MdImage, MdPlayCircle, MdViewList, MdViewModule, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import './FileExplorer.css';

function FolderIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" fill="#f0c040" stroke="#c89a10" strokeWidth="0.5" />
    </svg>
  );
}

function ProjectIcon({ type, size = 16 }) {
  if (type === 'image') return <MdImage size={size} color="#a6e3a1" />;
  if (type === 'video') return <MdPlayCircle size={size} color="#f38ba8" />;
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
  const { t } = useOS();
  const segments = currentPath === '/' ? [] : currentPath.split('/').filter(Boolean);
  const crumbs = [
    { label: t('Home'), path: '/' },
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

export default function FileExplorer({ initialPath = '/', onOpenApp }) {
  const { listDir } = useProjectFS();
  const { language, t } = useOS();

  const [history, setHistory] = useState([initialPath]);
  const [histIdx, setHistIdx] = useState(0);
  const currentPath = history[histIdx];
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [addrFocused, setAddrFocused] = useState(false);
  const [addrInput, setAddrInput] = useState(initialPath);
  
  // Pagination & View Mode
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 80;
  const [userViewMode, setUserViewMode] = useState(null);

  useEffect(() => {
    setAddrInput(currentPath);
    setCurrentPage(1); // reset to page 1 on navigate
    setUserViewMode(null); // allow defaults to take over
  }, [currentPath]);

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
    } else if (entry.type === 'project') {
      onOpenApp?.('project-viewer', { project: entry });
    } else if (entry.type === 'image') {
      onOpenApp?.('image-viewer', { data: entry });
    } else if (entry.type === 'video') {
      onOpenApp?.('video-player', { data: entry });
    }
  }, [currentPath, navigate, onOpenApp]);

  const handleAuxClick = useCallback((e, entry) => {
    if (e.button === 1 && entry?.type === 'folder') {
      e.preventDefault();
      e.stopPropagation();
      onOpenApp?.('file-explorer', {
        initialPath: (currentPath === '/' ? '' : currentPath) + '/' + entry.name
      });
    }
  }, [currentPath, onOpenApp]);

  const entries = listDir(currentPath);
  const visibleEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.name.toLowerCase().includes(q));
  }, [entries, searchQuery]);

  // Derived state for ViewMode and Pagination
  const viewMode = userViewMode || (currentPath.includes('Gallery') ? 'grid' : 'list');
  const totalPages = Math.ceil(visibleEntries.length / itemsPerPage);
  
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return visibleEntries.slice(start, start + itemsPerPage);
  }, [visibleEntries, currentPage, itemsPerPage]);

  const sidebarLinks = useMemo(() => [
    ...MEMBERS.map((m) => ({
      label: language === 'UR' && m.nameUrdu ? m.nameUrdu : m.name,
      path: `/${m.name}`,
      accent: m.accent,
      type: 'member',
    })),
    { sep: true },
    {
      label: language === 'UR' && KHILAFAT_WORKS.nameUrdu ? KHILAFAT_WORKS.nameUrdu : KHILAFAT_WORKS.name,
      path: `/${KHILAFAT_WORKS.name}`,
      accent: KHILAFAT_WORKS.accent,
      type: 'group',
    },
    {
      label: language === 'UR' && GALLERY_FOLDER.nameUrdu ? GALLERY_FOLDER.nameUrdu : GALLERY_FOLDER.name,
      path: `/${GALLERY_FOLDER.name}`,
      accent: GALLERY_FOLDER.accent,
      type: 'gallery',
    },
    { sep: true },
    { label: t('Home'), path: '/', type: 'home' },
  ], [language, t]);

  const selectedEntry = useMemo(() => {
    if (!selected) return null;
    return visibleEntries.find(e => e.id === selected) || null;
  }, [selected, visibleEntries]);

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

        <div className="fe-view-toggles">
          <button className={`fe-view-btn ${viewMode === 'list' ? 'is-active' : ''}`} onClick={() => setUserViewMode('list')} title="List View"><MdViewList size={18}/></button>
          <button className={`fe-view-btn ${viewMode === 'grid' ? 'is-active' : ''}`} onClick={() => setUserViewMode('grid')} title="Grid View"><MdViewModule size={18}/></button>
        </div>

        <div className="fe-search-wrap">
          <MdSearch size={16} />
          <input
            className="fe-search-input"
            placeholder={t('Search')}
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
                    ) : item.type === 'gallery' ? (
                      <MdPhotoLibrary size={16} color={item.accent} />
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
          <div className="fe-main-content">
            {visibleEntries.length === 0 ? (
              <div className="fe-empty">
                {searchQuery.trim() ? t('No Results') : t('Empty Folder')}
              </div>
            ) : viewMode === 'list' ? (
              <table className="fe-list">
                <thead className="fe-list-header">
                  <tr>
                    <th style={{ width: '40%' }}>{t('Name')}</th>
                    <th style={{ width: '20%' }}>{t('Type')}</th>
                    <th style={{ width: '40%' }}>
                      {currentPath === '/' ? t('Role') : t('Description')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      className={`fe-list-row${selected === entry.id ? ' is-selected' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setSelected(entry.id); }}
                      onDoubleClick={() => handleOpen(entry)}
                      onMouseUp={(e) => { if (e.button === 1) handleAuxClick(e, entry); }}
                    >
                      <td>
                        <span className="fe-list-cell-name">
                          {entry.type === 'folder' ? <FolderIcon /> : <ProjectIcon type={entry.type} />}
                          {language === 'UR' && entry.nameUrdu ? entry.nameUrdu : entry.name}
                        </span>
                      </td>
                      <td>{entry.type === 'folder' ? t('Member Folder') : entry.projectType || (entry.type === 'project' ? t('Project') : entry.type)}</td>
                      <td>{entry.type === 'folder' ? (entry.modified || '') : (entry.description || '')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="fe-grid">
                {paginatedEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`fe-grid-item${selected === entry.id ? ' is-selected' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setSelected(entry.id); }}
                    onDoubleClick={() => handleOpen(entry)}
                    onMouseUp={(e) => { if (e.button === 1) handleAuxClick(e, entry); }}
                  >
                    <div className="fe-grid-thumb">
                      {entry.type === 'image' && <img src={entry.url} alt="" />}
                      {entry.type === 'video' && entry.youtubeId && <img src={`https://img.youtube.com/vi/${entry.youtubeId}/mqdefault.jpg`} alt="" />}
                      {entry.type === 'folder' && <FolderIcon size={48} />}
                      {entry.type !== 'image' && entry.type !== 'video' && entry.type !== 'folder' && <ProjectIcon type={entry.type} size={48} />}
                      
                      {entry.type === 'video' && <div className="fe-grid-play"><MdPlayCircle size={24} /></div>}
                    </div>
                    <div className="fe-grid-label" title={entry.name}>
                      {language === 'UR' && entry.nameUrdu ? entry.nameUrdu : entry.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {totalPages > 1 && (
              <div className="fe-pagination">
                <button 
                  className="fe-page-btn" 
                  disabled={currentPage === 1} 
                  onClick={(e) => { e.stopPropagation(); setCurrentPage(p => p - 1); }}
                ><MdChevronLeft size={20} /></button>
                <span className="fe-page-text">{t('Page')} {currentPage} {t('Of')} {totalPages}</span>
                <button 
                  className="fe-page-btn" 
                  disabled={currentPage === totalPages} 
                  onClick={(e) => { e.stopPropagation(); setCurrentPage(p => p + 1); }}
                ><MdChevronRight size={20} /></button>
              </div>
            )}
          </div>
          
          {/* Right Handle Preview Pane */}
          {selectedEntry && (selectedEntry.type === 'image' || selectedEntry.type === 'video') && (
            <div className="fe-preview-pane">
              <div className="fe-preview-thumb-container">
                {selectedEntry.type === 'image' && (
                  <img src={selectedEntry.url} alt={selectedEntry.name} className="fe-preview-img" />
                )}
                {selectedEntry.type === 'video' && (
                  <img src={`https://img.youtube.com/vi/${selectedEntry.youtubeId}/hqdefault.jpg`} alt={selectedEntry.name} className="fe-preview-img" />
                )}
                <div className="fe-preview-icon">
                  {selectedEntry.type === 'image' ? <MdImage size={32} /> : <MdPlayCircle size={32} />}
                </div>
              </div>
              <div className="fe-preview-details">
                <h3 className="fe-preview-title">{language === 'UR' && selectedEntry.nameUrdu ? selectedEntry.nameUrdu : selectedEntry.name}</h3>
                <p className="fe-preview-type">{selectedEntry.type.toUpperCase()}</p>
                {selectedEntry.description && <p className="fe-preview-desc">{selectedEntry.description}</p>}
                
                <button className="fe-preview-btn" onClick={() => handleOpen(selectedEntry)}>
                  {t('Open')} {selectedEntry.type === 'image' ? t('Image Viewer') : selectedEntry.type === 'video' ? t('Video Player') : ''}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="fe-statusbar">
        <span className="fe-statusbar-panel">
          {visibleEntries.length} {visibleEntries.length !== 1 ? t('Items') : t('Item')}
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
