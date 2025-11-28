import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { UserRole } from "@prisma/client"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user

    if (user.role !== UserRole.COMPANY_ADMIN || !user.companyId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { features, pricing, usage, commonIssues } = body

    // Upsert company data
    await db.companyData.upsert({
      where: { companyId: user.companyId },
      update: {
        features: features || null,
        pricing: pricing || null,
        usage: usage || null,
        commonIssues: commonIssues || null,
      },
      create: {
        companyId: user.companyId,
        features: features || null,
        pricing: pricing || null,
        usage: usage || null,
        commonIssues: commonIssues || null,
      },
    })

    return NextResponse.json({ message: "Company data updated successfully" })
  } catch (error) {
    console.error("Company data update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
