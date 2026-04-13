import { useState, useCallback, memo } from 'react';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import AjrakBackground from './AjrakBackground';
import ImageWidget from './ImageWidget';
import { MEMBERS, KHILAFAT_WORKS } from '../../data/projects';
import { useOS } from '../../context/OSContext';
import './desktop.css';

// Folder images
import salarFolder from '../../assets/folders/salar.png';
import grandgamblerFolder from '../../assets/folders/grandgambler.png';
import shahmanFolder from '../../assets/folders/shahman.png';
import khilafatworksFolder from '../../assets/folders/khilafatworks.png';

// Widget images (waiting for you to copy them)
import widget1 from '../../assets/widgets/widget1.jpeg';
import widget2 from '../../assets/widgets/widget2.jpeg';
import widget3 from '../../assets/widgets/widget3.jpeg';

const FOLDER_IMAGES = {
  salar: salarFolder,
  grandgambler: grandgamblerFolder,
  shahman: shahmanFolder,
  khilafatworks: khilafatworksFolder,
};

function Desktop({ openWindows = [], activeWinId, onOpenApp, onFocus }) {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const { language, t } = useOS();

  const handleDesktopClick = useCallback(() => {
    setSelectedIcon(null);
  }, []);

  const desktopItems = [
    ...MEMBERS.map((m) => ({
      id: m.id,
      label: language === 'UR' && m.nameUrdu ? m.nameUrdu : m.name,
      icon: (
        <img src={FOLDER_IMAGES[m.id]} alt={m.name} width={52} height={52} draggable={false} style={{ objectFit: 'contain' }} />
      ),
      action: () => onOpenApp?.('file-explorer', { initialPath: `/${m.name}` }),
    })),
    {
      id: KHILAFAT_WORKS.id,
      label: language === 'UR' && KHILAFAT_WORKS.nameUrdu ? KHILAFAT_WORKS.nameUrdu : KHILAFAT_WORKS.name,
      icon: (
        <img src={FOLDER_IMAGES[KHILAFAT_WORKS.id]} alt={KHILAFAT_WORKS.name} width={52} height={52} draggable={false} style={{ objectFit: 'contain' }} />
      ),
      action: () => onOpenApp?.('file-explorer', { initialPath: `/${KHILAFAT_WORKS.name}` }),
    },
  ];

  return (
    <div className="desktop" onClick={handleDesktopClick}>
      <AjrakBackground />
      <div className="desktop-notch">{t('Notch')}</div>
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

        {/* macOS Style Draggable Image Widgets */}
        <ImageWidget 
          id="widget1"
          defaultX={window.innerWidth - 320} 
          defaultY={40} 
          imageUrl={widget1} 
          title="Widget 1" 
        />
        <ImageWidget 
          id="widget2"
          defaultX={window.innerWidth - 320} 
          defaultY={340} 
          imageUrl={widget2} 
          title="Widget 2" 
        />
        <ImageWidget 
          id="widget3"
          defaultX={window.innerWidth - 640} 
          defaultY={40} 
          imageUrl={widget3} 
          title="Widget 3" 
        />
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
