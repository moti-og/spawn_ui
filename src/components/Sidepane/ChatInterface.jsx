import { useState, useRef, useEffect } from 'react';
import { Send, Bot, CheckSquare, AlertTriangle, PenTool, LogIn, LogOut, Grid, History, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { matchQuery } from '../../data/cannedResponses';

function ChatInterface({ messages, onSendMessage, onSpawnComponent, actionsOnly = false, messagesOnly = false, inputOnly = false, isCheckedIn = false, onCheckInOut }) {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleQuickAction = (actionType) => {
    let userMessage = '';
    
    switch(actionType) {
      case 'approval':
        userMessage = 'Who has approved so far?';
        break;
      case 'risk':
        userMessage = 'What is high risk in the indemnification clause?';
        break;
      case 'signature':
        userMessage = "I'm ready to sign";
        break;
      case 'checkin':
        userMessage = isCheckedIn ? 'check in' : 'check out';
        break;
      case 'versionhistory':
        userMessage = 'Show version history';
        break;
      case 'showallactions':
        // Directly spawn the component without sending a message
        onSpawnComponent('AllActions');
        return;
    }

    handleSendMessage(userMessage);
  };

  const handleSendMessage = (messageText = inputValue) => {
    if (!messageText.trim()) return;

    const lowerMessage = messageText.toLowerCase().trim();
    
    // Check if user wants to show all actions
    if (lowerMessage === 'show all actions' || lowerMessage === 'show actions' || lowerMessage === 'all actions') {
      onSendMessage({
        sender: 'user',
        content: messageText
      });
      setInputValue('');
      onSpawnComponent('AllActions');
      return;
    }
    
    // Check if user wants to check out (lock the document)
    if (lowerMessage === 'check out' || lowerMessage === 'check-out' || lowerMessage === 'checkout') {
      if (onCheckInOut) {
        onCheckInOut(true);
        onSendMessage({
          sender: 'user',
          content: messageText
        });
        setInputValue('');
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          onSendMessage({
            sender: 'ai',
            content: '✅ Document checked out! You now have exclusive edit access. Others will see that you have the document checked out.'
          });
        }, 800);
        return;
      }
    } 
    // Check if user wants to check in (release the document)
    else if (lowerMessage === 'check in' || lowerMessage === 'check-in' || lowerMessage === 'checkin') {
      if (onCheckInOut) {
        onCheckInOut(false);
        onSendMessage({
          sender: 'user',
          content: messageText
        });
        setInputValue('');
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          onSendMessage({
            sender: 'ai',
            content: '✅ Document checked in! The document is now available for others to edit.'
          });
        }, 800);
        return;
      }
    }

    // Close any dynamic UI to show chat FIRST
    onSpawnComponent(null);
    
    // Add user message
    onSendMessage({
      sender: 'user',
      content: messageText
    });

    setInputValue('');
    setIsTyping(true);

    // Match query and respond
    const match = matchQuery(messageText);

    setTimeout(() => {
      setIsTyping(false);
      
      // Add AI response
      onSendMessage({
        sender: 'ai',
        content: match.response
      });

      // Spawn component if needed
      if (match.spawnComponent) {
        setTimeout(() => {
          onSpawnComponent(match.spawnComponent);
        }, 300);
      } else if (match.highlightSection) {
        // Just highlight a section without spawning a component
        onSpawnComponent('Highlight', { sectionId: match.highlightSection });
      }
    }, 1000 + Math.random() * 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // If only showing action buttons
  if (actionsOnly) {
    return (
      <div className="flex-shrink-0 border-b border-gray-200 bg-gray-50">
        {/* Show All Actions - Full Width */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => handleQuickAction('showallactions')}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Grid className="w-5 h-5" />
              <span>Show All Actions</span>
            </button>
          </div>

          {/* Suggested Actions - Smaller buttons below */}
          <div className="px-4 py-3">
            <div className="space-y-2">
              <p className="text-xs text-gray-500 px-2">Suggested actions:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleQuickAction('approval')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-full text-xs font-medium text-indigo-700 transition-colors"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Who has approved so far?</span>
                </button>
                <button
                  onClick={() => handleQuickAction('risk')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-full text-xs font-medium text-orange-700 transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>What's high risk?</span>
                </button>
                <button
                  onClick={() => handleQuickAction('signature')}
                  className="inline-flex items-center gap-1.5 bg-green-50 hover:bg-green-100 border border-green-200 rounded-full text-xs font-medium text-green-700 transition-colors px-3 py-1.5"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Ready to sign</span>
                </button>
                <button
                  onClick={() => handleQuickAction('versionhistory')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-full text-xs font-medium text-teal-700 transition-colors"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Version History</span>
                </button>
                <button
                  onClick={() => handleQuickAction('checkin')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-medium transition-colors ${
                    isCheckedIn
                      ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
                      : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
                  }`}
                >
                  {isCheckedIn ? (
                    <>
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Check In</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Check Out</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
      </div>
    );
  }

  // If only showing text input
  if (inputOnly) {
    return (
      <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim()}
            className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // If showing messages only
  return (
    <div className="h-full overflow-y-auto scrollbar-thin px-4 py-4 space-y-4 bg-white">
      {/* Chat Messages */}
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p className="text-sm">No messages yet. Start a conversation!</p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-2.5 ${
                  message.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.showButtonPreview && (
                  <div className="mt-3 flex flex-col items-center gap-2">
                    <div className="opacity-50 scale-75 origin-center">
                      <button
                        className="w-full py-2 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold text-xs shadow-md flex items-center justify-center gap-2 pointer-events-none"
                      >
                        <Grid className="w-4 h-4" />
                        <span>Show All Actions</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span>Don't click here, go up to the top</span>
                      <ArrowUp className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}

export default ChatInterface;

