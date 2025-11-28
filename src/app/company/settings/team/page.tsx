import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { SessionUser } from "@/types"
import TeamManagement from "@/components/company/TeamManagement"

export default async function TeamManagementPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const user = session.user as SessionUser

  if (user.role !== "COMPANY_ADMIN") {
    redirect("/dashboard/chat")
  }

  const teamMembers = await db.teamMember.findMany({
    where: { companyId: user.companyId },
    orderBy: { createdAt: "desc" },
  })

  const invitations = await db.invitation.findMany({
    where: {
      companyId: user.companyId,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
        <p className="mt-2 text-sm text-gray-600">
          Invite and manage team members who can view company chats
        </p>
      </div>
      <TeamManagement initialTeamMembers={teamMembers} initialInvitations={invitations} />
    </div>
  )
}

