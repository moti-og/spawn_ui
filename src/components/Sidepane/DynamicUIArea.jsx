import { motion, AnimatePresence } from 'framer-motion';
import ApprovalWorkflow from '../SpawnedUI/ApprovalWorkflow';
import RiskAnalysisReport from '../SpawnedUI/RiskAnalysisReport';
import SignatureWizard from '../SpawnedUI/SignatureWizard';
import AllActions from '../SpawnedUI/AllActions';
import VersionHistory from '../SpawnedUI/VersionHistory';
import { Sparkles, X } from 'lucide-react';

function DynamicUIArea({ 
  activeComponent, 
  approvalWorkflow,
  signatures,
  cursorPosition,
  isCheckedIn,
  isHumanChat,
  humanChatName,
  onUpdateApproval,
  onScrollToSection,
  onUpdateDocument,
  onAddSignature,
  onSpawnComponent,
  onSendMessage,
  onCheckInOut,
  onToggleHumanChat
}) {
  const handleClose = () => {
    onSpawnComponent(null);
  };

  const renderComponent = () => {
    // This should never be called when activeComponent is null
    // because Sidepane only renders DynamicUIArea when activeComponent exists
    if (!activeComponent) {
      return null;
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
            isHumanChat={isHumanChat}
            humanChatName={humanChatName}
            onCheckInOut={onCheckInOut}
            onToggleHumanChat={onToggleHumanChat}
          />
        );
      
      case 'VersionHistory':
        return (
          <VersionHistory 
            onUpdateDocument={onUpdateDocument}
            onSendMessage={onSendMessage}
            onSpawnComponent={onSpawnComponent}
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

  // This component should only be rendered when activeComponent exists
  // Sidepane handles the conditional rendering
  if (!activeComponent) {
    return null;
  }

  // Only show X button if there's a real spawned component (not just placeholder)
  const hasSpawnedComponent = activeComponent.type !== 'Highlight';

  return (
    <div 
      className="h-full relative overflow-y-auto bg-gray-50"
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <motion.div
        key={activeComponent.type}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="min-h-full"
      >
        {/* Close Button - Only show for spawned components */}
        {hasSpawnedComponent && (
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg shadow-sm transition-colors"
              title="Close"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
        {renderComponent()}
      </motion.div>
    </div>
  );
}

export default DynamicUIArea;

