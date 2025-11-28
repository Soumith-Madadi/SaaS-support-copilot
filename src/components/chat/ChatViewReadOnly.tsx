"use client"

import { useRef, useEffect } from "react"
import { Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: Date | string
}

interface ChatViewReadOnlyProps {
  messages: Array<{
    id: string
    role: "user" | "assistant"
    content: string
    createdAt: Date | string
  }>
  userName?: string
  userEmail?: string
  createdAt?: Date | string
  updatedAt?: Date | string
  totalMessages?: number
}

export default function ChatViewReadOnly({
  messages,
  userName,
  userEmail,
  createdAt,
  updatedAt,
  totalMessages,
}: ChatViewReadOnlyProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {userName || "Customer"}
            </h2>
            {userEmail && (
              <p className="text-sm text-gray-500 mt-1">{userEmail}</p>
            )}
          </div>
          <div className="text-right">
            {totalMessages !== undefined && (
              <p className="text-sm text-gray-500">
                {totalMessages} {totalMessages === 1 ? "message" : "messages"}
              </p>
            )}
            {createdAt && (
              <p className="text-xs text-gray-400 mt-1">
                Started {new Date(typeof createdAt === "string" ? createdAt : createdAt).toLocaleString()}
              </p>
            )}
            {updatedAt && (
              <p className="text-xs text-gray-400">
                Last updated {new Date(typeof updatedAt === "string" ? updatedAt : updatedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500">No messages in this conversation</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const isUser = message.role === "user"
            const showAvatar = !isUser

            return (
              <div
                key={message.id}
                className={cn(
                  "flex items-end gap-3",
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
                    "relative max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-sm",
                    isUser
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
                  )}
                >
                  {isUser ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  ) : (
                    <div className="prose prose-sm max-w-none text-sm leading-relaxed break-words text-gray-900">
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
                  <p className={cn("text-xs mt-1", isUser ? "opacity-70" : "text-gray-500")}>
                    {new Date(typeof message.createdAt === "string" ? message.createdAt : message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Read-only indicator */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
        <p className="text-xs text-center text-gray-500">
          Read-only view • Company dashboard
        </p>
      </div>
    </div>
  )
}

