import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';

function SignatureWizard({ signatures, cursorPosition, onAddSignature, onSendMessage }) {
  const [showInstructions, setShowInstructions] = useState(true);
  const [signatories, setSignatories] = useState([
    { id: 'sig_1', name: 'John Smith', title: 'CEO', party: 'Your Company', autoFillDate: true },
    { id: 'sig_2', name: 'Jane Doe', title: 'VP Operations', party: 'Client Company', autoFillDate: true }
  ]);

  const addSignatory = () => {
    setSignatories([
      ...signatories,
      {
        id: `sig_${Date.now()}`,
        name: '',
        title: '',
        party: 'Additional Party',
        autoFillDate: true
      }
    ]);
  };

  const updateSignatory = (id, field, value) => {
    setSignatories(signatories.map(sig => 
      sig.id === id ? { ...sig, [field]: value } : sig
    ));
  };

  const removeSignatory = (id) => {
    setSignatories(signatories.filter(sig => sig.id !== id));
  };

  const handleInsertBlock = (sig, type) => {
    onAddSignature({
      id: `${sig.id}_${type}_${Date.now()}`,
      name: sig.name,
      title: sig.title,
      type: type, // 'full' or 'initials'
      date: sig.autoFillDate ? new Date().toLocaleDateString() : null
    });

    onSendMessage({
      sender: 'ai',
      content: `✅ ${type === 'initials' ? 'Initials' : 'Signature block'} for ${sig.name} inserted at cursor position!`
    });
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Instructions */}
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative"
          >
            <button
              onClick={() => setShowInstructions(false)}
              className="absolute top-3 right-3 text-blue-400 hover:text-blue-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="pr-6">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 How this works</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• The document on the left is fully editable - click and type anywhere</li>
                <li>• Click "Insert Initials" or "Insert Full Block" to add signatures</li>
                <li>• Signatures will be added to the end of the document</li>
                <li>• You can then edit, move, or delete them in the document text</li>
              </ul>
            </div>
          </motion.div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-gray-900">Add Signature Blocks</h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure signatures for all required parties
          </p>
        </div>

        <div className="space-y-4">
          {signatories.map((sig, index) => (
            <motion.div
              key={sig.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4 bg-white"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-gray-900">{sig.party}</h3>
                {signatories.length > 1 && (
                  <button
                    onClick={() => removeSignatory(sig.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={sig.name}
                    onChange={(e) => updateSignatory(sig.id, 'name', e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={sig.title}
                    onChange={(e) => updateSignatory(sig.id, 'title', e.target.value)}
                    placeholder="Job title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sig.autoFillDate}
                    onChange={(e) => updateSignatory(sig.id, 'autoFillDate', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Auto-fill date</span>
                </label>
              </div>

              {/* Insert Buttons */}
              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleInsertBlock(sig, 'initials')}
                  disabled={!sig.name || !sig.title}
                  className="flex-1 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Insert Initials
                </button>
                <button
                  onClick={() => handleInsertBlock(sig, 'full')}
                  disabled={!sig.name || !sig.title}
                  className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Insert Full Block
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={addSignatory}
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors w-full justify-center"
        >
          <Plus className="w-4 h-4" />
          Add another signatory
        </button>
      </motion.div>
    </div>
  );
}

export default SignatureWizard;
