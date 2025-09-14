import { useState, useRef } from 'react'
import './App.css'

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m Zeeky, your AI assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I understand you said: "${userMessage.text}". This is a demo response. In the full implementation, I'll process your request using advanced AI capabilities.`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileMessage: Message = {
        id: Date.now().toString(),
        text: `Uploaded file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fileMessage]);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`app ${theme}`}>
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="ai-face">
            <div className="face-circle">
              <div className="eye left-eye"></div>
              <div className="eye right-eye"></div>
              <div className="mouth"></div>
            </div>
          </div>
          <h1>Zeeky AI Assistant</h1>
        </div>
        <div className="header-right">
          <button
            className="settings-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Dashboard Widgets */}
        <div className="widgets">
          <div className="widget">
            <h3>Voice Commands</h3>
            <p>Active</p>
            <div className="status-indicator active"></div>
          </div>
          <div className="widget">
            <h3>Integrations</h3>
            <p>5 Connected</p>
            <div className="status-indicator active"></div>
          </div>
          <div className="widget">
            <h3>Features</h3>
            <p>1,247 Active</p>
            <div className="status-indicator active"></div>
          </div>
          <div className="widget">
            <h3>Security</h3>
            <p>Zero Trust</p>
            <div className="status-indicator active"></div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-container">
          <div className="messages">
            {messages.map(message => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="timestamp">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message ai typing">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="input-area">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
            />
            <button
              className="upload-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Upload file"
            >
              📎
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask Zeeky anything... (or say 'Aye Zeeky' to activate voice)"
              className="text-input"
            />
            <button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="settings-panel">
          <h3>Settings</h3>
          <div className="setting-item">
            <label>Theme:</label>
            <button onClick={toggleTheme}>
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
          <div className="setting-item">
            <label>Voice Activation:</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting-item">
            <label>Auto-save Conversations:</label>
            <input type="checkbox" defaultChecked />
          </div>
          <button
            className="close-settings"
            onClick={() => setShowSettings(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}

export default App
