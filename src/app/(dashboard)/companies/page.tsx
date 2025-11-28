import { redirect } from "next/navigation"
import { requireCustomer } from "@/lib/auth-helpers"
import { db } from "@/lib/db"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import CompanySearch from "@/components/company/CompanySearch"

export default async function CompaniesPage() {
  const session = await requireCustomer()

  const companies = await db.company.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Browse Companies</h1>
        <p className="mt-2 text-sm text-gray-600">
          Select a company to start a conversation with their support bot
        </p>
      </div>
      <CompanySearch initialCompanies={companies} />
    </div>
  )
}

