import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import { db } from "@/lib/db"
import SignOutButton from "@/components/layout/SignOutButton"
import CompanyNavLinks from "@/components/layout/CompanyNavLinks"
import { Building2 } from "lucide-react"

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const user = session.user

  // Only company users should access company routes
  if (user.role !== UserRole.COMPANY_ADMIN && user.role !== UserRole.COMPANY_MEMBER) {
    redirect("/companies")
  }

  // Fetch company information
  const company = user.companyId
    ? await db.company.findUnique({
        where: { id: user.companyId },
        select: { name: true, logoUrl: true },
      })
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-3 mr-6">
                {company?.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    className="h-8 w-8 rounded"
                  />
                ) : (
                  <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {company?.name || "Company Dashboard"}
                  </div>
                  <div className="text-xs text-gray-500">Company Account</div>
                </div>
              </div>
              <CompanyNavLinks userRole={user.role} />
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">{user.email}</span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
