import { useMemo, useCallback } from 'react';
import { MEMBERS, KHILAFAT_WORKS, PROJECTS, GALLERY_FOLDER, GALLERY_SUBFOLDERS, GALLERY_FILES } from '../data/projects';

// All "folder owners" — members + group folder + gallery
const ALL_FOLDERS = [...MEMBERS, KHILAFAT_WORKS, GALLERY_FOLDER];

export default function useProjectFS() {
  const fs = useMemo(() => {
    const tree = {
      // Root Directory
      '/': ALL_FOLDERS.map((f) => ({
        id: f.id,
        name: f.name,
        nameUrdu: f.nameUrdu,
        type: 'folder',
        modified: f.id === 'khilafatworks' ? 'Group' : f.id === 'gallery' ? 'Gallery' : 'Member',
        accent: f.accent,
      })),
      
      // Gallery Root Directory
      [`/${GALLERY_FOLDER.name}`]: GALLERY_SUBFOLDERS.map((sub) => ({
        id: sub.id,
        name: sub.name,
        nameUrdu: sub.nameUrdu,
        type: 'folder',
        modified: 'Gallery Subfolder',
        accent: sub.accent,
      }))
    };

    // Member and Group Folders (Depth 1)
    ALL_FOLDERS.forEach((f) => {
      // Don't process Gallery again here
      if (f.id === 'gallery') return;
      
      const folderProjects = PROJECTS.filter((p) => p.memberId === f.id);
      tree[`/${f.name}`] = folderProjects.map((p) => ({
        id: p.id,
        name: p.name,
        nameUrdu: p.nameUrdu,
        type: 'project',
        projectType: p.type,
        description: p.description,
        url: p.url,
        modified: p.date,
      }));
    });

    // Gallery Subfolders (Depth 2)
    GALLERY_SUBFOLDERS.forEach((sub) => {
      const path = `/Gallery/${sub.name}`;
      const subFolderFiles = GALLERY_FILES.filter((f) => f.parentPath === path);
      tree[path] = subFolderFiles.map((file) => ({
        id: file.id,
        name: file.name,
        type: file.type,
        url: file.url,
        youtubeId: file.youtubeId,
        description: file.description,
        modified: file.date,
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
