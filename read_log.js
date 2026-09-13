const fs = require('fs');
const lines = fs.readFileSync('C:/Users/piyus/.gemini/antigravity-ide/brain/20f19e37-e3b5-41ca-835c-13effe7f0de2/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');
const userLines = lines.filter(l => l.includes('"type":"USER_INPUT"'));
if (userLines.length > 0) {
  const lastLine = userLines[userLines.length - 1];
  try {
    const data = JSON.parse(lastLine);
    console.log(data.content);
  } catch (e) {
    console.log('Error parsing:', e.message);
  }
}
