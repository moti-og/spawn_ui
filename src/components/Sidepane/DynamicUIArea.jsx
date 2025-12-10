import { motion, AnimatePresence } from 'framer-motion';
import ApprovalWorkflow from '../SpawnedUI/ApprovalWorkflow';
import RiskAnalysisReport from '../SpawnedUI/RiskAnalysisReport';
import SignatureWizard from '../SpawnedUI/SignatureWizard';
import AllActions from '../SpawnedUI/AllActions';
import { Sparkles, X } from 'lucide-react';

function DynamicUIArea({ 
  activeComponent, 
  approvalWorkflow,
  signatures,
  cursorPosition,
  isCheckedIn,
  onUpdateApproval,
  onScrollToSection,
  onUpdateDocument,
  onAddSignature,
  onSpawnComponent,
  onSendMessage
}) {
  const handleClose = () => {
    onSpawnComponent(null);
  };

  const renderComponent = () => {
    if (!activeComponent) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <Sparkles className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">
            AI-Spawned UI Area
          </h3>
          <p className="text-sm text-gray-400 max-w-sm">
            Click a quick action button or ask a question to see AI-generated interfaces appear here
          </p>
        </div>
      );
    }

    switch (activeComponent.type) {
      case 'ApprovalWorkflow':
        return (
          <ApprovalWorkflow 
            workflow={approvalWorkflow}
            onUpdateWorkflow={onUpdateApproval}
            onSendMessage={onSendMessage}
          />
        );
      
      case 'RiskAnalysisReport':
        return (
          <RiskAnalysisReport 
            onScrollToSection={onScrollToSection}
            onUpdateDocument={onUpdateDocument}
            onSendMessage={onSendMessage}
          />
        );
      
      case 'SignatureWizard':
        return (
          <SignatureWizard 
            signatures={signatures}
            cursorPosition={cursorPosition}
            onAddSignature={onAddSignature}
            onSendMessage={onSendMessage}
          />
        );
      
      case 'AllActions':
        return (
          <AllActions 
            onSpawnComponent={onSpawnComponent}
            onSendMessage={onSendMessage}
            isCheckedIn={isCheckedIn}
          />
        );
      
      case 'Highlight':
        // This just triggers document highlighting, no UI component
        onScrollToSection(activeComponent.data.sectionId);
        return null;
      
      default:
        return null;
    }
  };

  return (
    <div className="h-full relative">
      <AnimatePresence mode="wait">
        {activeComponent ? (
          <motion.div
            key={activeComponent.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full"
          >
            {/* Close Button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={handleClose}
                className="p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg shadow-sm transition-colors"
                title="Close"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            {renderComponent()}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            {renderComponent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DynamicUIArea;

