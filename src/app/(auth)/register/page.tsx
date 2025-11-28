"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RegisterPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"customer" | "company">("customer")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Customer form state
  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    password: "",
  })

  // Company form state
  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    companySlug: "",
    website: "",
    description: "",
    adminName: "",
    email: "",
    password: "",
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "customer",
          ...customerForm,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registration failed")
        return
      }

      router.push("/companies")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "company",
          ...companyForm,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registration failed")
        return
      }

      router.push("/chats")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Choose your account type to get started</CardDescription>
        </CardHeader>
        <Tabs value={mode} onValueChange={(v) => setMode(v as "customer" | "company")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customer">
            <form onSubmit={handleCustomerSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label htmlFor="customer-name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="customer-name"
                    placeholder="John Doe"
                    value={customerForm.name}
                    onChange={(e) =>
                      setCustomerForm({ ...customerForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="customer-email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="you@example.com"
                    value={customerForm.email}
                    onChange={(e) =>
                      setCustomerForm({ ...customerForm, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="customer-password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="customer-password"
                    type="password"
                    placeholder="••••••••"
                    value={customerForm.password}
                    onChange={(e) =>
                      setCustomerForm({ ...customerForm, password: e.target.value })
                    }
                    required
                    minLength={6}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create Customer Account"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="company">
            <form onSubmit={handleCompanySubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label htmlFor="company-name" className="text-sm font-medium">
                    Company Name
                  </label>
                  <Input
                    id="company-name"
                    placeholder="Acme Inc."
                    value={companyForm.companyName}
                    onChange={(e) => {
                      const name = e.target.value
                      setCompanyForm({
                        ...companyForm,
                        companyName: name,
                        companySlug: generateSlug(name),
                      })
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="company-slug" className="text-sm font-medium">
                    Company Slug
                  </label>
                  <Input
                    id="company-slug"
                    placeholder="acme-inc"
                    value={companyForm.companySlug}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, companySlug: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="website" className="text-sm font-medium">
                    Website (Optional)
                  </label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    value={companyForm.website}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, website: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Brief description of your company"
                    value={companyForm.description}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, description: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="admin-name" className="text-sm font-medium">
                    Admin Name
                  </label>
                  <Input
                    id="admin-name"
                    placeholder="John Doe"
                    value={companyForm.adminName}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, adminName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="company-email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="company-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={companyForm.email}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="company-password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="company-password"
                    type="password"
                    placeholder="••••••••"
                    value={companyForm.password}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, password: e.target.value })
                    }
                    required
                    minLength={6}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create Company Account"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
        <div className="px-6 pb-6">
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

