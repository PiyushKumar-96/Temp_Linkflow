const fs = require('fs');

const content = fs.readFileSync('src/app/dashboard/_components/DashboardCustomIcons.jsx', 'utf8');

function getSvg(name) {
  const marker = 'export function ' + name;
  const part = content.split(marker)[1].split('</svg>')[0];
  return '<svg ' + part.split('<svg')[1] + '</svg>';
}

const html = `<!DOCTYPE html>
<html>
<body style="background:#222; color:white; display:flex; gap:30px; padding:40px;">
  <div><h4>NewPost</h4>${getSvg('IconQuickNewPost')}</div>
  <div><h4>PlanTopic</h4>${getSvg('IconQuickPlanTopic')}</div>
  <div><h4>OpenQueue</h4>${getSvg('IconQuickOpenQueue')}</div>
  <div><h4>ViewReports</h4>${getSvg('IconQuickViewReports')}</div>
</body>
</html>`;

fs.writeFileSync('scratch_test_icons.html', html);
console.log('Successfully wrote scratch_test_icons.html');
