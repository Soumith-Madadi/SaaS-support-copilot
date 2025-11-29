import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { SessionUser } from "@/types"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user as SessionUser

    if (user.role !== "COMPANY_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (!user.companyId) {
      return NextResponse.json(
        { error: "Company ID not found" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { email, role, password } = body

    if (!email || !role || !password) {
      return NextResponse.json(
        { error: "Email, role, and password are required" },
        { status: 400 }
      )
    }

    // Check if team member already exists
    const existingMember = await db.user.findFirst({
      where: {
        email,
        companyId: user.companyId,
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { error: "Team member with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user directly
    const newMember = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        companyId: user.companyId,
      },
    })

    return NextResponse.json({
      member: {
        id: newMember.id,
        email: newMember.email,
        role: newMember.role,
        createdAt: newMember.createdAt,
      },
    })
  } catch (error) {
    console.error("Add team member error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

