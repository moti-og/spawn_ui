import { useState, useRef, useEffect } from 'react';
import { Send, Bot, CheckSquare, AlertTriangle, PenTool, LogIn, LogOut, Grid, History, ArrowUp, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { matchQuery } from '../../data/cannedResponses';
import { getRandomDadJoke } from '../../data/dadJokes';

function ChatInterface({ messages, onSendMessage, onSpawnComponent, actionsOnly = false, messagesOnly = false, inputOnly = false, isCheckedIn = false, isHumanChat = false, humanChatName = null, activeComponent = null, onCheckInOut, onToggleHumanChat }) {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [gifKey, setGifKey] = useState(Date.now()); // Key to force GIF reload
  const [pendingToolAction, setPendingToolAction] = useState(null); // Store pending tool activation
  const messagesEndRef = useRef(null);
  const pendingHumanChatActivation = useRef(false);
  const gifTimerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle human chat activation when name becomes available
  useEffect(() => {
    if (pendingHumanChatActivation.current && isHumanChat && humanChatName) {
      pendingHumanChatActivation.current = false;
      onSpawnComponent(null);
      
      // Step 1: AI message "Getting a human" - explicitly mark as AI, not human
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        onSendMessage({
          sender: 'ai',
          content: 'Getting a human...',
          isHumanChatMessage: false  // Explicitly mark as AI message
        });
        
        // Step 2: Switching line and hello message
        setTimeout(() => {
          onSendMessage({
            sender: 'ai',
            content: `Hi, I'm ${humanChatName}, how can I help?`,
            isHumanChatMessage: true,
            isModeTransition: true,
            humanChatName: humanChatName
          });
        }, 800);
      }, 800);
    }
  }, [isHumanChat, humanChatName, onSendMessage, onSpawnComponent]);

  // Handle GIF activation timer - activates randomly every 10-30 seconds
  useEffect(() => {
    if (actionsOnly && isHumanChat) {
      const scheduleNextActivation = () => {
        // Random delay between 10-30 seconds
        const delay = Math.floor(Math.random() * 20000) + 10000;
        gifTimerRef.current = setTimeout(() => {
          // Reload the GIF by changing its key
          setGifKey(Date.now());
          // Schedule next activation
          scheduleNextActivation();
        }, delay);
      };

      // Start the first activation immediately, then schedule subsequent ones
      setGifKey(Date.now());
      scheduleNextActivation();

      return () => {
        if (gifTimerRef.current) {
          clearTimeout(gifTimerRef.current);
        }
      };
    } else {
      // Clear timer when human chat is disabled
      if (gifTimerRef.current) {
        clearTimeout(gifTimerRef.current);
        gifTimerRef.current = null;
      }
    }
  }, [actionsOnly, isHumanChat]);

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
      case 'humanchat':
        // Toggle human chat state
        if (onToggleHumanChat) {
          const newHumanChatState = !isHumanChat;
          onToggleHumanChat(newHumanChatState);
          
          if (newHumanChatState) {
            // Mark that we're waiting for human chat activation
            pendingHumanChatActivation.current = true;
            // The useEffect will handle sending messages when name is available
          } else {
            // Returning to AI chat mode
            onSpawnComponent(null);
            pendingHumanChatActivation.current = false;
            // Step 1: Switching line - explicitly mark as NOT human chat
            setTimeout(() => {
              onSendMessage({
                sender: 'ai',
                content: "I'm back and ready to help",
                isModeTransition: true,
                isHumanChatMessage: false  // Explicitly mark as AI message
              });
            }, 300);
          }
        }
        return;
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
      
      // Check if this is a default response in human chat mode - use different message
      if (isHumanChat && match.type === 'default') {
        // Human chat default response
        onSendMessage({
          sender: 'ai',
          content: "I'm not actually a human but how about a better joke than AI can provide?"
        });
        
        // Send joke in second message
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            onSendMessage({
              sender: 'ai',
              content: getRandomDadJoke()
            });
          }, 800);
        }, 500);
      } else {
        // Regular AI response
        onSendMessage({
          sender: 'ai',
          content: match.response,
          showButtonPreview: match.showButtonPreview || false
        });

        // If it's a default response, send a joke in a second message
        if (match.includeJoke) {
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              onSendMessage({
                sender: 'ai',
                content: `But in the meantime...let's have some fun!\n\n${getRandomDadJoke()}`
              });
            }, 800);
          }, 500);
        }

        // Intelligent routing: Show confirmation before activating tools
        if (match.spawnComponent) {
          // Store pending action and show confirmation
          const toolNames = {
            'ApprovalWorkflow': 'show the approval status',
            'RiskAnalysisReport': 'analyze risks in the document',
            'SignatureWizard': 'add signature blocks',
            'VersionHistory': 'show version history'
          };
          const toolName = toolNames[match.spawnComponent] || 'perform this action';
          
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              setPendingToolAction({
                component: match.spawnComponent,
                response: match.response
              });
              onSendMessage({
                sender: 'ai',
                content: `I can help you ${toolName}. Would you like me to proceed?`,
                requiresConfirmation: true,
                pendingAction: match.spawnComponent
              });
            }, 800);
          }, 500);
        } else if (match.highlightSection) {
          // Just highlight a section without spawning a component
          setTimeout(() => {
            onSpawnComponent('Highlight', { sectionId: match.highlightSection });
          }, 300);
        }
      }
    }, 1000 + Math.random() * 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConfirmTool = (messageId) => {
    // Find the message with the pending action
    const message = messages.find(m => m.id === messageId && m.requiresConfirmation);
    if (message && message.pendingAction && pendingToolAction) {
      // Clear pending action
      setPendingToolAction(null);
      
      // Send confirmation message
      onSendMessage({
        sender: 'user',
        content: 'Yes, proceed'
      });
      
      // Activate the tool
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          onSendMessage({
            sender: 'ai',
            content: pendingToolAction.response || 'Activating...'
          });
          onSpawnComponent(pendingToolAction.component);
        }, 800);
      }, 300);
    }
  };

  const handleCancelTool = (messageId) => {
    // Find the message with the pending action
    const message = messages.find(m => m.id === messageId && m.requiresConfirmation);
    if (message) {
      // Clear pending action
      setPendingToolAction(null);
      
      // Send cancellation message
      onSendMessage({
        sender: 'user',
        content: 'No, cancel'
      });
      
      // Provide alternative assistance
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          onSendMessage({
            sender: 'ai',
            content: 'No problem! How else can I help you? You can also use the "Show All Actions" button to see all available options.'
          });
        }, 800);
      }, 300);
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

        {/* Suggested Actions with Video - Flex container (hide when AllActions is active) */}
        {activeComponent?.type !== 'AllActions' && (
        <div className="flex">
          {/* Left side - Suggested Actions */}
          <div className="flex-1">
            <div className="px-4 py-3">
              <div className="space-y-2">
                <p className="text-xs text-gray-500 px-2 text-center">Suggested actions:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => handleQuickAction('approval')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-full text-xs font-medium text-indigo-700 transition-colors"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Approvals</span>
                </button>
                <button
                  onClick={() => handleQuickAction('versionhistory')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-full text-xs font-medium text-teal-700 transition-colors"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Versions</span>
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
                <button
                  onClick={() => handleQuickAction('humanchat')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-medium transition-colors ${
                    isHumanChat
                      ? 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
                      : 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{isHumanChat ? 'Chat with AI' : (humanChatName ? `Chat with ${humanChatName}` : 'Chat with Human')}</span>
                </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - GIF (only when human chat is active) */}
          {isHumanChat && (
            <div className="flex-shrink-0 border-l border-gray-200 px-2 py-2 flex items-center justify-center">
              <img
                key={gifKey}
                src={`/gandalf.gif?t=${gifKey}`}
                alt="Human agent"
                className="max-w-[60px] max-h-[60px] rounded-lg object-contain"
              />
            </div>
          )}
        </div>
        )}
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
          {messages.map((message, index) => {
            // Always show name above human chat messages
            const showName = message.isHumanChatMessage && message.humanChatName;
            
            // Check if this is a mode transition (switching between human and AI) - only show when explicitly toggling modes
            const isModeTransition = message.isModeTransition;
            
            return (
            <div key={message.id}>
              {/* Mode transition divider */}
              {isModeTransition && (
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <div className="px-3 py-1 bg-gray-100 rounded-full">
                    <span className="text-xs text-gray-600 font-medium">
                      {message.isHumanChatMessage ? (message.humanChatName ? `Switching to Chat with ${message.humanChatName}` : 'Switching to Chat with Human') : 'Switching to Chat with AI'}
                    </span>
                  </div>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-[85%]">
                  {showName && message.humanChatName && (
                    <p className="text-xs text-blue-600 font-semibold mb-1 px-1">
                      {message.humanChatName}
                    </p>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2.5 ${
                      message.isHumanChatMessage
                        ? 'bg-blue-50 text-blue-900 border-2 border-blue-300 font-medium'
                        : message.sender === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className={`text-sm whitespace-pre-wrap ${message.isHumanChatMessage ? 'font-semibold' : ''}`}>{message.content}</p>
                    {message.requiresConfirmation && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleConfirmTool(message.id)}
                          className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-xs transition-colors"
                        >
                          Yes, proceed
                        </button>
                        <button
                          onClick={() => handleCancelTool(message.id)}
                          className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium text-xs transition-colors"
                        >
                          No, cancel
                        </button>
                      </div>
                    )}
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
                </div>
              </motion.div>
            </div>
          );
          })}
          
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

