import { memo, useState } from 'react';
import './ImageViewer.css';

function ImageViewer({ data }) {
  const [zoom, setZoom] = useState(false);

  if (!data?.url) {
    return (
      <div className="iv-error">
        <p>No image data provided.</p>
      </div>
    );
  }

  const handleToggleZoom = () => {
    setZoom(!zoom);
  };

  return (
    <div className={`image-viewer ${zoom ? 'is-zoomed' : ''}`} onClick={handleToggleZoom}>
      <img src={data.url} alt={data.name || 'Image'} className="iv-img" />
      <div className="iv-overlay">
        <span className="iv-title">{data.name}</span>
      </div>
    </div>
  );
}

export default memo(ImageViewer);
