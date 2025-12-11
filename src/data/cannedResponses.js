export const cannedResponses = {
  approval: {
    keywords: ['approve', 'approval', 'approvals', 'approved', 'who needs to sign', 'who has approved', 'approval status'],
    response: "Here's the current approval status for this agreement. The document requires approval from Legal, Finance, and the Executive team.",
    spawnComponent: 'ApprovalWorkflow'
  },
  risk: {
    keywords: ['risk', 'risky', 'dangerous', 'problem', 'issue', 'indemnification', 'high risk', 'what is high risk'],
    response: "I've analyzed the indemnification clause and identified several high-risk items that require attention. Here's my detailed assessment with recommendations.",
    spawnComponent: 'RiskAnalysisReport'
  },
  signature: {
    keywords: ['sign', 'signature', 'ready to sign', 'esign', 'where do i sign', 'add signature'],
    response: "Great! Let me help you place signature blocks in the document. I'll guide you through adding signatures for all required parties.",
    spawnComponent: 'SignatureWizard'
  },
  payment: {
    keywords: ['payment', 'pay', 'invoice', 'fee', 'cost'],
    response: "The payment terms are Net 30, with monthly invoicing. Client shall pay within thirty (30) days of invoice date. Late payments accrue interest at 1.5% per month. See clause 5.2.",
    spawnComponent: null,
    highlightSection: 'section_5'
  },
  term: {
    keywords: ['term', 'expire', 'expiration', 'duration', 'how long', 'when does this expire'],
    response: "This agreement has a 2-year term ending October 1, 2027, with automatic renewal for successive one-year terms. Either party may opt out with 60 days notice. See clause 3.1.",
    spawnComponent: null,
    highlightSection: 'section_3'
  },
  summary: {
    keywords: ['summarize', 'summary', 'what is this', 'overview'],
    response: "This is a Software Services Agreement between ACME Technology Inc. (Provider) and Innovate Solutions LLC (Client). It covers software development services with a 2-year term, Net 30 payment terms, standard IP assignment, confidentiality provisions, and mutual indemnification with a $100k cap. The agreement requires approvals from Legal, Finance, and Executive before client signature.",
    spawnComponent: null
  },
  versionhistory: {
    keywords: ['version', 'history', 'previous', 'versions', 'revision', 'revisions', 'show version history'],
    response: "Here's the complete version history for this document. You can click any version to view or restore it.",
    spawnComponent: 'VersionHistory'
  },
  checkin: {
    keywords: ['check in', 'check-in', 'checkin'],
    response: '✅ Document checked in! The document is now available for others to edit.',
    actionType: 'checkin'
  },
  checkout: {
    keywords: ['check out', 'check-out', 'checkout'],
    response: '✅ Document checked out! You now have exclusive edit access. Others will see that you have the document checked out.',
    actionType: 'checkout'
  },
  humanchat: {
    keywords: ['chat with human', 'talk to human', 'human agent', 'speak with human', 'connect with human'],
    response: "I'm connecting you with a human agent. Please wait...",
    actionType: 'humanchat'
  }
};

import { getRandomDadJoke } from './dadJokes';

export const defaultResponse = {
  response: `I'm not able to help with that because you haven't turned on AI in your site settings. But you can always click on "Show All Actions" or try the following actions: Sign, Approvals, Risk Analysis, Versions, and Check In/Out.`,
  spawnComponent: null,
  showButtonPreview: true,
  includeJoke: true
};

export function matchQuery(query) {
  const lowerQuery = query.toLowerCase().trim();
  
  for (const [key, config] of Object.entries(cannedResponses)) {
    for (const keyword of config.keywords) {
      const lowerKeyword = keyword.toLowerCase();
      
      // For single-word keywords: match as complete word (word boundaries)
      // For multi-word keywords: match as complete phrase
      if (lowerKeyword.split(' ').length === 1) {
        // Single word: use word boundary matching
        const wordBoundaryRegex = new RegExp(`\\b${lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (wordBoundaryRegex.test(lowerQuery)) {
          return { ...config, type: key };
        }
      } else {
        // Multi-word phrase: match as complete phrase within query
        if (lowerQuery.includes(lowerKeyword)) {
          return { ...config, type: key };
        }
      }
    }
  }
  
  return { ...defaultResponse, type: 'default' };
}

