import { AuthenticatedLayout } from "@/components/authenticated-layout"
import type { ReactNode } from "react"

interface AuthenticatedRoutesLayoutProps {
  children: ReactNode
}

export default function AuthenticatedRoutesLayout({ children }: AuthenticatedRoutesLayoutProps) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}
