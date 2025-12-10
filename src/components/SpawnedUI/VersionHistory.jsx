import { History, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

function VersionHistory({ onUpdateDocument, onSendMessage, onSpawnComponent }) {
  const [currentVersionId, setCurrentVersionId] = useState('v5');
  
  const versions = [
    {
      id: 'v5',
      version: '5.0',
      date: 'December 10, 2025 9:15 AM',
      author: 'You',
      changes: 'Added new payment terms section'
    },
    {
      id: 'v4',
      version: '4.0',
      date: 'December 9, 2025 3:42 PM',
      author: 'Sarah Chen',
      changes: 'Updated indemnification clause language'
    },
    {
      id: 'v3',
      version: '3.0',
      date: 'December 8, 2025 11:20 AM',
      author: 'Michael Rodriguez',
      changes: 'Revised termination conditions'
    },
    {
      id: 'v2',
      version: '2.0',
      date: 'December 7, 2025 2:15 PM',
      author: 'You',
      changes: 'Modified scope of services section'
    },
    {
      id: 'v1',
      version: '1.0',
      date: 'December 5, 2025 10:00 AM',
      author: 'Legal Team',
      changes: 'Initial draft created'
    }
  ];

  const handleVersionClick = (version) => {
    // Update the current version ID
    setCurrentVersionId(version.id);
    // Update document with version-specific content
    let versionContent = '';
    
    switch(version.id) {
      case 'v5':
        versionContent = `SOFTWARE SERVICES AGREEMENT

This Agreement is entered into as of October 1, 2025

Between: ACME TECHNOLOGY INC. ("Provider")
and: INNOVATE SOLUTIONS LLC ("Client")

━━━━━━━━━━━━━━━━━━━━━━

1. SCOPE OF SERVICES

Provider agrees to provide software development and consulting services as described in Exhibit A. All Services shall be performed in a professional manner consistent with industry standards.

3. TERM AND TERMINATION

3.1 Term and Renewal. This Agreement shall commence on the Effective Date and continue for a period of two (2) years. The Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least sixty (60) days prior to the end of the then-current term.

5. PAYMENT TERMS

5.1 Provider shall submit invoices to Client on a monthly basis for Services rendered.

5.2 Payment Terms. Client shall pay Provider within thirty (30) days of invoice date. Invoices will be issued monthly in arrears. Late payments shall accrue interest at 1.5% per month.

5.3 New Section: All payments must be made via wire transfer or ACH. Credit card payments will incur a 3% processing fee.

8. INDEMNIFICATION

8.1 Provider Indemnity. Provider shall indemnify, defend, and hold harmless Client from any Claims arising from Provider's gross negligence or willful misconduct.

8.2 Limitation on Indemnity. Each party shall indemnify, defend, and hold harmless the other party from and all Claims arising from or related to this Agreement, provided that the indemnifying party's liability shall not exceed $100,000 in the aggregate. For purposes of this section, "Claims" includes all third-party claims, including attorney fees and costs.

━━━━━━━━━━━━━━━━━━━━━━

[Version 5.0 - Current Version - Added payment processing details]`;
        break;
        
      case 'v4':
        versionContent = `SOFTWARE SERVICES AGREEMENT

This Agreement is entered into as of October 1, 2025

Between: ACME TECHNOLOGY INC. ("Provider")
and: INNOVATE SOLUTIONS LLC ("Client")

━━━━━━━━━━━━━━━━━━━━━━

1. SCOPE OF SERVICES

Provider agrees to provide software development and consulting services as described in Exhibit A. All Services shall be performed in a professional manner consistent with industry standards.

3. TERM AND TERMINATION

3.1 Term and Renewal. This Agreement shall commence on the Effective Date and continue for a period of two (2) years. The Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least sixty (60) days prior to the end of the then-current term.

5. PAYMENT TERMS

5.1 Provider shall submit invoices to Client on a monthly basis for Services rendered.

5.2 Payment Terms. Client shall pay Provider within thirty (30) days of invoice date. Invoices will be issued monthly in arrears. Late payments shall accrue interest at 1.5% per month.

8. INDEMNIFICATION

8.1 Provider Indemnity. Provider shall indemnify, defend, and hold harmless Client from any Claims arising from Provider's gross negligence or willful misconduct.

8.2 Limitation on Indemnity. Each party shall indemnify, defend, and hold harmless the other party from and all Claims arising from or related to this Agreement, provided that the indemnifying party's liability shall not exceed $100,000 in the aggregate. For purposes of this section, "Claims" includes all third-party claims, including attorney fees and costs.

━━━━━━━━━━━━━━━━━━━━━━

[Version 4.0 - Updated indemnification language with lower cap]`;
        break;
        
      case 'v3':
        versionContent = `SOFTWARE SERVICES AGREEMENT

This Agreement is entered into as of October 1, 2025

Between: ACME TECHNOLOGY INC. ("Provider")
and: INNOVATE SOLUTIONS LLC ("Client")

━━━━━━━━━━━━━━━━━━━━━━

1. SCOPE OF SERVICES

Provider agrees to provide software development and consulting services as described in Exhibit A. All Services shall be performed in a professional manner consistent with industry standards.

3. TERM AND TERMINATION

3.1 Term and Renewal. This Agreement shall commence on the Effective Date and continue for a period of two (2) years. The Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least sixty (60) days prior to the end of the then-current term.

[Note: Previously required 90 days notice for non-renewal]

5. PAYMENT TERMS

5.1 Provider shall submit invoices to Client on a monthly basis for Services rendered.

5.2 Payment Terms. Client shall pay Provider within thirty (30) days of invoice date.

8. INDEMNIFICATION

8.1 Provider Indemnity. Provider shall indemnify, defend, and hold harmless Client from any Claims arising from Provider's gross negligence or willful misconduct.

8.2 Limitation on Indemnity. Each party shall indemnify the other for claims up to $250,000.

━━━━━━━━━━━━━━━━━━━━━━

[Version 3.0 - Revised termination notice period from 90 to 60 days]`;
        break;
        
      case 'v2':
        versionContent = `SOFTWARE SERVICES AGREEMENT

This Agreement is entered into as of October 1, 2025

Between: ACME TECHNOLOGY INC. ("Provider")
and: INNOVATE SOLUTIONS LLC ("Client")

━━━━━━━━━━━━━━━━━━━━━━

1. SCOPE OF SERVICES

Provider agrees to provide comprehensive software development, consulting, and maintenance services as described in Exhibit A and Exhibit B. All Services shall be performed in a professional manner consistent with industry standards.

[Note: Previous version only mentioned development and consulting]

3. TERM AND TERMINATION

3.1 Term and Renewal. This Agreement shall commence on the Effective Date and continue for a period of two (2) years. Notice required: 90 days.

5. PAYMENT TERMS

5.1 Provider shall submit invoices to Client on a monthly basis for Services rendered.

5.2 Payment Terms. Client shall pay Provider within thirty (30) days of invoice date.

8. INDEMNIFICATION

8.1 Provider Indemnity. Provider shall indemnify Client from Claims.

8.2 Limitation on Indemnity. Claims capped at $250,000.

━━━━━━━━━━━━━━━━━━━━━━

[Version 2.0 - Expanded scope to include maintenance services]`;
        break;
        
      case 'v1':
        versionContent = `SOFTWARE SERVICES AGREEMENT - DRAFT

This Agreement is entered into as of October 1, 2025

Between: ACME TECHNOLOGY INC. ("Provider")
and: INNOVATE SOLUTIONS LLC ("Client")

━━━━━━━━━━━━━━━━━━━━━━

1. SCOPE OF SERVICES

Provider agrees to provide software development services. Details TBD.

3. TERM AND TERMINATION

3.1 Term: Two years with automatic renewal.

5. PAYMENT TERMS

5.1 Monthly invoicing.

5.2 Net 30 payment terms.

8. INDEMNIFICATION

8.1 Standard indemnification provisions apply.

8.2 Liability cap: TBD

━━━━━━━━━━━━━━━━━━━━━━

[Version 1.0 - Initial Draft - Many sections incomplete]`;
        break;
        
      default:
        return;
    }
    
    onUpdateDocument(versionContent);
    onSendMessage({
      sender: 'ai',
      content: `✅ Loaded Version ${version.version} from ${version.date}`
    });
    // Keep the version history view open so users can easily switch between versions
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <History className="w-6 h-6 text-teal-600" />
          Version History
        </h2>
        <p className="text-sm text-gray-600">View and restore previous versions of this document</p>
      </div>

      <div className="space-y-3">
        {versions.map((version, index) => (
          <motion.div
            key={version.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => handleVersionClick(version)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                currentVersionId === version.id
                  ? 'bg-teal-50 border-teal-300 hover:bg-teal-100'
                  : 'bg-white border-gray-200 hover:border-teal-300 hover:bg-teal-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-lg ${currentVersionId === version.id ? 'text-teal-700' : 'text-gray-700'}`}>
                    Version {version.version}
                  </span>
                  {currentVersionId === version.id && (
                    <span className="px-2 py-0.5 bg-teal-600 text-white text-xs rounded-full font-medium">
                      Current
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{version.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{version.author}</span>
                </div>
                <p className="text-gray-700 mt-2 font-medium">{version.changes}</p>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default VersionHistory;

