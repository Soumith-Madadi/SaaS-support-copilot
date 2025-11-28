import { redirect } from "next/navigation"
import { requireCompanyAdmin } from "@/lib/auth-helpers"
import { db } from "@/lib/db"
import CompanyDataForm from "@/components/company/CompanyDataForm"

export default async function CompanySettingsPage() {
  const session = await requireCompanyAdmin()

  if (!session.user.companyId) {
    redirect("/companies")
  }

  const companyData = await db.companyData.findUnique({
    where: { companyId: session.user.companyId },
  })

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Company Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update your company information that will be used by the AI assistant
        </p>
      </div>
      <CompanyDataForm initialData={companyData} />
    </div>
  )
}

