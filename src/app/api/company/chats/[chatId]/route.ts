import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { UserRole } from "@prisma/client"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user

    if (user.role !== UserRole.COMPANY_ADMIN && user.role !== UserRole.COMPANY_MEMBER) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (!user.companyId) {
      return NextResponse.json({ error: "Company ID not found" }, { status: 400 })
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
        _count: {
          select: {
            messages: true,
          },
        },
      },
    })

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    return NextResponse.json(chat)
  } catch (error) {
    console.error("Error fetching chat details:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

