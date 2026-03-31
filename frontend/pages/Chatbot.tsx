import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { ChatMessage } from "../types";

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Hi! I am your Career Catalyst assistant. Ask me anything about job interviews, resume tips, or career transitions!",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      role: "user",
      text: input,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const apiKey = process.env.API_KEY || "";
      const ai = new GoogleGenAI({ apiKey });

      const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction:
            "You are a helpful, professional, and encouraging career coach. Keep answers concise (under 150 words) unless asked for details. Use markdown for lists.",
        },
      });

      const result = await chat.sendMessage({ message: userMsg.text });

      const botMsg: ChatMessage = {
        role: "model",
        text: result.text || "I couldn't process that request.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Sorry, I'm having trouble connecting to the server right now.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className='max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col pt-6 pb-2'>
      <div className='bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden dark:bg-zinc-900 dark:border-zinc-800'>
        {/* Chat Header */}
        <div className='p-4 border-b border-slate-100 bg-slate-50 flex items-center dark:bg-zinc-800/50 dark:border-zinc-800'>
          <div className='w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 mr-3 dark:bg-brand-900/30 dark:text-brand-400'>
            <Bot size={20} />
          </div>
          <div>
            <h2 className='font-bold text-slate-800 dark:text-zinc-100'>
              Career Assistant
            </h2>
            <p className='text-xs text-green-600 flex items-center dark:text-green-500'>
              <span className='w-2 h-2 bg-green-500 rounded-full mr-1.5'></span>
              Online
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className='flex-1 overflow-y-auto p-4 space-y-6 dark:bg-zinc-900'>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[80%] ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                } items-start gap-3`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${
                    msg.role === "user"
                      ? "bg-slate-200 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
                      : "bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400"
                  }`}
                >
                  {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-brand-600 text-white rounded-tr-none"
                      : "bg-slate-100 text-slate-800 rounded-tl-none dark:bg-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  {msg.text.split("\n").map((line, i) => (
                    <p key={i} className={line.startsWith("-") ? "pl-2" : ""}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className='flex justify-start'>
              <div className='flex flex-row items-center gap-2 bg-slate-50 p-3 rounded-xl ml-11 dark:bg-zinc-800/50'>
                <Loader2
                  size={16}
                  className='animate-spin text-slate-400 dark:text-zinc-500'
                />
                <span className='text-xs text-slate-400 dark:text-zinc-500'>
                  Thinking...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className='p-4 bg-white border-t border-slate-100 dark:bg-zinc-900 dark:border-zinc-800'>
          <div className='flex gap-2 relative'>
            <input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Ask about careers...'
              disabled={isTyping}
              className='w-full p-4 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all disabled:opacity-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-zinc-500'
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className='absolute right-2 top-2 p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors dark:bg-brand-500 dark:hover:bg-brand-600'
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
