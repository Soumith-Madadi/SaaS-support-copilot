import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { SessionUser } from "@/types"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user as SessionUser

    if (user.role !== "COMPANY_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params

    // Verify invitation belongs to user's company
    const invitation = await db.invitation.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },
    })

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
    }

    await db.invitation.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Invitation deleted successfully" })
  } catch (error) {
    console.error("Delete invitation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

