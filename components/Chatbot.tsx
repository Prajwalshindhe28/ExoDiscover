import React, { useState, useEffect, useRef } from 'react';
import { continueChat } from '../services/geminiService';
import { AiIcon, CloseIcon, SendIcon } from './icons/NavIcons';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

const WELCOME_MESSAGES = [
    "Hello! How can I help you explore the cosmos today? Try asking: 'What is a Super-Earth?'",
    "Greetings, explorer! Ready to uncover secrets of distant worlds? Ask me about the TRAPPIST-1 system.",
    "Exo-AI online. I have access to a vast database of exoplanet information. What are you curious about?",
    "Welcome to the ExoDiscover AI assistant. You can ask me to explain concepts like the 'transit method' or compare two planets.",
];

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
        const storedMessages = sessionStorage.getItem('exoDiscoverChatHistory');
        if (storedMessages) {
            return JSON.parse(storedMessages);
        }
    } catch (error) {
        console.error("Could not parse chat history from sessionStorage", error);
    }
    const randomWelcome = WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
    return [{ text: randomWelcome, sender: 'ai' }];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    try {
        sessionStorage.setItem('exoDiscoverChatHistory', JSON.stringify(messages));
    } catch (error) {
        console.error("Could not save chat history to sessionStorage", error);
    }
  }, [messages]);

  useEffect(scrollToBottom, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { text: inputValue, sender: 'user' };
    const messagesForHistory = [...messages];

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await continueChat(messagesForHistory, userMessage.text);
      const aiMessage: Message = { text: aiResponse, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = { text: "Sorry, I'm having trouble connecting right now.", sender: 'ai' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={toggleChat}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-blue-600/80 backdrop-blur-sm border border-blue-400/50 text-white flex items-center justify-center shadow-lg transition-transform transform hover:scale-110"
        style={{ animation: !isOpen ? 'chat-icon-pulse 3s infinite' : 'none' }}
      >
        {isOpen ? <CloseIcon className="w-8 h-8" /> : <AiIcon className="w-8 h-8" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] max-w-sm h-[70vh] max-h-[600px] z-40 flex flex-col bg-gray-900/70 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl chat-window-open">
          <header className="p-4 border-b border-gray-700/50 text-center">
            <h3 className="font-orbitron text-lg font-bold text-blue-300">Exo-AI Assistant</h3>
          </header>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-700 text-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-xl px-4 py-2 bg-gray-700 text-gray-200 rounded-bl-none">
                  <div className="flex items-center space-x-1">
                      <span className="typing-dot" style={{ animationDelay: '0s' }}></span>
                      <span className="typing-dot" style={{ animationDelay: '0.2s' }}></span>
                      <span className="typing-dot" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700/50 flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about exoplanets..."
              className="flex-1 bg-gray-800 border border-gray-600 rounded-full py-2 px-4 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-500"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;