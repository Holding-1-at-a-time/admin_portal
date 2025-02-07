import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Settings",
  description: "Manage your company settings and preferences",
}

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">SETTINGS</h1>
      {children}
    </div>
  )
}

