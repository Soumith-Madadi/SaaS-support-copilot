import { UserRole } from "@prisma/client"
import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    name?: string
    companyId: string | null
    role: UserRole
  }

  interface Session {
    user: {
      id: string
      email: string
      name?: string
      companyId: string | null
      role: UserRole
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    companyId?: string | null
    role?: UserRole
  }
}
