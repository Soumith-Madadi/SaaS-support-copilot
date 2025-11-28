import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { UserRole } from "@prisma/client"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user

    if (user.role !== UserRole.CUSTOMER) {
      return NextResponse.json({ error: "Only customers can create chats" }, { status: 403 })
    }

    const body = await request.json()
    const { companySlug } = body

    if (!companySlug) {
      return NextResponse.json(
        { error: "Company slug is required" },
        { status: 400 }
      )
    }

    // Find company by slug
    const company = await db.company.findUnique({
      where: { slug: companySlug },
    })

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      )
    }

    // Create new chat
    const chat = await db.chat.create({
      data: {
        userId: user.id,
        companyId: company.id,
        title: `Chat with ${company.name}`,
      },
    })

    return NextResponse.json({
      chatId: chat.id,
      companySlug: company.slug,
    })
  } catch (error) {
    console.error("Create chat error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

