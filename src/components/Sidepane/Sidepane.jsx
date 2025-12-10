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

      {/* Dynamic UI Area - Top section */}
      <div className="flex-1 overflow-y-auto scrollbar-thin bg-gray-50 border-b border-gray-200">
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
      </div>

      {/* Messages Area - 30% of height (50% of original size) */}
      <div className="h-[30%] overflow-y-auto border-b border-gray-200 bg-white flex-shrink-0">
        <ChatInterface 
          messages={messages}
          onSendMessage={onSendMessage}
          onSpawnComponent={onSpawnComponent}
          showInputArea={false}
          isCheckedIn={isCheckedIn}
          onCheckInOut={onCheckInOut}
        />
      </div>

      {/* Input Area - Fixed at bottom */}
      <ChatInterface 
        messages={messages}
        onSendMessage={onSendMessage}
        onSpawnComponent={onSpawnComponent}
        inputAreaOnly={true}
        isCheckedIn={isCheckedIn}
        onCheckInOut={onCheckInOut}
      />
    </div>
  );
}

export default Sidepane;

