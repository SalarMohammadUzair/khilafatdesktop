import { DR_ISRAR_VIDEOS } from './drIsrarVideos';

// Khilafat Members 
export const MEMBERS = [
  {
    id: 'salar',
    name: 'Salar',
    role: 'Developer',
    accent: '#a6e3a1',
    github: 'https://github.com/salar',
    folderImage: 'salar',
  },
  {
    id: 'grandgambler',
    name: 'Grandgambler',
    role: 'Developer',
    accent: '#89b4fa',
    github: 'https://github.com/grandgambler',
    folderImage: 'grandgambler',
  },
  {
    id: 'shahman',
    name: 'Shah Man',
    role: 'Developer',
    accent: '#f5c2e7',
    github: 'https://github.com/shahman',
    folderImage: 'shahman',
  },
];

// Khilafat Works (group folder) 
export const KHILAFAT_WORKS = {
  id: 'khilafatworks',
  name: 'Khilafat Works',
  accent: '#f9e2af',
  folderImage: 'khilafatworks',
};

// Gallery (top level group)
export const GALLERY_FOLDER = {
  id: 'gallery',
  name: 'Gallery',
  accent: '#cba6f7', // purple accent
};

// Subfolders inside Gallery
export const GALLERY_SUBFOLDERS = [
  { id: 'iqbal', name: 'Allama Iqbal', parent: 'Gallery', accent: '#a6e3a1' },
  { id: 'salam', name: 'AbdusSalam', parent: 'Gallery', accent: '#89b4fa' },
  { id: 'israr', name: 'Dr Israr', parent: 'Gallery', accent: '#f5c2e7' },
];

// Media Files inside the Gallery subfolders
export const GALLERY_FILES = [
  // Allama Iqbal Images
  { id: 'iqbal-0', parentPath: '/Gallery/Allama Iqbal', name: 'Iqbal 0', type: 'image', url: '/gallery/Iqbal0 (2).jpg', date: '2026-04-14' },
  { id: 'iqbal-1', parentPath: '/Gallery/Allama Iqbal', name: 'Iqbal 1', type: 'image', url: '/gallery/Iqbal1 (2).jpg', date: '2026-04-14' },
  { id: 'iqbal-2', parentPath: '/Gallery/Allama Iqbal', name: 'Iqbal 2', type: 'image', url: '/gallery/Iqbal2 (2).jpg', date: '2026-04-14' },
  { id: 'iqbal-3', parentPath: '/Gallery/Allama Iqbal', name: 'Iqbal 3', type: 'image', url: '/gallery/Iqbal3 (2).jpg', date: '2026-04-14' },
  { id: 'iqbal-4', parentPath: '/Gallery/Allama Iqbal', name: 'Iqbal 4', type: 'image', url: '/gallery/Iqbal4 (2).jpg', date: '2026-04-14' },
  { id: 'iqbal-5', parentPath: '/Gallery/Allama Iqbal', name: 'Iqbal 5', type: 'image', url: '/gallery/Iqbal5 (2).jpg', date: '2026-04-14' },
  { id: 'iqbal-6', parentPath: '/Gallery/Allama Iqbal', name: 'Iqbal 6', type: 'image', url: '/gallery/Iqbal6.jpg', date: '2026-04-14' },
  { id: 'iqbal-7', parentPath: '/Gallery/Allama Iqbal', name: 'Iqbal 7', type: 'image', url: '/gallery/Iqbal7.jpg', date: '2026-04-14' },

  // AbdusSalam Images
  { id: 'salam-0', parentPath: '/Gallery/AbdusSalam', name: 'AbdusSalam 0', type: 'image', url: '/gallery/abdussalam0.jpg', date: '2026-04-14' },
  { id: 'salam-1', parentPath: '/Gallery/AbdusSalam', name: 'AbdusSalam 1', type: 'image', url: '/gallery/abdussalam1.jpg', date: '2026-04-14' },
  { id: 'salam-2', parentPath: '/Gallery/AbdusSalam', name: 'AbdusSalam 2', type: 'image', url: '/gallery/abdussalam2.jpg', date: '2026-04-14' },
  { id: 'salam-3', parentPath: '/Gallery/AbdusSalam', name: 'AbdusSalam 3', type: 'image', url: '/gallery/abdussalam3.jpg', date: '2026-04-14' },
  { id: 'salam-4', parentPath: '/Gallery/AbdusSalam', name: 'AbdusSalam 4', type: 'image', url: '/gallery/abdussalam4.jpg', date: '2026-04-14' },
  { id: 'salam-5', parentPath: '/Gallery/AbdusSalam', name: 'AbdusSalam 5', type: 'image', url: '/gallery/abdussalam5.jpg', date: '2026-04-14' },

  // Dr Israr Videos imported from our generated file, sorted chronologically from the start!
  ...[...DR_ISRAR_VIDEOS].reverse()
];

// Projects 
export const PROJECTS = [
  // Salar 
  {
    id: 'canilisten',
    memberId: 'salar',
    name: 'Can I Listen?',
    type: 'Web App',
    description: 'Islamic Lyric Analyzer — checks if a song is halal to listen to',
    url: 'https://canilisten.salarmuzair.tech',
    date: '2026-04-13',
  },
  {
    id: 'salar-archives',
    memberId: 'salar',
    name: 'Salar Archives',
    type: 'Website',
    description: 'Personal archives and blog — notes, articles, and Urdu content',
    url: 'https://salararchives.vercel.app',
    date: '2026-04-13',
  },

  // Grandgambler 
  {
    id: 'studytracker',
    memberId: 'grandgambler',
    name: 'StudyTracker',
    type: 'Web App',
    description: 'Track your studies and ace your exams — study session dashboard',
    url: 'https://study.muhammadtaha.dev/',
    date: '2026-04-13',
  },
  {
    id: 'cs-flashcards',
    memberId: 'grandgambler',
    name: 'CS Flashcards',
    type: 'Web App',
    description: 'Flashcard app for computer science concepts with neon UI',
    url: 'https://csflashcards.muhammadtaha.dev/',
    date: '2026-04-13',
  },
  {
    id: 'cedar-codes',
    memberId: 'grandgambler',
    name: 'Cedar CODES',
    type: 'Website',
    description: 'Collaborative coding society — terminal-style hacker aesthetic',
    url: 'https://cedar-codes.vercel.app/',
    date: '2026-04-13',
  },

  // Shah Man 
  {
    id: 'sm-project-1',
    memberId: 'shahman',
    name: 'Coming Soon',
    type: 'Project',
    description: 'Shah Man\'s projects will appear here',
    url: '',
    date: '2026-04-13',
  },

  //  Khilafat Works (group projects) 
  {
    id: 'khilafat-site',
    memberId: 'khilafatworks',
    name: 'Khilafat',
    type: 'Website',
    description: 'The official Khilafat site',
    url: 'https://khilafat.foo',
    date: '2026-04-14',
  },
  {
    id: 'past-lives',
    memberId: 'khilafatworks',
    name: 'Past Lives',
    type: 'Game',
    description: 'A game by Grandgambler — published on itch.io',
    url: 'https://ggtaha.itch.io/past-lives',
    date: '2026-04-14',
  },
];
