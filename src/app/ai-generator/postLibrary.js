/**
 * Real Post Generation Library with Distinct Content and Natural Titles
 * 
 * Each entry provides:
 * - title: A distinct editorial headline derived from the content (never prepending the topic string)
 * - hookPrefix: The opening hook line for mobile preview
 * - takeaways: Actionable bullet points
 * - visualSummary: Distinct text for infographic/text media bands
 */

export const MOCK_POST_LIBRARY = {
  'Thought Leadership': [
    {
      title: 'Why Async Documentation Beats Daily Standups',
      hookPrefix: 'After 3 years leading distributed engineering squads, here is the counter-intuitive operating playbook:',
      takeaways: [
        '1. Replace 30-minute syncs with 24-hour asynchronous RFC threads',
        '2. Turn customer support tickets into public post-mortems',
        '3. Protect 4-hour morning focus blocks across all regional timezones',
      ],
      visualSummary: 'Async RFCs over daily sync meetings: +34% deep work focus',
    },
    {
      title: 'The Hidden Tax of Premature Microservice Splitting',
      hookPrefix: 'We migrated 8 distributed services back into a modular monolith. Here is what happened to velocity:',
      takeaways: [
        '→ Zero network overhead and simplified distributed transaction boundaries',
        '→ End-to-end integration test suites run in under 45 seconds locally',
        '→ Onboarding ramp time for junior hires dropped from 3 weeks to 4 days',
      ],
      visualSummary: 'Monolith consolidation: -62% cloud spend, +40% release velocity',
    },
    {
      title: 'Engineering Velocity Is a Proxy for Trust',
      hookPrefix: 'High-performing teams do not move fast because of Jira frameworks. They move fast because of autonomy:',
      takeaways: [
        '• Default to open PR reviews instead of multi-tiered gatekeepers',
        '• Standardize on automated contract tests over manual regression spreadsheets',
        '• Give engineers production deployment rights on Day 1',
      ],
      visualSummary: 'Trust-based governance: 14 deployments/day with 99.98% uptime',
    },
    {
      title: 'Stop Measuring Code Commits — Measure Decision Latency',
      hookPrefix: 'Lines of code and commit velocity are vanity metrics. Here is the true leading indicator of team throughput:',
      takeaways: [
        '1. Time from architecture question raised to decision signed off',
        '2. Unprompted peer feedback turnaround on pull requests',
        '3. Resolution time for high-severity customer blockers',
      ],
      visualSummary: 'Decision Latency: Target < 4 hours from RFC submission',
    },
  ],

  'Engineering Culture': [
    {
      title: 'Building Blameless Post-Mortems That Actually Stick',
      hookPrefix: 'When our primary payment worker halted during peak traffic, nobody opened a Slack blame war:',
      takeaways: [
        '→ Focused entirely on the system fragility and missing queue alerts',
        '→ Authored an internal incident timeline within 4 hours',
        '→ Added automated circuit breakers to third-party payment gateways',
      ],
      visualSummary: 'Blameless retrospectives: 0 repeat outages in 12 months',
    },
    {
      title: 'How We Scaled On-Call Rotation Without Burnout',
      hookPrefix: 'PagerDuty fatigue was our highest attrition driver until we re-engineered the rotation protocol:',
      takeaways: [
        '• Secondary shadow engineers handle all non-critical alerts during business hours',
        '• Automatic 1-day comp time granted following overnight incident escalations',
        '• Strict zero-alert policy for non-actionable transient warnings',
      ],
      visualSummary: 'On-call reform: 85% reduction in after-hours pages',
    },
    {
      title: 'The 20% Architecture Day Playbook',
      hookPrefix: 'Tech debt does not get paid down accidentally. Here is our Friday engineering allocation system:',
      takeaways: [
        '1. Dedicated focus blocks to upgrade dependencies and prune dead code',
        '2. Engineers pitch technical refactors directly to product counterparts',
        '3. Measure speed improvements on local build and test execution',
      ],
      visualSummary: 'Continuous refactoring: 2.1x faster CI/CD pipelines',
    },
  ],

  'Case Studies': [
    {
      title: 'Cutting p99 API Latency from 840ms to 42ms',
      hookPrefix: 'Here is the step-by-step optimization roadmap that unlocked 20x throughput on our core endpoints:',
      takeaways: [
        '1. Replaced unindexed Mongoose queries with targeted Atlas projection pipelines',
        '2. Added multi-tier Redis caching on hot organization metadata',
        '3. Streamlined payload responses to return only client-required attributes',
      ],
      visualSummary: 'API Optimization: 95% latency reduction at 10k req/sec',
    },
    {
      title: 'From 14-Day Enterprise Pilots to 1-Hour Self-Serve Onboarding',
      hookPrefix: 'How we streamlined onboarding by stripping away 7 mandatory setup steps in our web console:',
      takeaways: [
        '→ Pre-configured production defaults replace 20-field setup forms',
        '→ Interactive sandbox environments let teams test before connecting credentials',
        '→ Conversion from signup to active pipeline jumped by 58%',
      ],
      visualSummary: 'Self-serve onboarding: +58% activation rate in 30 days',
    },
    {
      title: 'Slashing Cloud Compute Costs by 46% with ARM64 Lambda',
      hookPrefix: 'Our infrastructure bill was scaling linearly with traffic until we modernized the compute layer:',
      takeaways: [
        '• Migrated backend workloads to AWS Graviton architecture with zero code rewrites',
        '• Consolidated shared utility dependencies into optimized Lambda Layers',
        '• Configured automated EventBridge cron teardowns for non-prod staging clusters',
      ],
      visualSummary: 'Compute Optimization: -46% AWS monthly expenditure',
    },
  ],

  'Industry Insights': [
    {
      title: 'Why Specialized Vertical SaaS Is Outperforming Horizontal Suites',
      hookPrefix: 'The era of bloated all-in-one platforms is cooling down. Here is where enterprise budgets are flowing:',
      takeaways: [
        '→ Deep domain workflows with customized regulatory compliance built in',
        '→ Higher net retention rates driven by tailored integrations',
        '→ Shorter sales cycles because value propositions are immediately obvious',
      ],
      visualSummary: 'Vertical SaaS Trends: 128% Net Revenue Retention average',
    },
    {
      title: 'The Shift from Pure Headcount to High-Leverage AI Workflows',
      hookPrefix: 'Companies scaling revenue in 2026 are not doubling engineering headcount. They are doubling tool leverage:',
      takeaways: [
        '1. Automated synthesis for customer feedback and bug categorization',
        '2. Instant prototype generation directly from design token specifications',
        '3. Asynchronous AI agents handling routine operational audits',
      ],
      visualSummary: 'High-Leverage Teams: 3.4x revenue per employee efficiency',
    },
  ],
};

/**
 * Returns a distinct post template for a given pillar and index
 */
export function getPostContent(pillar, index) {
  const library = MOCK_POST_LIBRARY[pillar] || MOCK_POST_LIBRARY['Thought Leadership'];
  return library[index % library.length];
}
