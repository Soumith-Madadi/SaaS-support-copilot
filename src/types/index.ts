import { UserRole, MessageRole } from '@prisma/client'

export type { UserRole, MessageRole }

export interface SessionUser {
  id: string
  email: string
  name?: string
  companyId: string | null
  role: UserRole
}
