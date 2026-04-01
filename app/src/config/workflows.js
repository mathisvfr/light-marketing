export const OUTPUT_ACTIONS = [
  {
    id: 'shorter',
    label: 'Shorter',
    instruction: 'Rewrite the last output in a shorter, tighter version without losing the key message.',
  },
  {
    id: 'professional',
    label: 'More professional',
    instruction:
      'Rewrite the last output in a more professional and polished tone while keeping it human and natural.',
  },
  {
    id: 'warmer',
    label: 'More warm',
    instruction:
      'Rewrite the last output in a warmer, more approachable tone without sounding informal or weak.',
  },
  {
    id: 'bilingual',
    label: 'Make bilingual',
    instruction:
      'Rewrite the last output in two sections: first Dutch, then English, keeping the meaning aligned.',
  },
  {
    id: 'cta',
    label: 'Add CTA',
    instruction:
      'Improve the last output by adding a stronger, clearer call to action that fits the audience and channel.',
  },
  {
    id: 'linkedin',
    label: 'Rewrite for LinkedIn',
    instruction:
      'Rewrite the last output specifically for LinkedIn best practices: strong hook, short paragraphs, scroll-stopping structure, and relevant hashtags if useful.',
  },
]

export const WORKFLOWS = [
  {
    id: 'vacancy-campaign',
    title: 'Promote a Vacancy',
    eyebrow: 'Most used',
    icon: '📣',
    skillId: 'social-content',
    summary: 'Turn one vacancy into a post, ad copy, and website-ready text.',
    audience: 'Job seekers',
    channel: 'LinkedIn',
    language: 'Dutch',
    fields: [
      { name: 'jobTitle', label: 'Job title', placeholder: 'Forklift driver', required: true },
      { name: 'location', label: 'Location', placeholder: 'Rotterdam', required: true },
      { name: 'employmentType', label: 'Employment type', placeholder: 'Full-time / Part-time / Temporary' },
      { name: 'salary', label: 'Salary or rate', placeholder: 'EUR 2,700 - 3,100 per month' },
      { name: 'experience', label: 'Experience level', placeholder: 'Starter / Medior / Senior' },
      { name: 'whyApply', label: 'Why should someone apply?', placeholder: 'Stable hours, direct contact, growth opportunities', required: true },
      { name: 'callToAction', label: 'Desired CTA', placeholder: 'Apply today via our website or call us directly' },
    ],
  },
  {
    id: 'employer-outreach',
    title: 'Employer Outreach',
    eyebrow: 'BD workflow',
    icon: '🤝',
    skillId: 'cold-email',
    summary: 'Write cold outreach or follow-ups for employers and prospects.',
    audience: 'Employers',
    channel: 'Email',
    language: 'Dutch',
    fields: [
      { name: 'companyName', label: 'Company', placeholder: 'Van Dijk Logistics', required: true },
      { name: 'sector', label: 'Sector', placeholder: 'Logistics', required: true },
      { name: 'contactRole', label: 'Contact role', placeholder: 'HR Manager / Operations Manager' },
      { name: 'painPoint', label: 'Likely hiring pain', placeholder: 'Hard-to-fill shifts, seasonal peaks, no-shows', required: true },
      { name: 'proof', label: 'Proof or credibility', placeholder: 'Fast placements in Rotterdam and personal support' },
      { name: 'personalization', label: 'Personalization signal', placeholder: 'Hiring growth, expansion, recent LinkedIn post' },
      { name: 'callToAction', label: 'Desired CTA', placeholder: '15-minute intro call next week' },
    ],
  },
  {
    id: 'social-post',
    title: 'Social Post',
    eyebrow: 'Fast content',
    icon: '📱',
    skillId: 'social-content',
    summary: 'Create a post for LinkedIn, Instagram, or Facebook.',
    audience: 'Mixed audience',
    channel: 'LinkedIn',
    language: 'Dutch',
    fields: [
      { name: 'topic', label: 'Topic', placeholder: 'New vacancy, success story, labour market insight', required: true },
      { name: 'goal', label: 'Goal', placeholder: 'Awareness, clicks, applications, employer trust', required: true },
      { name: 'audienceDetails', label: 'Who is this for?', placeholder: 'Candidates in logistics / employers in Rotterdam', required: true },
      { name: 'tone', label: 'Tone', placeholder: 'Professional, direct, warm, upbeat' },
      { name: 'sourceNotes', label: 'Key points to include', placeholder: 'Any facts, quotes, deadlines, details' },
      { name: 'callToAction', label: 'Desired CTA', placeholder: 'Send a DM, apply now, visit the page' },
    ],
  },
  {
    id: 'newsletter',
    title: 'Newsletter Draft',
    eyebrow: 'Retention',
    icon: '📰',
    skillId: 'email-sequence',
    summary: 'Generate a newsletter intro and suggested structure.',
    audience: 'Job seekers',
    channel: 'Email',
    language: 'Dutch',
    fields: [
      { name: 'theme', label: 'Edition theme', placeholder: 'Spring hiring update', required: true },
      { name: 'audienceDetails', label: 'Audience', placeholder: 'Job seekers / employers / mixed list', required: true },
      { name: 'mainMessage', label: 'Main message', placeholder: 'New opportunities, market update, top advice', required: true },
      { name: 'sections', label: 'Must-have sections', placeholder: 'Vacancies, tip of the month, employer spotlight' },
      { name: 'tone', label: 'Tone', placeholder: 'Warm, practical, direct' },
      { name: 'callToAction', label: 'Desired CTA', placeholder: 'Read more, reply, apply, contact us' },
    ],
  },
  {
    id: 'content-planner',
    title: 'Weekly Content Plan',
    eyebrow: 'Planning',
    icon: '🗓️',
    skillId: 'content-strategy',
    summary: 'Plan the next week or month of content across channels.',
    audience: 'Mixed audience',
    channel: 'Multi-channel',
    language: 'Dutch',
    fields: [
      { name: 'timeframe', label: 'Timeframe', placeholder: 'Next 7 days / next month', required: true },
      { name: 'channels', label: 'Channels', placeholder: 'LinkedIn, website, email', required: true },
      { name: 'businessGoal', label: 'Business goal', placeholder: 'More applications, more employer leads', required: true },
      { name: 'audienceDetails', label: 'Primary audience', placeholder: 'Candidates, employers, or both', required: true },
      { name: 'themes', label: 'Themes or campaigns', placeholder: 'Transport vacatures, summer staffing, employer trust' },
      { name: 'constraints', label: 'Constraints', placeholder: 'Small team, one post per day, no video' },
    ],
  },
  {
    id: 'seo-page',
    title: 'SEO Page Audit',
    eyebrow: 'Website growth',
    icon: '🔎',
    skillId: 'seo-audit',
    summary: 'Audit a page and get improvements for ranking and conversions.',
    audience: 'Employers',
    channel: 'Website',
    language: 'Dutch',
    fields: [
      { name: 'pageUrl', label: 'Page URL', placeholder: 'https://example.com/rotterdam-logistics-jobs', required: true },
      { name: 'keyword', label: 'Target keyword', placeholder: 'uitzendbureau rotterdam logistiek', required: true },
      { name: 'pageGoal', label: 'Page goal', placeholder: 'More applications / more leads', required: true },
      { name: 'currentIssue', label: 'Current issue', placeholder: 'Low rankings, weak copy, unclear structure' },
      { name: 'competitors', label: 'Competitors or reference pages', placeholder: 'Optional competitor URLs or names' },
    ],
  },
]

export function getWorkflowById(workflowId) {
  return WORKFLOWS.find((workflow) => workflow.id === workflowId) ?? WORKFLOWS[0]
}

export function buildWorkflowPrompt(workflow, values) {
  const fieldLines = workflow.fields
    .map((field) => {
      const value = values[field.name]?.trim()
      return value ? `- ${field.label}: ${value}` : null
    })
    .filter(Boolean)
    .join('\n')

  return `Use the ${workflow.title} workflow.

Context:
- Audience: ${values.audience || workflow.audience}
- Channel: ${values.channel || workflow.channel}
- Language: ${values.language || workflow.language}

Brief:
${fieldLines}

Instructions:
- Produce a polished first draft that is immediately usable.
- If something important is missing, make the most sensible assumption and list the assumptions briefly at the end.
- Keep the output practical and tailored to Light Personeelsdiensten B.V.
- If relevant, include 2-3 variants or options instead of only one.
- End with a short section called "Next edits to consider" with 3 fast improvements.`
}
