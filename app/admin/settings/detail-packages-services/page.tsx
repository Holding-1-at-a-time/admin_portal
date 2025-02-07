import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { DetailPackagesServicesForm } from "@/components/DetailPackagesServicesForm"

export default function DetailPackagesServicesPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Detail Packages/Services</h1>
            <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
                <DetailPackagesServicesForm />
            </Suspense>
        </div>
    )
}

