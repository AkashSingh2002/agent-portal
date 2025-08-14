import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat/message', {
        message: inputMessage
      });

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: error.response?.data?.error || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content) => {
    // Convert markdown-style formatting to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      padding: '24px',
      height: '600px',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e5e7eb',
      marginBottom: '16px'
    },
    headerIcon: {
      width: '40px',
      height: '40px',
      backgroundColor: '#dbeafe',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      color: '#1e40af'
    },
    headerText: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    headerSubtext: {
      fontSize: '14px',
      color: '#6b7280'
    },
    messagesArea: {
      flex: 1,
      overflowY: 'auto',
      marginBottom: '16px',
      padding: '16px',
      backgroundColor: '#f9fafb',
      borderRadius: '4px'
    },
    message: {
      marginBottom: '16px',
      display: 'flex',
      justifyContent: 'flex-start'
    },
    userMessage: {
      justifyContent: 'flex-end'
    },
    messageBubble: {
      maxWidth: '70%',
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '14px'
    },
    userBubble: {
      backgroundColor: '#1e40af',
      color: 'white'
    },
    assistantBubble: {
      backgroundColor: 'white',
      color: '#1f2937',
      border: '1px solid #e5e7eb'
    },
    messageTime: {
      fontSize: '12px',
      marginTop: '4px',
      opacity: 0.7
    },
    welcomeMessage: {
      textAlign: 'center',
      padding: '32px 16px'
    },
    welcomeIcon: {
      fontSize: '48px',
      marginBottom: '16px'
    },
    welcomeTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#1f2937'
    },
    welcomeText: {
      color: '#6b7280',
      marginBottom: '16px'
    },
    examplesBox: {
      backgroundColor: 'white',
      padding: '16px',
      borderRadius: '4px',
      border: '1px solid #e5e7eb',
      maxWidth: '400px',
      margin: '0 auto',
      textAlign: 'left'
    },
    examplesTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#1f2937'
    },
    examplesList: {
      fontSize: '12px',
      color: '#6b7280',
      lineHeight: '1.5'
    },
    inputArea: {
      borderTop: '1px solid #e5e7eb',
      paddingTop: '16px'
    },
    inputContainer: {
      display: 'flex',
      gap: '12px'
    },
    input: {
      flex: 1,
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '14px',
      resize: 'none'
    },
    sendButton: {
      padding: '12px 16px',
      backgroundColor: '#1e40af',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    sendButtonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    },
    inputHint: {
      fontSize: '12px',
      color: '#6b7280',
      marginTop: '8px',
      textAlign: 'center'
    },
    loadingMessage: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#6b7280',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Chat Header */}
      <div style={styles.header}>
        <div style={styles.headerIcon}>🤖</div>
        <div>
          <div style={styles.headerText}>AI Assistant</div>
          <div style={styles.headerSubtext}>Ask me about payroll and customer orders</div>
        </div>
      </div>

      {/* Messages Area */}
      <div style={styles.messagesArea}>
        {messages.length === 0 ? (
          <div style={styles.welcomeMessage}>
            <div style={styles.welcomeIcon}>🤖</div>
            <div style={styles.welcomeTitle}>Welcome to Brand Metrics!</div>
            <div style={styles.welcomeText}>
              I can help you with payroll information and customer order details.
            </div>
            <div style={styles.examplesBox}>
              <div style={styles.examplesTitle}>Try asking:</div>
              <div style={styles.examplesList}>
                • "What's my payroll for this week?"<br />
                • "Show orders for John Smith"<br />
                • "Payroll this month"<br />
                • "Orders for customer Sarah Johnson"
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                ...styles.message,
                ...(message.type === 'user' ? styles.userMessage : {})
              }}
            >
              <div
                style={{
                  ...styles.messageBubble,
                  ...(message.type === 'user' ? styles.userBubble : styles.assistantBubble)
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatMessage(message.content)
                  }}
                />
                <div style={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div style={styles.message}>
            <div style={styles.assistantBubble}>
              <div style={styles.loadingMessage}>
                <span>⏳</span>
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={styles.inputArea}>
        <div style={styles.inputContainer}>
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about payroll, orders, or anything else..."
            style={styles.input}
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            style={{
              ...styles.sendButton,
              ...(isLoading ? styles.sendButtonDisabled : {})
            }}
          >
            Send
          </button>
        </div>
        <div style={styles.inputHint}>
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
