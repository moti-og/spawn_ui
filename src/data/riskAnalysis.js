export const riskAnalysisData = {
  clause: '8.2',
  title: 'Indemnification Clause',
  overallScore: 6.5,
  risks: [
    {
      id: 'risk_1',
      severity: 'high',
      title: 'Cap Amount Too Low',
      description: 'The $100,000 indemnification cap is significantly below industry standards for software services agreements of this scope.',
      current: '$100,000 cap',
      industryStandard: '$1M-5M',
      impact: 'Insufficient coverage for potential IP claims or data breach incidents',
      recommendation: 'Increase cap to $2,000,000',
      suggestedChange: {
        old: 'shall not exceed $100,000 in the aggregate',
        new: 'shall not exceed $2,000,000 in the aggregate'
      }
    },
    {
      id: 'risk_2',
      severity: 'medium',
      title: 'Broad Definition of "Claims"',
      description: 'The definition of "Claims" includes all third-party claims without limitation or carve-outs.',
      issue: '"Claims" includes third-party claims without limitation',
      impact: 'Could include pre-existing claims or claims unrelated to the services provided',
      recommendation: 'Add carve-out for pre-existing claims',
      suggestedLanguage: '"Claims" excludes any third-party claims that existed or were pending prior to the Effective Date of this Agreement, or that arise from Client\'s modifications to the Deliverables.'
    },
    {
      id: 'risk_3',
      severity: 'low',
      title: 'Mutual Indemnification Obligations',
      description: 'Both parties have equal indemnification obligations, which is standard and acceptable for this type of agreement.',
      status: 'acceptable',
      note: 'Mutual indemnification is common in B2B software agreements and protects both parties equally.'
    }
  ]
};

