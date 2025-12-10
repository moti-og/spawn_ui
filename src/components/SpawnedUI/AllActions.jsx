import { CheckSquare, AlertTriangle, PenTool, LogIn, LogOut, History } from 'lucide-react';
import { motion } from 'framer-motion';

function AllActions({ onSpawnComponent, onSendMessage, isCheckedIn, onCheckInOut }) {
  const handleAction = (actionType) => {
    let userMessage = '';
    
    switch(actionType) {
      case 'approval':
        userMessage = 'Who has approved so far?';
        onSendMessage({ sender: 'user', content: userMessage });
        setTimeout(() => {
          onSpawnComponent('ApprovalWorkflow');
        }, 500);
        break;
      case 'risk':
        userMessage = 'What is high risk in the indemnification clause?';
        onSendMessage({ sender: 'user', content: userMessage });
        setTimeout(() => {
          onSpawnComponent('RiskAnalysisReport');
        }, 500);
        break;
      case 'signature':
        userMessage = "I'm ready to sign";
        onSendMessage({ sender: 'user', content: userMessage });
        setTimeout(() => {
          onSpawnComponent('SignatureWizard');
        }, 500);
        break;
      case 'versionhistory':
        userMessage = 'Show version history';
        onSendMessage({ sender: 'user', content: userMessage });
        setTimeout(() => {
          onSpawnComponent('VersionHistory');
        }, 500);
        break;
      case 'checkin':
        // Toggle check in/out state
        if (onCheckInOut) {
          const newCheckedInState = !isCheckedIn;
          onCheckInOut(newCheckedInState);
          userMessage = newCheckedInState ? 'check out' : 'check in';
          onSendMessage({ sender: 'user', content: userMessage });
          
          // Show confirmation message
          setTimeout(() => {
            onSendMessage({
              sender: 'ai',
              content: newCheckedInState 
                ? '✅ Document checked out! You now have exclusive edit access. Others will see that you have the document checked out.'
                : '✅ Document checked in! The document is now available for others to edit.'
            });
          }, 500);
        }
        break;
    }
  };

  const actions = [
    {
      id: 'approval',
      icon: CheckSquare,
      title: 'Approval Status',
      description: 'Who has approved so far?',
      bgColor: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-700',
      iconColor: 'text-indigo-600'
    },
    {
      id: 'risk',
      icon: AlertTriangle,
      title: 'Risk Analysis',
      description: "What's high risk?",
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      iconColor: 'text-orange-600'
    },
    {
      id: 'signature',
      icon: PenTool,
      title: 'Sign Document',
      description: 'Ready to sign',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      iconColor: 'text-green-600'
    },
    {
      id: 'versionhistory',
      icon: History,
      title: 'Version History',
      description: 'View previous versions',
      bgColor: 'bg-teal-50',
      hoverColor: 'hover:bg-teal-100',
      borderColor: 'border-teal-200',
      textColor: 'text-teal-700',
      iconColor: 'text-teal-600'
    },
    {
      id: 'checkin',
      icon: isCheckedIn ? LogIn : LogOut,
      title: isCheckedIn ? 'Check In Document' : 'Check Out Document',
      description: isCheckedIn ? 'Release document lock' : 'Lock document for editing',
      bgColor: isCheckedIn ? 'bg-red-50' : 'bg-blue-50',
      hoverColor: isCheckedIn ? 'hover:bg-red-100' : 'hover:bg-blue-100',
      borderColor: isCheckedIn ? 'border-red-200' : 'border-blue-200',
      textColor: isCheckedIn ? 'text-red-700' : 'text-blue-700',
      iconColor: isCheckedIn ? 'text-red-600' : 'text-blue-600'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Available Actions</h2>
        <p className="text-sm text-gray-600">Select an action to perform on this document</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleAction(action.id)}
              className={`${action.bgColor} ${action.hoverColor} border-2 ${action.borderColor} rounded-xl p-6 text-left transition-all hover:shadow-md hover:scale-105`}
            >
              <div className="flex flex-col items-start gap-3">
                <div className={`p-3 rounded-lg bg-white border ${action.borderColor}`}>
                  <Icon className={`w-6 h-6 ${action.iconColor}`} />
                </div>
                <div>
                  <h3 className={`font-semibold text-base ${action.textColor} mb-1`}>
                    {action.title}
                  </h3>
                  <p className={`text-xs ${action.textColor} opacity-80`}>
                    {action.description}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default AllActions;

