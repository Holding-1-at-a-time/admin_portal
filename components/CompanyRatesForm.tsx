"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import type React from "react" // Added import for React

export function CompanyRatesForm() {
  const { toast } = useToast()
  const companyRates = useQuery(api.companyRates.getCompanyRates)
  const updateCompanyRates = useMutation(api.companyRates.updateCompanyRates)

  const [formData, setFormData] = useState({
    laborRateRI: 0,
    laborRatePaint: 0,
    laborRateBody: 0,
    paintMaterialRate: 0,
    laborRateDetail: 0,
    taxRate: 0,
    pdrRates: {
      fullFront: 0,
      trackPackage: 0,
      fullCoverage: 0,
      hailMarkupOS: false,
      rirrDefaultPricing: "Labor Pricing",
      paintBodyDefaultPricing: "Labor Pricing",
      flatFee: 0,
      interiorDefaultPricing: "Item Pricing",
      interiorFlatFee: 0,
    },
    wheelRates: {
      cosmetic: 0,
      remanufactured: 0,
      straighten: 0,
      backsideRepair: 0,
      crackRepair: 0,
      powderCoat: 0,
      powderCoatTPMSSleeve: 0,
      customPaint: 0,
      hyperFinish: 0,
      machineFinish: 0,
      polish: 0,
      specialFinish: 0,
      twoPieceWheel: 0,
      threePieceWheel: 0,
      paintCenterCaps: 0,
      paintHubcaps: 0,
      paintCallipers: 0,
      reChromed: 0,
      hubcapRepair: 0,
      mountAndBalance: 0,
      tpmsReset: 0,
      ceramicCoating: 0,
      tireDisposalFee: 0,
    },
    glassRates: {
      defaultPricingType: "Flat Pricing",
      firstRepair: 0,
      additionalRepairs: 0,
    },
    tintRates: {
      defaultPricingType: "Panel Pricing",
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (companyRates) {
      setFormData(companyRates)
    }
  }, [companyRates])

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNestedInputChange = (category: string, name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await updateCompanyRates(formData)
      toast({
        title: "Company Rates Updated",
        description: "Your company rates have been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating company rates.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Rates</CardTitle>
          <CardDescription>Set your company's general labor and material rates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="laborRateRI">Labor Rate (R&I)</Label>
              <Input
                id="laborRateRI"
                type="number"
                value={formData.laborRateRI}
                onChange={(e) => handleInputChange("laborRateRI", Number.parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="laborRatePaint">Labor Rate (Paint)</Label>
              <Input
                id="laborRatePaint"
                type="number"
                value={formData.laborRatePaint}
                onChange={(e) => handleInputChange("laborRatePaint", Number.parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="laborRateBody">Labor Rate (Body)</Label>
              <Input
                id="laborRateBody"
                type="number"
                value={formData.laborRateBody}
                onChange={(e) => handleInputChange("laborRateBody", Number.parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paintMaterialRate">Paint Material Rate</Label>
              <Input
                id="paintMaterialRate"
                type="number"
                value={formData.paintMaterialRate}
                onChange={(e) => handleInputChange("paintMaterialRate", Number.parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="laborRateDetail">Labor Rate (Detail)</Label>
              <Input
                id="laborRateDetail"
                type="number"
                value={formData.laborRateDetail}
                onChange={(e) => handleInputChange("laborRateDetail", Number.parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate %</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                value={formData.taxRate}
                onChange={(e) => handleInputChange("taxRate", Number.parseFloat(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PDR Rates</CardTitle>
          <CardDescription>Set your company's PDR (Paintless Dent Repair) rates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pdrFullFront">Full Front</Label>
              <Input
                id="pdrFullFront"
                type="number"
                value={formData.pdrRates.fullFront}
                onChange={(e) => handleNestedInputChange("pdrRates", "fullFront", Number.parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pdrTrackPackage">Track Package</Label>
              <Input
                id="pdrTrackPackage"
                type="number"
                value={formData.pdrRates.trackPackage}
                onChange={(e) => handleNestedInputChange("pdrRates", "trackPackage", Number.parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pdrFullCoverage">Full Coverage</Label>
              <Input
                id="pdrFullCoverage"
                type="number"
                value={formData.pdrRates.fullCoverage}
                onChange={(e) => handleNestedInputChange("pdrRates", "fullCoverage", Number.parseFloat(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="pdrHailMarkupOS"
                checked={formData.pdrRates.hailMarkupOS}
                onCheckedChange={(checked) => handleNestedInputChange("pdrRates", "hailMarkupOS", checked)}
              />
              <Label htmlFor="pdrHailMarkupOS">Include Hail Markup in Base Total</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pdrRirrDefaultPricing">R&I / R&R Default Pricing Type</Label>
              <Select
                value={formData.pdrRates.rirrDefaultPricing}
                onValueChange={(value) => handleNestedInputChange("pdrRates", "rirrDefaultPricing", value)}
              >
                <SelectTrigger id="pdrRirrDefaultPricing">
                  <SelectValue placeholder="Select pricing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Labor Pricing">Labor Pricing</SelectItem>
                  <SelectItem value="Item Pricing">Item Pricing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pdrPaintBodyDefaultPricing">Paint & Body Default Pricing Type</Label>
              <Select
                value={formData.pdrRates.paintBodyDefaultPricing}
                onValueChange={(value) => handleNestedInputChange("pdrRates", "paintBodyDefaultPricing", value)}
              >
                <SelectTrigger id="pdrPaintBodyDefaultPricing">
                  <SelectValue placeholder="Select pricing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Labor Pricing">Labor Pricing</SelectItem>
                  <SelectItem value="Item Pricing">Item Pricing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pdrFlatFee">Flat Fee</Label>
              <Input
                id="pdrFlatFee"
                type="number"
                value={formData.pdrRates.flatFee}
                onChange={(e) => handleNestedInputChange("pdrRates", "flatFee", Number.parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pdrInteriorDefaultPricing">Interior Default Pricing Type</Label>
              <Select
                value={formData.pdrRates.interiorDefaultPricing}
                onValueChange={(value) => handleNestedInputChange("pdrRates", "interiorDefaultPricing", value)}
              >
                <SelectTrigger id="pdrInteriorDefaultPricing">
                  <SelectValue placeholder="Select pricing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Item Pricing">Item Pricing</SelectItem>
                  <SelectItem value="Labor Pricing">Labor Pricing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pdrInteriorFlatFee">Interior Flat Fee</Label>
              <Input
                id="pdrInteriorFlatFee"
                type="number"
                value={formData.pdrRates.interiorFlatFee}
                onChange={(e) =>
                  handleNestedInputChange("pdrRates", "interiorFlatFee", Number.parseFloat(e.target.value))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wheel Rates</CardTitle>
          <CardDescription>Set your company's wheel repair and customization rates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(formData.wheelRates).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`wheel${key}`}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                </Label>
                <Input
                  id={`wheel${key}`}
                  type="number"
                  value={value}
                  onChange={(e) => handleNestedInputChange("wheelRates", key, Number.parseFloat(e.target.value))}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Glass Rates</CardTitle>
          <CardDescription>Set your company's glass repair rates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="glassDefaultPricingType">Default Pricing Type</Label>
            <Select
              value={formData.glassRates.defaultPricingType}
              onValueChange={(value) => handleNestedInputChange("glassRates", "defaultPricingType", value)}
            >
              <SelectTrigger id="glassDefaultPricingType">
                <SelectValue placeholder="Select pricing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Flat Pricing">Flat Pricing</SelectItem>
                <SelectItem value="Panel Pricing">Panel Pricing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="glassFirstRepair">1st Repair</Label>
            <Input
              id="glassFirstRepair"
              type="number"
              value={formData.glassRates.firstRepair}
              onChange={(e) => handleNestedInputChange("glassRates", "firstRepair", Number.parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="glassAdditionalRepairs">Additional Repairs</Label>
            <Input
              id="glassAdditionalRepairs"
              type="number"
              value={formData.glassRates.additionalRepairs}
              onChange={(e) =>
                handleNestedInputChange("glassRates", "additionalRepairs", Number.parseFloat(e.target.value))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tint Rates</CardTitle>
          <CardDescription>Set your company's window tinting rates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tintDefaultPricingType">Default Pricing Type</Label>
            <Select
              value={formData.tintRates.defaultPricingType}
              onValueChange={(value) => handleNestedInputChange("tintRates", "defaultPricingType", value)}
            >
              <SelectTrigger id="tintDefaultPricingType">
                <SelectValue placeholder="Select pricing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Panel Pricing">Panel Pricing</SelectItem>
                <SelectItem value="Flat Pricing">Flat Pricing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  )
}

