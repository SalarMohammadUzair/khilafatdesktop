import { useMemo, useCallback } from 'react';
import { MEMBERS, KHILAFAT_WORKS, PROJECTS } from '../data/projects';

// All "folder owners" — members + group folder
const ALL_FOLDERS = [...MEMBERS, KHILAFAT_WORKS];

export default function useProjectFS() {
  const fs = useMemo(() => {
    const tree = {
      '/': ALL_FOLDERS.map((f) => ({
        id: f.id,
        name: f.name,
        type: 'folder',
        modified: f.id === 'khilafatworks' ? 'Group' : 'Member',
        accent: f.accent,
      })),
    };

    ALL_FOLDERS.forEach((f) => {
      const folderProjects = PROJECTS.filter((p) => p.memberId === f.id);
      tree[`/${f.name}`] = folderProjects.map((p) => ({
        id: p.id,
        name: p.name,
        type: 'project',
        projectType: p.type,
        description: p.description,
        url: p.url,
        modified: p.date,
      }));
    });

    return tree;
  }, []);

  const listDir = useCallback((path) => fs[path] || [], [fs]);

  const allProjects = useMemo(
    () =>
      PROJECTS.map((p) => {
        const owner = ALL_FOLDERS.find((f) => f.id === p.memberId);
        return {
          id: p.id,
          name: p.name,
          type: 'project',
          projectType: p.type,
          description: p.description,
          url: p.url,
          modified: p.date,
          memberName: owner?.name || 'Unknown',
        };
      }),
    []
  );

  return { fs, listDir, allProjects };
}
