import { useState } from 'react';
import DocumentViewer from './components/DocumentViewer/DocumentViewer';
import Sidepane from './components/Sidepane/Sidepane';
import { sampleDocument } from './data/sampleDocument';
import { initialApprovalWorkflow } from './data/approvalWorkflow';

function App() {
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'ai',
      content: "Hello! 👋 Talk to me and tell me to do things.",
      timestamp: new Date().toISOString()
    },
    {
      id: 'msg_help',
      sender: 'ai',
      content: "Don't know what to do? Click the 'Show All Actions' button.",
      timestamp: new Date().toISOString(),
      showButtonPreview: true
    }
  ]);
  const [activeComponent, setActiveComponent] = useState(null);
  const [highlightedSection, setHighlightedSection] = useState(null);
  const [approvalWorkflow, setApprovalWorkflow] = useState(initialApprovalWorkflow);
  const [documentContent, setDocumentContent] = useState(sampleDocument.content);
  const [signatures, setSignatures] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const addMessage = (message) => {
    setMessages(prev => [...prev, {
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: new Date().toISOString()
    }]);
  };

  const spawnComponent = (componentType, data = null) => {
    if (componentType === null) {
      setActiveComponent(null);
    } else {
      setActiveComponent({ type: componentType, data });
    }
  };

  const onAddSignature = (sig) => {
    const editor = window.documentTextarea;
    if (!editor) return;

    const signatureText = sig.type === 'initials' 
      ? `⟪INITIALS: ${sig.name.split(' ').map(n => n[0]).join('')} | ${sig.name} | ${sig.date || '___/___/______'}⟫`
      : `⟪SIGNATURE BLOCK⟫\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nName: ${sig.name}\nTitle: ${sig.title}\nDate: ${sig.date || '___/___/______'}\n⟪END SIGNATURE⟫`;
    
    // Get current cursor position in contentEditable
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // Use innerText instead of textContent to better preserve line breaks
      // But work from the state to preserve original formatting
      const currentText = documentContent;
      
      // Find position in text by comparing with what's displayed
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editor);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      const cursorPos = preCaretRange.toString().length;
      
      const newContent = currentText.substring(0, cursorPos) + '\n' + signatureText + '\n' + currentText.substring(cursorPos);
      setDocumentContent(newContent);
      
      setTimeout(() => {
        if (editor) {
          editor.focus();
          // Move cursor to end of inserted signature
          const newRange = document.createRange();
          const sel = window.getSelection();
          newRange.selectNodeContents(editor);
          newRange.collapse(false);
          sel.removeAllRanges();
          sel.addRange(newRange);
        }
      }, 50);
    }
    
    addMessage({
      sender: 'ai',
      content: `✅ ${sig.type === 'initials' ? 'Initials' : 'Signature block'} inserted at cursor!`
    });
  };

  const scrollToSection = (sectionId) => {
    setHighlightedSection(sectionId);
  };

  const handleDocumentChange = (data) => {
    if (data.content !== undefined) {
      setDocumentContent(data.content);
    } else {
      setCursorPosition(data);
    }
  };

  const updateDocument = (oldTextOrContent, newText) => {
    // If newText is undefined, assume oldTextOrContent is the full new content
    if (newText === undefined) {
      setDocumentContent(oldTextOrContent);
    } else {
      // Otherwise, do a text replacement
      setDocumentContent(prev => prev.replace(oldTextOrContent, newText));
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <img 
          src="/procurement-navbar.png" 
          alt="Procurement Navigation Bar" 
          className="w-full h-auto"
        />
        {/* Demo Banner - Full Width Centered */}
        <div className="bg-amber-50 border-t border-amber-200 py-2 px-6">
          <div className="flex items-center justify-center">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-amber-700">
              ℹ️ This is a demo to illustrate a concept
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Document Viewer - Left Side */}
        <div className="flex-1 border-r border-gray-200 bg-white overflow-hidden">
          <DocumentViewer 
            document={sampleDocument}
            content={documentContent}
            highlightedSection={highlightedSection}
            signatures={signatures}
            cursorPosition={activeComponent?.type === 'SignatureWizard'}
            onHighlightClear={() => setHighlightedSection(null)}
            onDocumentClick={handleDocumentChange}
            isCheckedIn={isCheckedIn}
          />
        </div>

        {/* Sidepane - Right Side */}
        <div className="w-[650px] bg-white overflow-hidden">
          <Sidepane 
            messages={messages}
            activeComponent={activeComponent}
            approvalWorkflow={approvalWorkflow}
            signatures={signatures}
            cursorPosition={cursorPosition}
            isCheckedIn={isCheckedIn}
            onSendMessage={addMessage}
            onSpawnComponent={spawnComponent}
            onUpdateApproval={setApprovalWorkflow}
            onScrollToSection={scrollToSection}
            onUpdateDocument={updateDocument}
            onAddSignature={onAddSignature}
            onCheckInOut={setIsCheckedIn}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

