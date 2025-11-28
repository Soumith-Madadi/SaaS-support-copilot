"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"

interface CreateChatButtonProps {
  companySlug: string
}

export default function CreateChatButton({ companySlug }: CreateChatButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleCreateChat = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/chat/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companySlug }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create chat")
      }

      router.push(`/chat/${data.companySlug}/${data.chatId}`)
    } catch (error) {
      console.error("Error creating chat:", error)
      alert("Failed to create chat. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCreateChat} disabled={loading} className="w-full sm:w-auto">
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" />
          Start New Chat
        </>
      )}
    </Button>
  )
}

