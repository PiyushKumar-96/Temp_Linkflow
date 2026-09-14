'use client';

import React from 'react';

/**
 * Analytics Findings
 * Rule-based data interpretation.
 * Generates 2-3 plain narrative statements of what changed, what it suggests,
 * and what to do differently — using short sentences and ordinary words.
 */
export function generateFindings(range) {
  const findings = [];

  // Finding 1: Reach vs Engagement Dynamics (Plain prose)
  if (range === 'range-30d') {
    findings.push({
      id: 'finding-reach-eng',
      statement: 'Engagement rate fell 0.8% to 4.7% while impressions rose 18.4% to 284,712.',
      explanation: 'More people saw the posts, but proportionally fewer engaged.',
      metric: 'Impressions: 284,712 (+18.4%) · Engagement: 4.7% (-0.8%)',
    });
  } else if (range === 'range-7d') {
    findings.push({
      id: 'finding-reach-eng',
      statement: 'Impressions grew 12.3% to 74,210 while engagement held at 5.4%.',
      explanation: 'Reach expanded without losing audience interaction.',
      metric: 'Impressions: 74,210 (+12.3%) · Engagement: 5.4% (+0.6%)',
    });
  } else if (range === 'range-90d') {
    findings.push({
      id: 'finding-reach-eng',
      statement: 'Quarterly impressions rose 34.8% to 892,440 with engagement up to 5.8%.',
      explanation: 'Consistent posting built audience size while improving response rate.',
      metric: 'Impressions: 892,440 (+34.8%) · Engagement: 5.8% (+1.2%)',
    });
  } else {
    findings.push({
      id: 'finding-reach-eng',
      statement: 'Custom period generated 198,340 impressions with a 5.1% engagement rate.',
      explanation: 'Audience response matched regular baseline averages.',
      metric: 'Impressions: 198,340 · Engagement: 5.1%',
    });
  }

  // Finding 2: Format Performance (Actionable Recommendation)
  findings.push({
    id: 'finding-format',
    statement: 'Shift more weekly slots to carousels and infographics.',
    explanation: 'Visual formats average 7.4% and 6.5% engagement, while plain text averages 4.8%.',
    metric: 'Infographics: 7.4% · Carousels: 6.5% · Text: 4.8%',
  });

  // Finding 3: Peak Publishing Window (Plain prose)
  findings.push({
    id: 'finding-timing',
    statement: 'Wednesday and Thursday mornings carry the strongest engagement.',
    explanation: 'Posts between 10am and 12pm see the highest interaction across the week.',
    metric: 'Peak window: Wed & Thu, 10am–12pm',
  });

  return findings;
}

export default function AnalyticsFindings({ range = 'range-30d' }) {
  const findings = React.useMemo(() => generateFindings(range), [range]);

  return (
    <section className="anl-findings-section" aria-labelledby="anl-findings-title">
      <div className="anl-findings-header">
        <h2 id="anl-findings-title" className="anl-findings-heading">Key findings</h2>
      </div>

      <div className="anl-findings-grid">
        {findings.map((item, idx) => {
          const tintClasses = ['anl-finding-tint-1', 'anl-finding-tint-2', 'anl-finding-tint-3', 'anl-finding-tint-4'];
          const tintClass = tintClasses[idx % tintClasses.length];
          return (
            <article key={item.id} className={`anl-finding-card ${tintClass}`}>
              <div className="anl-finding-body">
                <h3 className="anl-finding-statement">{item.statement}</h3>
                <p className="anl-finding-explanation">{item.explanation}</p>
              </div>
              <div className="anl-finding-footer">
                <span className="anl-finding-metric">{item.metric}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
