"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, UserPlus, X } from "lucide-react"

interface TeamMember {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: Date
}

interface Invitation {
  id: string
  email: string
  role: string
  expiresAt: Date
  createdAt: Date
}

interface TeamManagementProps {
  initialTeamMembers: TeamMember[]
  initialInvitations: Invitation[]
}

export default function TeamManagement({
  initialTeamMembers,
  initialInvitations,
}: TeamManagementProps) {
  const router = useRouter()
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers)
  const [invitations, setInvitations] = useState(initialInvitations)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"SUPPORT" | "ADMIN">("SUPPORT")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Map UI roles to database roles
      const dbRole = role === "ADMIN" ? "COMPANY_ADMIN" : "COMPANY_MEMBER"
      
      const response = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: dbRole }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invitation")
      }

      setInvitations([...invitations, data.invitation])
      setEmail("")
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveInvitation = async (invitationId: string) => {
    try {
      const response = await fetch(`/api/team/invitations/${invitationId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setInvitations(invitations.filter((inv) => inv.id !== invitationId))
      }
    } catch (err) {
      console.error("Error removing invitation:", err)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Invite Team Member</CardTitle>
          <CardDescription>
            Send an invitation email to a team member
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="flex gap-4">
              <Input
                type="email"
                placeholder="team@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "SUPPORT" | "ADMIN")}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="SUPPORT">Support</option>
                <option value="ADMIN">Admin</option>
              </select>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>
            Invitations that haven't been accepted yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invitations.length === 0 ? (
            <p className="text-sm text-gray-500">No pending invitations</p>
          ) : (
            <div className="space-y-2">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                >
                  <div>
                    <p className="font-medium">{invitation.email}</p>
                    <p className="text-sm text-gray-500">
                      Role: {invitation.role} • Expires:{" "}
                      {new Date(invitation.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveInvitation(invitation.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Active team members in your company
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teamMembers.length === 0 ? (
            <p className="text-sm text-gray-500">No team members yet</p>
          ) : (
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                >
                  <div>
                    <p className="font-medium">{member.name || member.email}</p>
                    <p className="text-sm text-gray-500">
                      {member.email} • Role: {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

