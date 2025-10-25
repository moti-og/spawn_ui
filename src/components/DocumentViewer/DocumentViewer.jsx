import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useEffect, useRef } from 'react';

function DocumentViewer({ document, content, highlightedSection, signatures, cursorPosition, onHighlightClear, onDocumentClick }) {
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
      {/* Document Header */}
      <div className="px-6 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            <div>
              <h2 className="text-base font-semibold text-gray-900">{document.title}</h2>
              <p className="text-xs text-gray-500">Last modified: October 20, 2025 at 8:34am PST</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-gray-800 text-white text-xs rounded font-medium">Draft</span>
          {highlightedSection && (
            <button
              onClick={onHighlightClear}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear Highlight
            </button>
          )}
        </div>
      </div>

      {/* Document Content - Fully Editable */}
      <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-thin bg-gray-50">
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

