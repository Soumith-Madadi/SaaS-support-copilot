import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { SessionUser } from "@/types"
import CompanyDataForm from "@/components/company/CompanyDataForm"

export default async function CompanyDataPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const user = session.user as SessionUser

  if (user.role !== "COMPANY_ADMIN") {
    redirect("/dashboard/chat")
  }

  const companyData = await db.companyData.findUnique({
    where: { companyId: user.companyId },
  })

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Company Data</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update your company information that will be used by the AI assistant
        </p>
      </div>
      <CompanyDataForm initialData={companyData} />
    </div>
  )
}

