import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function QuickBooksSettingsForm({ formData, errors, handleInputChange }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="quickbooksIntegration"
          checked={formData.quickbooksIntegration || false}
          onCheckedChange={(checked) => handleInputChange("quickbooksIntegration", checked)}
        />
        <Label htmlFor="quickbooksIntegration">Enable QuickBooks Integration</Label>
      </div>
      {formData.quickbooksIntegration && (
        <>
          <div>
            <Label htmlFor="quickbooksCompanyId">QuickBooks Company ID</Label>
            <Input
              id="quickbooksCompanyId"
              value={formData.quickbooksCompanyId || ""}
              onChange={(e) => handleInputChange("quickbooksCompanyId", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="quickbooksToken">QuickBooks Access Token</Label>
            <Input
              id="quickbooksToken"
              type="password"
              value={formData.quickbooksToken || ""}
              onChange={(e) => handleInputChange("quickbooksToken", e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  )
}

