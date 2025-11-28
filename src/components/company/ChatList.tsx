"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface Chat {
  id: string
  title: string | null
  summary: string | null
  createdAt: Date | string
  updatedAt: Date | string
  user: {
    name: string | null
    email: string
  }
  _count: {
    messages: number
  }
  firstMessage?: string | null
}

interface ChatListProps {
  chats: Chat[]
  selectedChatId?: string
  onChatSelect: (chatId: string) => void
}

export default function ChatList({ chats, selectedChatId, onChatSelect }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState<"all" | "24h" | "7d">("all")

  // Filter chats by search query
  const filteredBySearch = chats.filter((chat) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      chat.user.name?.toLowerCase().includes(query) ||
      chat.user.email.toLowerCase().includes(query) ||
      chat.title?.toLowerCase().includes(query) ||
      chat.summary?.toLowerCase().includes(query) ||
      chat.firstMessage?.toLowerCase().includes(query)
    )
  })

  // Filter by time
  const filteredChats = filteredBySearch.filter((chat) => {
    if (timeFilter === "all") return true
    const now = new Date()
    const chatDate = typeof chat.updatedAt === "string" ? new Date(chat.updatedAt) : chat.updatedAt
    const diffHours = (now.getTime() - chatDate.getTime()) / (1000 * 60 * 60)
    
    if (timeFilter === "24h") return diffHours <= 24
    if (timeFilter === "7d") return diffHours <= 168 // 7 days
    return true
  })

  const getChatTitle = (chat: Chat) => {
    if (chat.title) return chat.title
    return `Chat with ${chat.user.name || chat.user.email.split("@")[0]}`
  }

  const getChatPreview = (chat: Chat) => {
    if (chat.summary) return chat.summary
    if (chat.firstMessage) {
      return chat.firstMessage.length > 80
        ? chat.firstMessage.substring(0, 80) + "..."
        : chat.firstMessage
    }
    return "No preview available"
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeFilter("all")}
            className={cn(
              "px-3 py-1 text-xs rounded-md transition-colors",
              timeFilter === "all"
                ? "bg-blue-100 text-blue-700 font-medium"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            All
          </button>
          <button
            onClick={() => setTimeFilter("24h")}
            className={cn(
              "px-3 py-1 text-xs rounded-md transition-colors",
              timeFilter === "24h"
                ? "bg-blue-100 text-blue-700 font-medium"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            Last 24h
          </button>
          <button
            onClick={() => setTimeFilter("7d")}
            className={cn(
              "px-3 py-1 text-xs rounded-md transition-colors",
              timeFilter === "7d"
                ? "bg-blue-100 text-blue-700 font-medium"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            Last 7d
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">
              {searchQuery || timeFilter !== "all"
                ? "No chats match your filters"
                : "No chats yet"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={cn(
                  "w-full text-left p-4 hover:bg-gray-50 transition-colors",
                  selectedChatId === chat.id && "bg-blue-50 border-l-4 border-blue-600"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {getChatTitle(chat)}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {getChatPreview(chat)}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>{chat.user.name || chat.user.email.split("@")[0]}</span>
                      <span>•</span>
                      <span>{chat._count.messages} messages</span>
                      <span>•</span>
                      <span>
                        {new Date(typeof chat.updatedAt === "string" ? chat.updatedAt : chat.updatedAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

