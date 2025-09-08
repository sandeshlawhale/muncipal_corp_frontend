"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { TopNav } from "@/components/top-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface FormData {
  name: string
  mobile: string
  email: string
  reason: string
}

export default function PreVerificationPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    mobile: "",
    email: "",
    reason: "",
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setIsSubmitting(true)

    // Log form data to console
    console.log("Pre-verification form data:", formData)

    // Simulate form processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Save completion flag to localStorage
    localStorage.setItem("preVerificationComplete", "true")

    // Redirect to verification page
    router.push("/verification")
  }

  const isFormValid = formData.name && formData.mobile && formData.email && formData.reason

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Pre-Verification Details</CardTitle>
              <p className="text-muted-foreground text-center">
                Please provide your details before proceeding to verification
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Verification *</Label>
                  <Textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="Please specify the reason for document verification"
                    rows={3}
                    required
                  />
                </div>

                <Button type="submit" className="w-full mt-6" size="lg" disabled={!isFormValid || isSubmitting}>
                  {isSubmitting ? "Processing..." : "Continue to Verification"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
