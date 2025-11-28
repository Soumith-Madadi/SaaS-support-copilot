import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { SessionUser } from "@/types"
import crypto from "crypto"

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

    const body = await request.json()
    const { email, role } = body

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      )
    }

    // Check if team member already exists
    const existingMember = await db.teamMember.findFirst({
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

    // Generate invitation token
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

    // Create invitation
    const invitation = await db.invitation.create({
      data: {
        companyId: user.companyId,
        email,
        token,
        role,
        expiresAt,
      },
    })

    // TODO: Send invitation email
    // For now, we'll just return the invitation with the token
    // In production, you'd send an email with a link like:
    // `${process.env.NEXTAUTH_URL}/accept-invitation?token=${token}`

    return NextResponse.json({
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
        createdAt: invitation.createdAt,
      },
      token, // In production, don't return this - send via email instead
    })
  } catch (error) {
    console.error("Invitation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

