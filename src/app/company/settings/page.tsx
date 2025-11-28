import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { SessionUser } from "@/types"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function CompanySettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const user = session.user as SessionUser

  if (user.role !== "COMPANY_ADMIN") {
    redirect("/dashboard/chat")
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Company Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your company data and team members
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/company/settings/data">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle>Company Data</CardTitle>
              <CardDescription>
                Manage features, pricing, usage documentation, and common issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">Manage Data</Button>
            </CardContent>
          </Card>
        </Link>
        <Link href="/company/settings/team">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Invite and manage team members who can view company chats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">Manage Team</Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

