import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { SessionUser } from "@/types"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CompanyChatsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const user = session.user as SessionUser

  if (user.role !== "COMPANY_ADMIN" && user.role !== "COMPANY_MEMBER") {
    redirect("/dashboard/chat")
  }

  if (!user.companyId) {
    redirect("/dashboard/chat")
  }

  const chats = await db.chat.findMany({
    where: {
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
        take: 1,
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Company Chats</h1>
        <p className="mt-2 text-sm text-gray-600">
          View all chats from your company's users
        </p>
      </div>
      <div className="grid gap-4">
        {chats.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No chats yet.</p>
            </CardContent>
          </Card>
        ) : (
          chats.map((chat) => (
            <Link key={chat.id} href={`/company/chats/${chat.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {chat.title || `Chat with ${chat.user.name || chat.user.email}`}
                  </CardTitle>
                  <CardDescription>
                    {chat.summary || (chat.messages[0]?.content.substring(0, 100) + "...")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>
                      User: {chat.user.name || chat.user.email} • {chat._count.messages} messages
                    </span>
                    <span>{new Date(chat.updatedAt).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

