import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { SessionUser } from "@/types"
import ChatInterface from "@/components/chat/ChatInterface"

interface PageProps {
  params: Promise<{ chatId: string }>
}

export default async function CompanyChatDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const user = session.user as SessionUser

  if (user.role !== "COMPANY_ADMIN" && user.role !== "TEAM_MEMBER") {
    redirect("/dashboard/chat")
  }

  const { chatId } = await params

  const chat = await db.chat.findFirst({
    where: {
      id: chatId,
      companyId: user.companyId,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!chat) {
    redirect("/company/chats")
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {chat.title || "Chat"}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Chat with {chat.user.name || chat.user.email}
        </p>
        {chat.summary && (
          <p className="mt-1 text-sm text-gray-500">{chat.summary}</p>
        )}
      </div>
      <ChatInterface initialChatId={chatId} initialMessages={chat.messages} />
    </div>
  )
}

