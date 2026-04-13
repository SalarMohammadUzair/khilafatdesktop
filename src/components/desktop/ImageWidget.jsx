import { useState, useRef, useEffect, memo } from 'react';
import './ImageWidget.css';

function ImageWidget({ id, defaultX = 100, defaultY = 100, imageUrl, title, width = 280, height = 280 }) {
  const [position, setPosition] = useState(() => {
    if (!id) return { x: defaultX, y: defaultY };
    try {
      const stored = localStorage.getItem(`widget_pos_${id}`);
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return { x: defaultX, y: defaultY };
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initX: 0, initY: 0, latestX: undefined, latestY: undefined });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: position.x,
      initY: position.y,
    };
    e.stopPropagation();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      
      const newX = dragRef.current.initX + dx;
      const newY = dragRef.current.initY + dy;
      
      dragRef.current.latestX = newX;
      dragRef.current.latestY = newY;
      
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      if (id && dragRef.current.latestX !== undefined && dragRef.current.latestY !== undefined) {
        localStorage.setItem(`widget_pos_${id}`, JSON.stringify({
          x: dragRef.current.latestX,
          y: dragRef.current.latestY
        }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className={`desktop-widget image-widget ${isDragging ? 'is-dragging' : ''}`}
      style={{ 
        transform: `translate(${position.x}px, ${position.y}px)`,
        width,
        height
      }}
      onMouseDown={handleMouseDown}
      title={title}
    >
      <img src={imageUrl} alt={title || 'Widget Image'} draggable={false} />
    </div>
  );
}

export default memo(ImageWidget);
