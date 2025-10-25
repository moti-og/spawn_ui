export const sampleDocument = {
  id: 'doc_001',
  title: 'Software Services Agreement',
  content: `SOFTWARE SERVICES AGREEMENT

This Agreement is entered into as of October 1, 2025

Between: ACME TECHNOLOGY INC. ("Provider")
and: INNOVATE SOLUTIONS LLC ("Client")

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. SCOPE OF SERVICES

Provider agrees to provide software development and consulting services as described in Exhibit A. All Services shall be performed in a professional manner consistent with industry standards.

3. TERM AND TERMINATION

3.1 Term and Renewal. This Agreement shall commence on the Effective Date and continue for a period of two (2) years. The Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least sixty (60) days prior to the end of the then-current term.

5. PAYMENT TERMS

5.1 Provider shall submit invoices to Client on a monthly basis for Services rendered.

5.2 Payment Terms. Client shall pay Provider within thirty (30) days of invoice date. Invoices will be issued monthly in arrears. Late payments shall accrue interest at 1.5% per month.

8. INDEMNIFICATION

8.1 Provider Indemnity. Provider shall indemnify, defend, and hold harmless Client from any Claims arising from Provider's gross negligence or willful misconduct.

8.2 Limitation on Indemnity. Each party shall indemnify, defend, and hold harmless the other party from any and all Claims arising from or related to this Agreement, provided that the indemnifying party's liability shall not exceed $100,000 in the aggregate. For purposes of this section, "Claims" includes all third-party claims, demands, and actions.

10. LIMITATION OF LIABILITY

EXCEPT FOR BREACHES OF CONFIDENTIALITY OR INDEMNIFICATION OBLIGATIONS, EACH PARTY'S TOTAL LIABILITY UNDER THIS AGREEMENT SHALL NOT EXCEED THE FEES PAID BY CLIENT IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.


SIGNATURE BLOCKS TO BE INSERTED HERE


`,
  sections: [
    { id: 'section_1', title: 'Definitions', start: 0, end: 500, clauseNumber: '1' },
    { id: 'section_8', title: 'Indemnification', start: 2800, end: 3400, clauseNumber: '8.2', riskLevel: 'high' },
    { id: 'section_5', title: 'Payment Terms', start: 2100, end: 2400, clauseNumber: '5.2' },
    { id: 'section_3', title: 'Term and Renewal', start: 1400, end: 1800, clauseNumber: '3.1' }
  ]
};

