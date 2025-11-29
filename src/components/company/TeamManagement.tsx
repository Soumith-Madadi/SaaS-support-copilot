"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, UserPlus } from "lucide-react"

interface TeamMember {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: Date
}

interface TeamManagementProps {
  initialTeamMembers: TeamMember[]
}

export default function TeamManagement({
  initialTeamMembers,
}: TeamManagementProps) {
  const router = useRouter()
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"SUPPORT" | "ADMIN">("SUPPORT")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Map UI roles to database roles
      const dbRole = role === "ADMIN" ? "COMPANY_ADMIN" : "COMPANY_MEMBER"
      
      const response = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: dbRole }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add team member")
      }

      setTeamMembers([...teamMembers, data.member])
      setEmail("")
      setPassword("")
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
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
          <CardTitle>Add Team Member</CardTitle>
          <CardDescription>
            Create a new team member account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="team@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <div className="flex gap-4">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "SUPPORT" | "ADMIN")}
                  className="px-3 py-2 border border-gray-300 rounded-md flex-1"
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
                      Add Member
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
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

