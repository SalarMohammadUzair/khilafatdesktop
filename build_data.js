const fs = require('fs');
const path = require('path');

const inputPath = 'f:/Downloads/DrIsrar.txt';
const outputPath = path.join(__dirname, 'src/data/drIsrarVideos.js');

try {
  const txt = fs.readFileSync(inputPath, 'utf-8');
  const lines = txt.split(/\r?\n/).filter(Boolean);

  const videos = lines.map((line, i) => {
    const parts = line.split(' | ');
    if (parts.length < 2) return null;
    const urlPart = parts[0].trim();
    const titlePart = parts.slice(1).join(' | ').trim();
    
    let youtubeId = '';
    if (urlPart.includes('/embed/')) {
      // might have params like ?foo=bar, but let's just split by /embed/ 
      const afterEmbed = urlPart.split('/embed/')[1];
      if (afterEmbed) {
        youtubeId = afterEmbed.split('?')[0]; // strip away any queries if present
      }
    }
    
    return {
      id: 'israr-' + (i + 1),
      parentPath: '/Gallery/Dr Israr',
      name: titlePart,
      type: 'video',
      url: urlPart,
      youtubeId: youtubeId,
      date: '2026-04-14'
    };
  }).filter(Boolean);

  const fileContent = 'export const DR_ISRAR_VIDEOS = ' + JSON.stringify(videos, null, 2) + ';\n';
  fs.writeFileSync(outputPath, fileContent);
  console.log('Successfully wrote ' + videos.length + ' videos to ' + outputPath);
} catch (e) {
  console.error('Failed to parse and write data.', e);
}
