import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { UserRole } from "@prisma/client"

export async function GET(request: Request) {
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

    return NextResponse.json(chats)
  } catch (error) {
    console.error("Error fetching company chats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

