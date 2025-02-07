import { Suspense } from "react"
import SettingsLayout from "./layout"
import { Skeleton } from "@/components/ui/skeleton"
import SettingsContent from "@/components/SettingsContent"
import SettingsSidebar from "@/components/SettingsSidebar"

export default function SettingsPage() {
  return (
    <SettingsLayout>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SettingsSidebar />
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <SettingsContent activePage={""} />
          </Suspense>
        </div>
      </div>
    </SettingsLayout>
  )
}

