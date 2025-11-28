"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: Date
}

interface ChatInterfaceProps {
  initialChatId?: string
  initialMessages?: Array<{
    id: string
    role: "user" | "assistant"
    content: string
    createdAt: Date
  }>
  readOnly?: boolean
  companySlug?: string
}

export default function ChatInterface({ initialChatId, initialMessages, readOnly = false, companySlug }: ChatInterfaceProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>(
    initialMessages?.map((msg) => ({
      ...msg,
      createdAt: new Date(msg.createdAt),
    })) || []
  )
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [chatId, setChatId] = useState<string | null>(initialChatId || null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const messageToSend = input
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          message: messageToSend,
          companySlug,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      if (data.chatId && !chatId) {
        setChatId(data.chatId)
      }

      const assistantMessage: Message = {
        id: data.messageId,
        role: "assistant",
        content: data.response,
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Start a conversation
              </h3>
              <p className="text-gray-500 text-sm">
                Ask me anything about your company's products and services. I'm here to help!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isUser = message.role === "user"
              const showAvatar = !isUser
              const isLastMessage = index === messages.length - 1

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-end gap-2 group",
                    isUser ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Avatar */}
                  {showAvatar && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {!showAvatar && <div className="w-8" />}

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      "relative max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-sm transition-all duration-200",
                      isUser
                        ? "bg-white border border-gray-200 rounded-br-md"
                        : "bg-white border border-gray-200 rounded-bl-md"
                    )}
                    style={isLastMessage ? { animation: "fadeIn 0.3s ease-out" } : undefined}
                  >
                    {isUser ? (
                      <p 
                        className="text-sm leading-relaxed whitespace-pre-wrap break-words"
                        style={{ color: '#000000' }}
                      >
                        {message.content}
                      </p>
                    ) : (
                      <div className="prose prose-sm max-w-none text-sm leading-relaxed break-words" style={{ color: '#000000' }}>
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="ml-2">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            em: ({ children }) => <em className="italic">{children}</em>,
                            code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                            pre: ({ children }) => <pre className="bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto mb-2">{children}</pre>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                    {/* Message tail */}
                    {isUser ? (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-white border-r border-b border-gray-200 transform rotate-45 translate-x-1 translate-y-1" />
                    ) : (
                      <div className="absolute bottom-0 left-0 w-3 h-3 bg-white border-l border-b border-gray-200 transform rotate-45 -translate-x-1 translate-y-1" />
                    )}
                  </div>
                </div>
              )
            })}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex items-end gap-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Only show if not read-only */}
      {!readOnly && (
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={loading}
                className="w-full pr-12 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors text-black placeholder:text-black"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                Press Enter to send
              </div>
            </div>
            <Button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="h-11 w-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            AI-powered support • Powered by Gemini
          </p>
        </div>
      )}
      {readOnly && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-xs text-center text-gray-500">
            Read-only view • Company dashboard
          </p>
        </div>
      )}
    </div>
  )
}
