import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle, ExternalLink, Copy, X } from 'lucide-react';
import { riskAnalysisData } from '../../data/riskAnalysis';

function RiskAnalysisReport({ onScrollToSection, onUpdateDocument, onSendMessage }) {
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [expandedLanguage, setExpandedLanguage] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const handleViewInDocument = () => {
    onScrollToSection('section_8');
  };

  const handleApplyChange = (risk) => {
    setSelectedRisk(risk);
    setShowChangeModal(true);
  };

  const confirmApplyChange = () => {
    if (selectedRisk && selectedRisk.suggestedChange) {
      onUpdateDocument(
        selectedRisk.suggestedChange.old,
        selectedRisk.suggestedChange.new
      );
      
      setTimeout(() => {
        onSendMessage({
          sender: 'ai',
          content: "Excellent! I've updated the indemnification cap to $2M. This brings the clause in line with industry standards and reduces your risk exposure. The overall risk score has improved from 6.5/10 to 4.5/10."
        });
      }, 500);
    }
    setShowChangeModal(false);
    setSelectedRisk(null);
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-orange-200 bg-orange-50';
      case 'low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-6">
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
              <li>• Click "View in document" to highlight the clause on the left</li>
              <li>• Click "Apply suggested change" to instantly update the document text</li>
              <li>• Changes show a before/after preview for your approval</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Risk Analysis: {riskAnalysisData.title}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Clause {riskAnalysisData.clause}
        </p>
      </div>

      {/* Overall Risk Score */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Overall Risk Score</p>
            <p className="text-3xl font-bold text-gray-900">{riskAnalysisData.overallScore}/10</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Risk Level</p>
            <p className="text-lg font-semibold text-orange-700">Medium-High</p>
          </div>
        </div>
      </div>

      {/* Risk Items */}
      <div className="space-y-4">
        {riskAnalysisData.risks.map((risk, index) => (
          <motion.div
            key={risk.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className={`border rounded-lg p-4 ${getSeverityColor(risk.severity)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {getSeverityIcon(risk.severity)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {risk.severity.toUpperCase()} RISK: {risk.title}
                </h3>

                <div className="space-y-3 text-sm">
                  {risk.current && (
                    <div className="bg-white bg-opacity-50 rounded p-3">
                      <p className="text-gray-600">Current: <span className="font-medium text-gray-900">{risk.current}</span></p>
                      {risk.industryStandard && (
                        <p className="text-gray-600 mt-1">Industry Standard: <span className="font-medium text-gray-900">{risk.industryStandard}</span></p>
                      )}
                    </div>
                  )}

                  {risk.issue && (
                    <div className="bg-white bg-opacity-50 rounded p-3">
                      <p className="text-gray-600">Issue: <span className="font-medium text-gray-900">{risk.issue}</span></p>
                    </div>
                  )}

                  {risk.impact && (
                    <p className="text-gray-700">
                      <span className="font-medium">Risk: </span>{risk.impact}
                    </p>
                  )}

                  {risk.recommendation && (
                    <p className="text-gray-700">
                      <span className="font-medium">Recommendation: </span>{risk.recommendation}
                    </p>
                  )}

                  {risk.note && (
                    <p className="text-gray-700">{risk.note}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={handleViewInDocument}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View in document
                  </button>

                  {risk.suggestedChange && (
                    <button
                      onClick={() => handleApplyChange(risk)}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Apply suggested change: {risk.recommendation}
                    </button>
                  )}

                  {risk.suggestedLanguage && (
                    <button
                      onClick={() => setExpandedLanguage(expandedLanguage === risk.id ? null : risk.id)}
                      className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {expandedLanguage === risk.id ? 'Hide' : 'See'} suggested language
                    </button>
                  )}
                </div>

                {/* Expanded Language */}
                {expandedLanguage === risk.id && risk.suggestedLanguage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 bg-white rounded-lg p-3 border border-gray-200"
                  >
                    <p className="text-xs font-semibold text-gray-700 mb-2">Suggested Additional Language:</p>
                    <p className="text-sm text-gray-900 italic mb-3">"{risk.suggestedLanguage}"</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(risk.suggestedLanguage);
                          onSendMessage({
                            sender: 'ai',
                            content: 'Suggested language copied to clipboard!'
                          });
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy to clipboard
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Change Preview Modal */}
      {showChangeModal && selectedRisk && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowChangeModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Suggested Change Preview</h3>
              <button
                onClick={() => setShowChangeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Current Text:</p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-gray-900 line-through">
                    {selectedRisk.suggestedChange.old}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Suggested Text:</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-gray-900 font-medium">
                    {selectedRisk.suggestedChange.new}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowChangeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmApplyChange}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Apply Change
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default RiskAnalysisReport;

