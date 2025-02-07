"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const settingsNavItems = [
  { title: "Company Info", href: "/admin/settings/company-info" },
  { title: "Invoices & Estimates", href: "/admin/settings/invoices-estimates" },
  { title: "Credit Card Processing", href: "/admin/settings/credit-card-processing" },
  { title: "QuickBooks Settings", href: "/admin/settings/quickbooks" },
  { title: "PDR Matrices", href: "/admin/settings/pdr-matrices" },
  { title: "Subscription", href: "/admin/settings/subscription" },
  { title: "Company Rates", href: "/admin/settings/company-rates" },
  { title: "Misc Page Edit", href: "/admin/settings/misc" },
  { title: "Batch Import", href: "/admin/settings/batch-import" },
  { title: "Parts Program", href: "/admin/settings/parts-program" },
  { title: "Detail Packages/Services", href: "/admin/settings/packages" },
  { title: "Exports", href: "/admin/settings/exports" },
  { title: "Checklists", href: "/admin/settings/checklists" },
  { title: "Client Text/Email Alerts", href: "/admin/settings/alerts" },
  { title: "Cost of Goods Sold", href: "/admin/settings/cogs" },
  { title: "Time Tracking", href: "/admin/settings/time-tracking" },
  { title: "Signature Disclosure Docs", href: "/admin/settings/disclosure-docs" },
]

export default function SettingsSidebar() {
  const [activeItem, setActiveItem] = useState("Company Info")

  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
      {settingsNavItems.map((item) => (
        <Button
          key={item.title}
          variant={activeItem === item.title ? "secondary" : "ghost"}
          className={cn("justify-start", activeItem === item.title && "bg-muted font-medium text-primary")}
          onClick={() => setActiveItem(item.title)}
        >
          <Link href={item.href} className="w-full text-left">
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  )
}

