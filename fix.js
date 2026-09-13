const fs = require('fs');
let code = fs.readFileSync('src/app/post-creation-composer/components/ComposerPreview.jsx', 'utf8');

// G.2 Phone width
code = code.replace(/width: 220, maxWidth: '100%'/g, "width: 282, maxWidth: '100%', margin: '0 auto'");

// G.4 Phone height and zoom
code = code.replace(/height: 290,/g, "height: 384,"); // Phone screen height
code = code.replace(/zoom: 0.60, width: 320/g, "zoom: 0.80, width: 320");

// G.2 Laptop width
code = code.replace(/maxWidth: 480, width: '100%'/g, "width: 480, maxWidth: '100%', margin: '0 auto'");

// G.3 Remove Safari toolbar
code = code.replace(/\{\/\* Safari\/Chrome toolbar \*\/\}[\s\S]*?\{\/\* LinkedIn nav \*\/\}/m, '{/* LinkedIn nav */}');

// G.4 Laptop height and zoom
code = code.replace(/height: 200,/g, "height: 337,");
code = code.replace(/maxWidth: 420, margin/g, "maxWidth: 440, margin");
code = code.replace(/zoom: 0.75/g, "zoom: 0.90");

fs.writeFileSync('src/app/post-creation-composer/components/ComposerPreview.jsx', code);
