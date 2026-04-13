import { memo } from 'react';
import { MdOpenInNew } from 'react-icons/md';
import './ProjectViewer.css';

function ProjectViewer({ project }) {
  if (!project) return <div className="pv-empty">No project selected.</div>;

  const hasUrl = project.url && project.url.trim() !== '';

  return (
    <div className="pv-shell">
      <div className="pv-toolbar">
        <div className="pv-project-info">
          <span className="pv-project-name">{project.name}</span>
          {project.projectType && (
            <span className="pv-project-type">{project.projectType}</span>
          )}
        </div>
        {hasUrl && (
          <div className="pv-toolbar-actions">
            <span className="pv-url">{project.url}</span>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pv-open-external"
              title="Open in new tab"
            >
              <MdOpenInNew size={16} />
            </a>
          </div>
        )}
      </div>

      <div className="pv-content">
        {hasUrl ? (
          <iframe
            src={project.url}
            title={project.name}
            className="pv-iframe"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : (
          <div className="pv-no-url">
            <div className="pv-no-url-icon">🚧</div>
            <h3>{project.name}</h3>
            <p>{project.description || 'This project is coming soon.'}</p>
            <p className="pv-no-url-hint">
              No deployment URL configured yet.<br />
              Add a URL to <code>src/data/projects.js</code> to preview it here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ProjectViewer);
