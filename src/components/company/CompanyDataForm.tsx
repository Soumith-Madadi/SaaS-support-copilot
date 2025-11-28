"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface CompanyDataFormProps {
  initialData?: {
    features?: any
    pricing?: any
    usage?: any
    commonIssues?: any
  } | null
}

export default function CompanyDataForm({ initialData }: CompanyDataFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    features: initialData?.features ? JSON.stringify(initialData.features, null, 2) : "[]",
    pricing: initialData?.pricing ? JSON.stringify(initialData.pricing, null, 2) : "{}",
    usage: initialData?.usage ? JSON.stringify(initialData.usage, null, 2) : "{}",
    commonIssues: initialData?.commonIssues ? JSON.stringify(initialData.commonIssues, null, 2) : "[]",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setLoading(true)

    try {
      // Validate JSON
      const features = JSON.parse(formData.features)
      const pricing = JSON.parse(formData.pricing)
      const usage = JSON.parse(formData.usage)
      const commonIssues = JSON.parse(formData.commonIssues)

      const response = await fetch("/api/company/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          features,
          pricing,
          usage,
          commonIssues,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update company data")
      }

      setSuccess(true)
      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (err: any) {
      setError(err.message || "Invalid JSON or server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 text-sm text-green-600 bg-green-50 rounded-md">
            Company data updated successfully!
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>
              List your company's features (JSON array of objects with name, description, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full h-40 p-3 border border-gray-300 rounded-md font-mono text-sm"
              placeholder='[{"name": "Feature 1", "description": "Description here"}]'
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>
              Pricing information (JSON object with tiers, prices, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={formData.pricing}
              onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
              className="w-full h-40 p-3 border border-gray-300 rounded-md font-mono text-sm"
              placeholder='{"basic": {"price": 29, "features": []}, "pro": {"price": 99, "features": []}}'
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Documentation</CardTitle>
            <CardDescription>
              Usage guides and documentation (JSON object)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={formData.usage}
              onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
              className="w-full h-40 p-3 border border-gray-300 rounded-md font-mono text-sm"
              placeholder='{"gettingStarted": "...", "advanced": "..."}'
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Issues</CardTitle>
            <CardDescription>
              Common issues and their solutions (JSON array)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={formData.commonIssues}
              onChange={(e) => setFormData({ ...formData, commonIssues: e.target.value })}
              className="w-full h-40 p-3 border border-gray-300 rounded-md font-mono text-sm"
              placeholder='[{"issue": "Problem", "solution": "Solution here"}]'
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

