import { redirect } from "next/navigation"
import { requireCustomer } from "@/lib/auth-helpers"
import { db } from "@/lib/db"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import CreateChatButton from "@/components/company/CreateChatButton"

interface PageProps {
  params: Promise<{ companySlug: string }>
}

export default async function CompanyChatPage({ params }: PageProps) {
  const session = await requireCustomer()
  const { companySlug } = await params

  // Fetch company by slug
  const company = await db.company.findUnique({
    where: { slug: companySlug },
  })

  if (!company) {
    redirect("/companies")
  }

  // Fetch existing chats with this company for this user
  const existingChats = await db.chat.findMany({
    where: {
      userId: session.user.id,
      companyId: company.id,
    },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        take: 1,
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  })

  // Create new chat handler
  const createNewChat = async () => {
    "use server"
    const chat = await db.chat.create({
      data: {
        userId: session.user.id,
        companyId: company.id,
        title: `Chat with ${company.name}`,
      },
    })
    redirect(`/chat/${companySlug}/${chat.id}`)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
        {company.description && (
          <p className="mt-2 text-sm text-gray-600">{company.description}</p>
        )}
      </div>

      <div className="mb-4">
        <CreateChatButton companySlug={companySlug} />
      </div>

      {existingChats.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Previous Chats</h2>
          <div className="grid gap-4">
            {existingChats.map((chat) => (
              <Link key={chat.id} href={`/chat/${companySlug}/${chat.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      {chat.title || `Chat ${new Date(chat.createdAt).toLocaleDateString()}`}
                    </CardTitle>
                    {chat.summary && (
                      <CardDescription className="mt-1 line-clamp-2">
                        {chat.summary}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{chat._count.messages} messages</span>
                      <span>{new Date(chat.updatedAt).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

