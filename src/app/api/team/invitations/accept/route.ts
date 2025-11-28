import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, name, password } = body

    if (!token || !name || !password) {
      return NextResponse.json(
        { error: "Token, name, and password are required" },
        { status: 400 }
      )
    }

    const invitation = await db.invitation.findUnique({
      where: { token },
    })

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      )
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "Invitation has expired" },
        { status: 400 }
      )
    }

    // Check if already accepted
    const alreadyAccepted = await db.user.findFirst({
      where: {
        email: invitation.email,
        companyId: invitation.companyId,
        password: { not: null },
      },
    })

    if (alreadyAccepted) {
      return NextResponse.json(
        { error: "Invitation has already been accepted" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if team member already exists (without password)
    const existingMember = await db.user.findFirst({
      where: {
        email: invitation.email,
        companyId: invitation.companyId,
      },
    })

    if (existingMember) {
      // Update existing member
      await db.user.update({
        where: { id: existingMember.id },
        data: {
          name,
          password: hashedPassword,
          role: invitation.role,
        },
      })
    } else {
      // Create new team member
      await db.user.create({
        data: {
          email: invitation.email,
          name,
          password: hashedPassword,
          companyId: invitation.companyId,
          role: invitation.role,
        },
      })
    }

    // Delete invitation
    await db.invitation.delete({
      where: { id: invitation.id },
    })

    return NextResponse.json({ message: "Invitation accepted successfully" })
  } catch (error: any) {
    console.error("Accept invitation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

