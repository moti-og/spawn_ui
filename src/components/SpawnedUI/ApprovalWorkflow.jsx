import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Circle, Send, X } from 'lucide-react';

function ApprovalWorkflow({ workflow, onUpdateWorkflow, onSendMessage }) {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [requestData, setRequestData] = useState({
    to: 'Jennifer Kim',
    role: 'Executive',
    message: ''
  });

  const handleApprove = (stepId) => {
    const updatedWorkflow = {
      ...workflow,
      steps: workflow.steps.map(step => {
        if (step.id === stepId) {
          return {
            ...step,
            status: 'approved',
            approvedAt: new Date().toISOString()
          };
        }
        // Enable next step if it was waiting
        if (step.status === 'waiting' && step.id === 'step_4') {
          return { ...step, status: 'pending' };
        }
        return step;
      })
    };
    onUpdateWorkflow(updatedWorkflow);
    
    // Send AI confirmation message
    setTimeout(() => {
      onSendMessage({
        sender: 'ai',
        content: "Great! You've approved this document. The document now has all internal approvals and is ready to send to the client for signature."
      });
    }, 500);
  };

  const handleSendRequest = () => {
    onSendMessage({
      sender: 'ai',
      content: `Approval request sent to ${requestData.to}. They'll receive an email notification and can approve directly from their inbox.`
    });
    setShowRequestModal(false);
    setRequestData({ to: 'Jennifer Kim', role: 'Executive', message: '' });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'waiting':
        return <Circle className="w-5 h-5 text-gray-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getProgressPercentage = () => {
    const approvedCount = workflow.steps.filter(s => s.status === 'approved').length;
    return (approvedCount / workflow.steps.length) * 100;
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
              <li>• Check the box to approve on behalf of yourself</li>
              <li>• Use "Send Approval Request" to delegate to another person</li>
              <li>• Progress updates in real-time as approvals are completed</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Contract Approval Status</h2>
        <p className="text-sm text-gray-600 mt-1">
          Track approval progress and manage workflow
        </p>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Overall Progress</span>
          <span className="font-semibold text-gray-900">
            {workflow.steps.filter(s => s.status === 'approved').length} of {workflow.steps.length} approved
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-green-500 to-green-600"
          />
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="space-y-4">
        {workflow.steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`border rounded-lg p-4 ${
              step.status === 'approved' ? 'bg-green-50 border-green-200' :
              step.status === 'pending' ? 'bg-orange-50 border-orange-200' :
              'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {getStatusIcon(step.status)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{step.role}</h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  {step.assignee.name} {step.assignee.title && `(${step.assignee.title})`}
                </p>
                {step.approvedAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Approved: {new Date(step.approvedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}

                {/* Approval Actions */}
                {step.status === 'pending' && step.assignee.name === 'You' && (
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleApprove(step.id);
                          }
                        }}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Approve as {step.assignee.title}
                      </span>
                    </label>
                    <div className="text-sm text-gray-500">OR</div>
                    <button
                      onClick={() => setShowRequestModal(true)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Send Approval Request
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Approval Request Modal */}
      {showRequestModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowRequestModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Send Approval Request</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To:
                </label>
                <select
                  value={requestData.to}
                  onChange={(e) => setRequestData({ ...requestData, to: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Jennifer Kim</option>
                  <option>David Park</option>
                  <option>Lisa Anderson</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role:
                </label>
                <select
                  value={requestData.role}
                  onChange={(e) => setRequestData({ ...requestData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Executive</option>
                  <option>Legal</option>
                  <option>Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (optional):
                </label>
                <textarea
                  value={requestData.message}
                  onChange={(e) => setRequestData({ ...requestData, message: e.target.value })}
                  rows={3}
                  placeholder="Add a note for the approver..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendRequest}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Send Request
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default ApprovalWorkflow;

