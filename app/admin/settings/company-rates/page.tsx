import { Suspense } from "react"
import { CompanyRatesForm } from "@/components/settings/CompanyRatesForm"
import { Skeleton } from "@/components/ui/skeleton"

export default function CompanyRatesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Company Rates</h1>
      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <CompanyRatesForm />
      </Suspense>
    </div>
  )
}

