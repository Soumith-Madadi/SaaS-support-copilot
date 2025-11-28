"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import ChatList from "@/components/company/ChatList"
import ChatViewReadOnly from "@/components/chat/ChatViewReadOnly"
import { Card, CardContent } from "@/components/ui/card"

interface Chat {
  id: string
  title: string | null
  summary: string | null
  createdAt: Date
  updatedAt: Date
  user: {
    name: string | null
    email: string
  }
  messages: Array<{
    id: string
    role: "user" | "assistant"
    content: string
    createdAt: Date
  }>
  _count: {
    messages: number
  }
}

interface CompanyChatsClientProps {
  initialChats: Chat[]
}

async function getChatDetails(chatId: string): Promise<Chat | null> {
  const response = await fetch(`/api/company/chats/${chatId}`)
  if (!response.ok) {
    return null
  }
  return response.json()
}

export default function CompanyChatsClient({ initialChats }: CompanyChatsClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedChatId = searchParams.get("chatId") || undefined

  const [chats] = useState<Chat[]>(initialChats)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadSelectedChat() {
      if (selectedChatId) {
        setLoading(true)
        const chatData = await getChatDetails(selectedChatId)
        setSelectedChat(chatData)
        setLoading(false)
      } else {
        setSelectedChat(null)
      }
    }
    loadSelectedChat()
  }, [selectedChatId])

  const handleChatSelect = async (chatId: string) => {
    router.push(`/chats?chatId=${chatId}`)
  }

  return (
    <div className="h-[calc(100vh-200px)] -mx-6 sm:-mx-8">
      <div className="flex flex-col md:flex-row h-full">
        {/* Left Panel - Chat List */}
        <div className={cn(
          "flex-shrink-0 border-r border-gray-200 bg-white",
          selectedChatId ? "hidden md:block md:w-96 lg:w-[400px]" : "w-full md:w-96 lg:w-[400px]"
        )}>
          <div className="h-full flex flex-col">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">User Conversations</h1>
              <p className="text-sm text-gray-600 mt-1">
                {chats.length} {chats.length === 1 ? "conversation" : "conversations"}
              </p>
            </div>
            <ChatList
              chats={chats.map((chat) => ({
                ...chat,
                firstMessage: chat.messages.find((m) => m.role === "user")?.content || null,
              }))}
              selectedChatId={selectedChatId}
              onChatSelect={handleChatSelect}
            />
          </div>
        </div>

        {/* Right Panel - Conversation View */}
        <div className="flex-1 overflow-hidden bg-gray-50 p-4 md:p-6">
          {selectedChatId && (
            <div className="md:hidden mb-4">
              <button
                onClick={() => router.push("/chats")}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to list
              </button>
            </div>
          )}
          {loading ? (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <p className="text-gray-500">Loading conversation...</p>
              </CardContent>
            </Card>
          ) : selectedChat ? (
            <div className="h-full">
              <ChatViewReadOnly
                messages={selectedChat.messages}
                userName={selectedChat.user.name || undefined}
                userEmail={selectedChat.user.email}
                createdAt={selectedChat.createdAt}
                updatedAt={selectedChat.updatedAt}
                totalMessages={selectedChat._count.messages}
              />
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <p className="text-gray-500">Select a conversation to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

