import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      )
    }

    const invitation = await db.invitation.findUnique({
      where: { token },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
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
    const existingMember = await db.user.findFirst({
      where: {
        email: invitation.email,
        companyId: invitation.companyId,
        password: { not: null },
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { error: "Invitation has already been accepted" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      invitation: {
        email: invitation.email,
        role: invitation.role,
        companyName: invitation.company.name,
      },
    })
  } catch (error) {
    console.error("Verify invitation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

