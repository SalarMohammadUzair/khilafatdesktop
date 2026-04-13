import { useState, useCallback, memo } from 'react';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import { MEMBERS, KHILAFAT_WORKS } from '../../data/projects';
import { MdInfo } from 'react-icons/md';
import './desktop.css';

// Import folder images
import salarFolder from '../../assets/folders/salar.png';
import grandgamblerFolder from '../../assets/folders/grandgambler.png';
import shahmanFolder from '../../assets/folders/shahman.png';
import khilafatworksFolder from '../../assets/folders/khilafatworks.png';

const FOLDER_IMAGES = {
  salar: salarFolder,
  grandgambler: grandgamblerFolder,
  shahman: shahmanFolder,
  khilafatworks: khilafatworksFolder,
};

function Desktop({ openWindows = [], activeWinId, onOpenApp, onFocus }) {
  const [selectedIcon, setSelectedIcon] = useState(null);

  const handleDesktopClick = useCallback(() => {
    setSelectedIcon(null);
  }, []);

  const desktopItems = [
    ...MEMBERS.map((m) => ({
      id: m.id,
      label: m.name,
      icon: (
        <img src={FOLDER_IMAGES[m.id]} alt={m.name} width={56} height={56} draggable={false} style={{ objectFit: 'contain' }} />
      ),
      action: () => onOpenApp?.('file-explorer', { initialPath: `/${m.name}` }),
    })),
    {
      id: KHILAFAT_WORKS.id,
      label: KHILAFAT_WORKS.name,
      icon: (
        <img src={FOLDER_IMAGES[KHILAFAT_WORKS.id]} alt={KHILAFAT_WORKS.name} width={56} height={56} draggable={false} style={{ objectFit: 'contain' }} />
      ),
      action: () => onOpenApp?.('file-explorer', { initialPath: `/${KHILAFAT_WORKS.name}` }),
    },
  ];

  desktopItems.push({
    id: 'about',
    label: 'About Khilafat',
    icon: <MdInfo size={40} color="#89b4fa" />,
    action: () => {},
  });

  return (
    <div className="desktop" onClick={handleDesktopClick}>
      <div className="desktop-area">
        <div className="desktop-icons">
          {desktopItems.map((item) => (
            <DesktopIcon
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              selected={selectedIcon === item.id}
              onSelect={setSelectedIcon}
              onOpen={item.action}
            />
          ))}
        </div>
      </div>

      <Taskbar
        windows={openWindows}
        activeWinId={activeWinId}
        onFocus={onFocus}
        onOpenApp={onOpenApp}
      />
    </div>
  );
}

export default memo(Desktop);
