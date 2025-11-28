import { redirect } from "next/navigation"
import { requireCustomer } from "@/lib/auth-helpers"
import { db } from "@/lib/db"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"

export default async function HistoryPage() {
  const session = await requireCustomer()

  const chats = await db.chat.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Chat History</h1>
        <p className="mt-2 text-sm text-gray-600">
          View your previous conversations across all companies
        </p>
      </div>
      <div className="grid gap-4">
        {chats.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No chat history yet. Start a conversation to see it here.</p>
            </CardContent>
          </Card>
        ) : (
          chats.map((chat) => (
            <Link key={chat.id} href={`/chat/${chat.company.slug}/${chat.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        {chat.company.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {chat.title || `Chat ${new Date(chat.createdAt).toLocaleDateString()}`}
                      </CardDescription>
                    </div>
                  </div>
                  {chat.summary && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{chat.summary}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    {new Date(chat.updatedAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

