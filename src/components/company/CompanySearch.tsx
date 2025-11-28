"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Building2, Globe, FileText } from "lucide-react"

interface Company {
  id: string
  name: string
  slug: string
  description?: string | null
  website?: string | null
  logoUrl?: string | null
}

interface CompanySearchProps {
  initialCompanies: Company[]
}

export default function CompanySearch({ initialCompanies }: CompanySearchProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCompanies = initialCompanies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md"
        />
      </div>

      {filteredCompanies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">
              {searchQuery ? "No companies found matching your search." : "No companies available."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <Link key={company.id} href={`/chat/${company.slug}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      {company.description && (
                        <CardDescription className="mt-1 line-clamp-2">
                          {company.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {company.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <span className="truncate">{company.website}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

