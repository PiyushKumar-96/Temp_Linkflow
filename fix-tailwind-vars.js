const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        walk(filepath, filelist);
      }
    } else if (/\.(jsx|js|tsx|ts|html)$/.test(file)) {
      filelist.push(filepath);
    }
  }
  return filelist;
}

const files = walk(srcDir);

// prefixes that expect a color
const colorPrefixes = [
  'text', 'bg', 'border', 'border-t', 'border-r', 'border-b', 'border-l', 'border-x', 'border-y',
  'ring', 'ring-offset', 'outline', 'divide', 'divide-x', 'divide-y', 'fill', 'stroke', 'shadow',
  'accent', 'caret', 'decoration', 'from', 'via', 'to'
];

// Regex parts:
// 1: prefix (text, bg, etc)
// 2: var declaration including optional fallback: var(--foo) or var(--foo,#fff)
// 3: optional opacity modifier: /70 or /20
const colorRegex = new RegExp(`\\b(${colorPrefixes.join('|')})-\\[(var\\(--[^\\]]+\\))\\](?:\\/(\\d+))?`, 'g');

const lengthRegex = /\b(rounded(?:-[trbl])?)-\[(var\(--[^\]]+\))\]/g;

let colorMixInstances = [];
let lengthInstances = [];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Fix colors
  content = content.replace(colorRegex, (match, prefix, varCall, opacity) => {
    changed = true;
    if (opacity) {
      const replaced = `${prefix}-[color:color-mix(in_srgb,${varCall}_${opacity}%,transparent)]`;
      colorMixInstances.push(match);
      return replaced;
    } else {
      return `${prefix}-[color:${varCall}]`;
    }
  });

  // Fix lengths
  content = content.replace(lengthRegex, (match, prefix, varCall) => {
    changed = true;
    const replaced = `${prefix}-[length:${varCall}]`;
    lengthInstances.push(match);
    return replaced;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log('Opacity modifiers updated:', colorMixInstances);
console.log('Length modifiers updated:', lengthInstances);
