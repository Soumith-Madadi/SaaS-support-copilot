import { redirect } from "next/navigation"
import { requireCustomer } from "@/lib/auth-helpers"
import { db } from "@/lib/db"
import ChatInterface from "@/components/chat/ChatInterface"

interface PageProps {
  params: Promise<{ companySlug: string; chatId: string }>
}

export default async function CompanyChatDetailPage({ params }: PageProps) {
  const session = await requireCustomer()
  const { companySlug, chatId } = await params

  // Fetch company by slug
  const company = await db.company.findUnique({
    where: { slug: companySlug },
  })

  if (!company) {
    redirect("/companies")
  }

  // Fetch chat and ensure ownership
  const chat = await db.chat.findFirst({
    where: {
      id: chatId,
      userId: session.user.id,
      companyId: company.id,
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!chat) {
    redirect(`/chat/${companySlug}`)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {chat.title || `Chat with ${company.name}`}
        </h1>
        {chat.summary && (
          <p className="mt-2 text-sm text-gray-600">{chat.summary}</p>
        )}
      </div>
      <ChatInterface initialChatId={chatId} initialMessages={chat.messages} />
    </div>
  )
}

