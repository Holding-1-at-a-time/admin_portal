import { Suspense } from "react"
import { InvoiceEstimateSettingsForm } from "@/components/settings/InvoiceEstimateSettingsForm"
import { Skeleton } from "@/components/ui/skeleton"

export default function InvoiceEstimateSettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Invoices & Estimates Settings</h1>
      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <InvoiceEstimateSettingsForm />
      </Suspense>
    </div>
  )
}

