"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { UserRole } from "@prisma/client"
import { cn } from "@/lib/utils"

interface CompanyNavLinksProps {
  userRole: UserRole
}

export default function CompanyNavLinks({ userRole }: CompanyNavLinksProps) {
  const pathname = usePathname()

  const isChatsActive = pathname === "/chats" || pathname?.startsWith("/chats/")
  const isSettingsActive = pathname?.startsWith("/settings")

  return (
    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
      <Link
        href="/chats"
        className={cn(
          "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
          isChatsActive
            ? "border-blue-500 text-gray-900"
            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
        )}
      >
        Chats
      </Link>
      {userRole === UserRole.COMPANY_ADMIN && (
        <Link
          href="/settings"
          className={cn(
            "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
            isSettingsActive
              ? "border-blue-500 text-gray-900"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          )}
        >
          Settings
        </Link>
      )}
    </div>
  )
}

