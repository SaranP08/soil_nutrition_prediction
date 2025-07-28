import React, { useState, useRef, useEffect } from "react";
import { continueChat } from "../services/geminiService.js";
import { UserIcon, SparklesIcon, PaperAirplaneIcon } from "./Icons.jsx";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I'm your AI agronomist. How can I help you with your soil questions today ?????",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { chatSession, responseText } = await continueChat(
        chatSessionRef.current,
        input
      );
      chatSessionRef.current = chatSession;
      const aiMessage = { sender: "ai", text: responseText };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat failed", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, I couldn't get a response. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[65vh]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "justify-end" : ""
            }`}
          >
            {msg.sender === "ai" && (
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-blue-600 flex items-center justify-center text-white">
                <SparklesIcon className="h-5 w-5" />
              </div>
            )}
            <div
              className={`max-w-md p-3 rounded-xl ${
                msg.sender === "user"
                  ? "bg-brand-blue-600 text-white"
                  : "bg-white text-gray-800 shadow-sm"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
            {msg.sender === "user" && (
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                <UserIcon className="h-5 w-5" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-blue-600 flex items-center justify-center text-white">
              <SparklesIcon className="h-5 w-5 animate-pulse" />
            </div>
            <div className="max-w-md p-3 rounded-xl bg-white text-gray-800 shadow-sm">
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 bg-brand-blue-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-brand-blue-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-brand-blue-300 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="pt-4 mt-4 border-t border-brand-blue-200/50">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about soil health..."
            disabled={isLoading}
            className="flex-1 w-full px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-blue-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-brand-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 hover:bg-brand-blue-700 disabled:bg-brand-blue-300 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
