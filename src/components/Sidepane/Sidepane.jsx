import ChatInterface from './ChatInterface';
import DynamicUIArea from './DynamicUIArea';

function Sidepane({ 
  messages, 
  activeComponent, 
  approvalWorkflow,
  signatures,
  cursorPosition,
  isCheckedIn,
  onSendMessage, 
  onSpawnComponent,
  onUpdateApproval,
  onScrollToSection,
  onUpdateDocument,
  onAddSignature,
  onCheckInOut
}) {
  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Action Buttons - Fixed at top */}
      <ChatInterface 
        messages={messages}
        onSendMessage={onSendMessage}
        onSpawnComponent={onSpawnComponent}
        actionsOnly={true}
        isCheckedIn={isCheckedIn}
        onCheckInOut={onCheckInOut}
      />

      {/* Chat Messages OR Dynamic UI - Completely replaces each other */}
      <div className="flex-1 border-b border-gray-200 overflow-hidden">
        {activeComponent ? (
          <DynamicUIArea 
            activeComponent={activeComponent}
            approvalWorkflow={approvalWorkflow}
            signatures={signatures}
            cursorPosition={cursorPosition}
            isCheckedIn={isCheckedIn}
            onUpdateApproval={onUpdateApproval}
            onScrollToSection={onScrollToSection}
            onUpdateDocument={onUpdateDocument}
            onAddSignature={onAddSignature}
            onSpawnComponent={onSpawnComponent}
            onSendMessage={onSendMessage}
          />
        ) : (
          <ChatInterface 
            messages={messages}
            onSendMessage={onSendMessage}
            onSpawnComponent={onSpawnComponent}
            messagesOnly={true}
            isCheckedIn={isCheckedIn}
            onCheckInOut={onCheckInOut}
          />
        )}
      </div>

      {/* Text Input - Fixed at bottom */}
      <ChatInterface 
        messages={messages}
        onSendMessage={onSendMessage}
        onSpawnComponent={onSpawnComponent}
        inputOnly={true}
        isCheckedIn={isCheckedIn}
        onCheckInOut={onCheckInOut}
      />
    </div>
  );
}

export default Sidepane;

