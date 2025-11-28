import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { redirect } from "next/navigation"
import { UserRole } from "@prisma/client"

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/login")
  }
  return session
}

export async function requireRole(role: UserRole) {
  const session = await requireAuth()
  if (session.user.role !== role) {
    redirect("/companies")
  }
  return session
}

export async function requireCustomer() {
  const session = await requireAuth()
  if (session.user.role !== UserRole.CUSTOMER) {
    redirect("/chats")
  }
  return session
}

export async function requireCompanyUser() {
  const session = await requireAuth()
  if (
    session.user.role !== UserRole.COMPANY_ADMIN &&
    session.user.role !== UserRole.COMPANY_MEMBER
  ) {
    redirect("/companies")
  }
  return session
}

export async function requireCompanyAdmin() {
  const session = await requireAuth()
  if (session.user.role !== UserRole.COMPANY_ADMIN) {
    redirect("/chats")
  }
  return session
}

