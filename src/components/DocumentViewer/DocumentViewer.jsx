import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useEffect, useRef } from 'react';

function DocumentViewer({ document, content, highlightedSection, signatures, cursorPosition, onHighlightClear, onDocumentClick, isCheckedIn = false }) {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  
  // Scroll to highlighted section when it changes
  useEffect(() => {
    if (highlightedSection && editorRef.current) {
      let searchText = '';
      
      if (highlightedSection === 'section_8') {
        searchText = '8.2 Limitation on Indemnity';
      } else if (highlightedSection === 'section_5') {
        searchText = '5.2 Payment Terms';
      } else if (highlightedSection === 'section_3') {
        searchText = '3.1 Term and Renewal';
      }
      
      if (searchText) {
        try {
          const range = window.document.createRange();
          const selection = window.getSelection();
          const walker = window.document.createTreeWalker(
            editorRef.current,
            NodeFilter.SHOW_TEXT,
            null,
            false
          );
          
          let node;
          while ((node = walker.nextNode())) {
            const index = node.textContent.indexOf(searchText);
            if (index !== -1) {
              range.setStart(node, index);
              range.setEnd(node, index + searchText.length);
              selection.removeAllRanges();
              selection.addRange(range);
              
              // Scroll into view
              const rect = range.getBoundingClientRect();
              const container = containerRef.current;
              if (container) {
                container.scrollTop += rect.top - container.getBoundingClientRect().top - 100;
              }
              break;
            }
          }
        } catch (error) {
          console.error('Error highlighting section:', error);
        }
      }
    }
  }, [highlightedSection]);
  
  const processContent = (textContent) => {
    let html = textContent;
    
    // Apply signature formatting
    html = html
      .replace(/⟪INITIALS: ([^|]+) \| ([^|]+) \| ([^⟫]+)⟫/g, 
        '<span contenteditable="false" style="display: inline-block; background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); border: 2px solid #818CF8; border-radius: 6px; padding: 4px 12px; margin: 0 4px; font-size: 11px; font-weight: 600; color: #4338CA; white-space: nowrap;">✍️ INITIALS: $1 | $2 | $3</span>')
      .replace(/⟪SIGNATURE BLOCK⟫\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n([\s\S]*?)⟪END SIGNATURE⟫/g,
        '<div contenteditable="false" style="display: block; background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border: 3px solid #F59E0B; border-radius: 8px; padding: 12px 16px; margin: 8px 0; font-size: 12px; font-weight: 500; color: #92400E; min-width: 300px;"><div style="font-weight: 700; margin-bottom: 8px; color: #B45309;">📝 SIGNATURE BLOCK</div><div style="border-top: 2px solid #F59E0B; padding-top: 8px; white-space: pre-line;">$1</div></div>')
      .replace(/\n/g, '<br/>');
    
    return html;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Document Content - Fully Editable */}
      <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-thin bg-gray-50">
        {/* Checked Out Banner */}
        {isCheckedIn && (
          <div className="sticky top-0 z-10 bg-red-500 text-white px-6 py-3 shadow-md">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <span className="text-lg">🔒</span>
              <div>
                <p className="font-semibold">Document checked out by You</p>
                <p className="text-sm text-red-100">Others cannot edit this document while you have it checked out</p>
              </div>
            </div>
          </div>
        )}
        
        <div
          ref={(el) => {
            editorRef.current = el;
            if (el && window.documentTextarea !== el) {
              window.documentTextarea = el;
            }
          }}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => {
            // Extract plain text content, preserving signature markers
            const textContent = e.currentTarget.innerText || e.currentTarget.textContent;
            onDocumentClick({ content: textContent });
          }}
          className="w-full min-h-full px-16 py-12 bg-white focus:outline-none leading-relaxed whitespace-pre-wrap max-w-3xl mx-auto shadow-sm"
          style={{ 
            cursor: cursorPosition ? 'crosshair' : 'text',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '14px',
            color: '#1f2937',
            lineHeight: '1.8',
            '::selection': {
              backgroundColor: highlightedSection ? '#fef3c7' : undefined
            }
          }}
          spellCheck={false}
          dangerouslySetInnerHTML={{
            __html: processContent(content)
          }}
        />
      </div>
    </div>
  );
}

export default DocumentViewer;

