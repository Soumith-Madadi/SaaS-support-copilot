import { redirect } from "next/navigation"
import { requireCompanyUser } from "@/lib/auth-helpers"
import { db } from "@/lib/db"
import CompanyChatsClient from "@/components/company/CompanyChatsClient"

export default async function CompanyChatsPage() {
  const session = await requireCompanyUser()

  if (!session.user.companyId) {
    redirect("/companies")
  }

  const chats = await db.chat.findMany({
    where: {
      companyId: session.user.companyId,
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

  return <CompanyChatsClient initialChats={chats} />
}
