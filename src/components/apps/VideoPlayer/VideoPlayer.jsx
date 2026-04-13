import { memo } from 'react';
import './VideoPlayer.css';

function VideoPlayer({ data }) {
  if (!data?.youtubeId && !data?.url) {
    return (
      <div className="vp-error">
        <p>No video data provided.</p>
      </div>
    );
  }

  // If it's a youtube embed link, use as-is. If we just have ID, construct embed link.
  const videoSrc = data.youtubeId 
    ? `https://www.youtube.com/embed/${data.youtubeId}?autoplay=1&rel=0`
    : data.url;

  return (
    <div className="video-player">
      <iframe
        className="vp-iframe"
        src={videoSrc}
        title={data.name || 'Video Player'}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default memo(VideoPlayer);
