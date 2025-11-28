import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { mode } = body

    if (mode === "customer") {
      // Customer registration
      const { name, email, password } = body

      if (!name || !email || !password) {
        return NextResponse.json(
          { error: "Name, email, and password are required" },
          { status: 400 }
        )
      }

      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create customer user
      const user = await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: UserRole.CUSTOMER,
          companyId: null,
        },
      })

      return NextResponse.json(
        { message: "Account created successfully", userId: user.id },
        { status: 201 }
      )
    } else if (mode === "company") {
      // Company registration
      const {
        companyName,
        companySlug,
        website,
        description,
        adminName,
        email,
        password,
      } = body

      if (!companyName || !companySlug || !adminName || !email || !password) {
        return NextResponse.json(
          { error: "Company name, slug, admin name, email, and password are required" },
          { status: 400 }
        )
      }

      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        )
      }

      // Check if company slug is taken
      const existingCompany = await db.company.findUnique({
        where: { slug: companySlug },
      })

      if (existingCompany) {
        return NextResponse.json(
          { error: "Company slug is already taken" },
          { status: 400 }
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create company, company data, and admin user in a transaction
      const result = await db.$transaction(async (tx) => {
        // Create company
        const company = await tx.company.create({
          data: {
            name: companyName,
            slug: companySlug,
            website: website || null,
            description: description || null,
          },
        })

        // Create admin user
        const user = await tx.user.create({
          data: {
            name: adminName,
            email,
            password: hashedPassword,
            role: UserRole.COMPANY_ADMIN,
            companyId: company.id,
          },
        })

        // Create initial company data entry
        await tx.companyData.create({
          data: {
            companyId: company.id,
            features: [],
            pricing: {},
            usage: {},
            commonIssues: [],
          },
        })

        return { company, user }
      })

      return NextResponse.json(
        { message: "Company account created successfully", userId: result.user.id },
        { status: 201 }
      )
    } else {
      return NextResponse.json(
        { error: "Invalid registration mode. Use 'customer' or 'company'" },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error("Registration error:", error)
    
    // Handle unique constraint violations
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email or company slug already exists" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
