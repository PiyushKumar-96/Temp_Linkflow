const fs = require('fs');

let css = fs.readFileSync('src/styles/composer.css', 'utf8');

const lines = css.split('\n');
let insideKeyframes = false;
let insideMedia = false;
let out = [];

for (let line of lines) {
  const t = line.trim();
  
  if (t.startsWith('@keyframes')) {
    insideKeyframes = true;
    out.push(line);
    continue;
  }
  
  if (insideKeyframes) {
    out.push(line);
    if (t === '}') insideKeyframes = false;
    continue;
  }
  
  if (t.startsWith('@media') || t.startsWith('@supports')) {
    insideMedia = true;
    out.push(line);
    continue;
  }
  if (insideMedia && t === '}') {
    insideMedia = false;
    out.push(line);
    continue;
  }
  
  // Ignore comments, empty lines, and properties (lines with : but no { unless they are pseudo classes)
  // Actually, if it's a property line it usually starts with spaces and has a semicolon.
  if (t === '' || t.startsWith('/*') || t.startsWith('*') || (t.endsWith(';') && !t.includes('{'))) {
    out.push(line);
    continue;
  }
  
  // Ignore already scoped blocks
  if (t.startsWith('.cmp {') || t.startsWith('.cmp .tone-') || t.startsWith('.cmp .cmp-ink') || t.startsWith('.cmp .cmp-muted')) {
    out.push(line);
    continue;
  }
  
  // We have a selector line. It might contain multiple selectors separated by commas.
  // E.g., ".cmp-card, textarea.cmp-editor-text {"
  // Or just a single one: ".cmp-suggest:hover:not(:disabled) {"
  // Let's find all parts before the '{'
  let bracesSplit = line.split('{');
  if (bracesSplit.length > 1) {
    let selectorsPart = bracesSplit[0];
    let rest = '{' + bracesSplit.slice(1).join('{');
    
    // Split selectors by comma
    let selectors = selectorsPart.split(',').map(s => {
      // For each selector, if it has any characters, prefix it with '.cmp '
      // Wait, we should trim, but preserve original indentation
      let m = s.match(/^(\s*)(.*)$/);
      if (m && m[2].trim().length > 0) {
         // Don't prefix if it already starts with .cmp
         if (m[2].startsWith('.cmp ')) return s;
         return m[1] + '.cmp ' + m[2];
      }
      return s;
    });
    
    out.push(selectors.join(',') + rest);
  } else {
    // Some selectors might span multiple lines, though in composer.css they don't seem to.
    // If there's no '{', it might be a selector line that continues on the next line.
    // But composer.css format is usually ".selector { props }"
    // If it's a standalone selector without '{', we can still prefix it.
    if (t.includes('.cmp-') && !t.endsWith(';')) {
      let m = line.match(/^(\s*)(.*)$/);
      if (m && !m[2].startsWith('.cmp ')) {
        out.push(m[1] + '.cmp ' + m[2]);
        continue;
      }
    }
    out.push(line);
  }
}

fs.writeFileSync('src/styles/composer.css', out.join('\n'), 'utf8');
console.log('composer.css prefixed successfully.');
