import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

function DocumentViewer({ document, content, highlightedSection, signatures, cursorPosition, onHighlightClear, onDocumentClick }) {
  const renderContent = () => {
    let renderedContent = content;
    
    // Find the indemnification section for highlighting
    const indemnificationStart = content.indexOf('8.2 Limitation on Indemnity');
    const indemnificationEnd = content.indexOf('8.3 Indemnification Procedure');
    
    if (highlightedSection === 'section_8' && indemnificationStart !== -1 && indemnificationEnd !== -1) {
      const before = content.substring(0, indemnificationStart);
      const highlighted = content.substring(indemnificationStart, indemnificationEnd);
      const after = content.substring(indemnificationEnd);
      
      return (
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
          {before}
          <motion.span
            id="section_8"
            initial={{ backgroundColor: 'transparent' }}
            animate={{ backgroundColor: '#fef3c7' }}
            transition={{ duration: 0.4 }}
            className="inline-block rounded px-2 -mx-2"
          >
            {highlighted}
          </motion.span>
          {after}
        </pre>
      );
    }
    
    // Find payment terms section for highlighting
    const paymentStart = content.indexOf('5.2 Payment Terms');
    const paymentEnd = content.indexOf('6. INTELLECTUAL PROPERTY');
    
    if (highlightedSection === 'section_5' && paymentStart !== -1 && paymentEnd !== -1) {
      const before = content.substring(0, paymentStart);
      const highlighted = content.substring(paymentStart, paymentEnd);
      const after = content.substring(paymentEnd);
      
      return (
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
          {before}
          <motion.span
            id="section_5"
            initial={{ backgroundColor: 'transparent' }}
            animate={{ backgroundColor: '#bfdbfe' }}
            transition={{ duration: 0.4 }}
            className="inline-block rounded px-2 -mx-2"
          >
            {highlighted}
          </motion.span>
          {after}
        </pre>
      );
    }
    
    // Find term section for highlighting
    const termStart = content.indexOf('3.1 Term and Renewal');
    const termEnd = content.indexOf('3.2 Termination for Convenience');
    
    if (highlightedSection === 'section_3' && termStart !== -1 && termEnd !== -1) {
      const before = content.substring(0, termStart);
      const highlighted = content.substring(termStart, termEnd);
      const after = content.substring(termEnd);
      
      return (
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
          {before}
          <motion.span
            id="section_3"
            initial={{ backgroundColor: 'transparent' }}
            animate={{ backgroundColor: '#bfdbfe' }}
            transition={{ duration: 0.4 }}
            className="inline-block rounded px-2 -mx-2"
          >
            {highlighted}
          </motion.span>
          {after}
        </pre>
      );
    }
    
    return <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{renderedContent}</pre>;
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
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div
          ref={(el) => {
            if (el && window.documentTextarea !== el) {
              window.documentTextarea = el;
            }
          }}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => onDocumentClick({ content: e.currentTarget.textContent })}
          className="w-full min-h-full px-8 py-6 bg-white focus:outline-none font-mono text-sm leading-relaxed whitespace-pre-wrap"
          style={{ 
            cursor: cursorPosition ? 'crosshair' : 'text'
          }}
          spellCheck={false}
          dangerouslySetInnerHTML={{
            __html: content
              .replace(/⟪INITIALS: ([^|]+) \| ([^|]+) \| ([^⟫]+)⟫/g, 
                '<span style="display: inline-block; background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); border: 2px solid #818CF8; border-radius: 6px; padding: 4px 12px; margin: 0 4px; font-size: 11px; font-weight: 600; color: #4338CA;">✍️ INITIALS: $1 | $2 | $3</span>')
              .replace(/⟪SIGNATURE BLOCK⟫\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n([\s\S]*?)⟪END SIGNATURE⟫/g,
                '<div style="display: inline-block; background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border: 3px solid #F59E0B; border-radius: 8px; padding: 12px 16px; margin: 8px 0; font-size: 12px; font-weight: 500; color: #92400E; min-width: 300px;"><div style="font-weight: 700; margin-bottom: 8px; color: #B45309;">📝 SIGNATURE BLOCK</div><div style="border-top: 2px solid #F59E0B; padding-top: 8px; white-space: pre-line;">$1</div></div>')
              .replace(/\n/g, '<br/>')
          }}
        />
      </div>
    </div>
  );
}

export default DocumentViewer;

