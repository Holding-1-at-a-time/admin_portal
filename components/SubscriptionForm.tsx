import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SubscriptionForm({ formData, errors, handleInputChange }) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="subscriptionPlan">Current Subscription Plan</Label>
        <Select
          value={formData.subscriptionPlan || ""}
          onValueChange={(value) => handleInputChange("subscriptionPlan", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="billingCycle">Billing Cycle</Label>
        <Select value={formData.billingCycle || ""} onValueChange={(value) => handleInputChange("billingCycle", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select billing cycle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="annually">Annually</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="nextBillingDate">Next Billing Date</Label>
        <Input
          id="nextBillingDate"
          type="date"
          value={formData.nextBillingDate || ""}
          onChange={(e) => handleInputChange("nextBillingDate", e.target.value)}
        />
      </div>
    </div>
  )
}

