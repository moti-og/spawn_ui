import ChatInterface from './ChatInterface';
import DynamicUIArea from './DynamicUIArea';

function Sidepane({ 
  messages, 
  activeComponent, 
  approvalWorkflow,
  signatures,
  cursorPosition,
  onSendMessage, 
  onSpawnComponent,
  onUpdateApproval,
  onScrollToSection,
  onUpdateDocument,
  onAddSignature
}) {
  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Chat Interface - Top 40% */}
      <div className="h-[40%] border-b border-gray-200 bg-white flex-shrink-0">
        <ChatInterface 
          messages={messages}
          onSendMessage={onSendMessage}
          onSpawnComponent={onSpawnComponent}
        />
      </div>

      {/* Dynamic UI Area - Bottom 60% */}
      <div className="flex-1 overflow-y-auto scrollbar-thin bg-gray-50">
        <DynamicUIArea 
          activeComponent={activeComponent}
          approvalWorkflow={approvalWorkflow}
          signatures={signatures}
          cursorPosition={cursorPosition}
          onUpdateApproval={onUpdateApproval}
          onScrollToSection={onScrollToSection}
          onUpdateDocument={onUpdateDocument}
          onAddSignature={onAddSignature}
          onSpawnComponent={onSpawnComponent}
          onSendMessage={onSendMessage}
        />
      </div>
    </div>
  );
}

export default Sidepane;

