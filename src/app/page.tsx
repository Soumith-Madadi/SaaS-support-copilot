import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { UserRole } from "@prisma/client"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Redirect based on user role
  if (session.user.role === UserRole.CUSTOMER) {
    redirect("/companies")
  } else {
    redirect("/chats")
  }
}
