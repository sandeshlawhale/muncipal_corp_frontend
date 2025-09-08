"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TopNav } from "@/components/top-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, Loader2 } from "lucide-react"

const verificationSteps: string[] = [
  "Requesting verification...",
  "Accessing records...",
  "Calling API...",
  "Issuance...",
]

export default function VerificationPage() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [isVerificationComplete, setIsVerificationComplete] = useState<boolean>(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false)

  useEffect(() => {
    const preVerificationComplete = localStorage.getItem("preVerificationComplete")
    if (preVerificationComplete !== "true") {
      router.push("/pre-verification")
      return
    }

    // Check if verification was already completed
    const verificationStatus = localStorage.getItem("verificationStatus")
    if (verificationStatus === "verified") {
      setIsButtonDisabled(true)
    }
  }, [router])

  const handleVerify = (): void => {
    setIsModalOpen(true)
    setCurrentStep(0)
    setIsVerified(false)
    setIsVerificationComplete(false)

    // Start the verification sequence
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < verificationSteps.length - 1) {
          return prev + 1
        } else {
          clearInterval(stepInterval)
          // Show success after a brief delay
          setTimeout(() => {
            setIsVerified(true)
            setIsVerificationComplete(true)
          }, 1000)
          return prev
        }
      })
    }, 1500)
  }

  const handleCloseModal = (): void => {
    setIsModalOpen(false)
    if (isVerificationComplete) {
      // Disable the verify button and persist state
      setIsButtonDisabled(true)
      localStorage.setItem("verificationStatus", "verified")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Document Preview */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Document Preview</h2>
            <Card className="aspect-[3/2] flex items-center justify-center bg-muted">
              <CardContent className="text-center p-8">
                <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">ID</span>
                    </div>
                    <p className="text-muted-foreground">Aadhaar Card Preview</p>
                    <p className="text-sm text-muted-foreground">Sample Document</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Form Metadata */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Document Details</h2>

            <Card>
              <CardHeader>
                <CardTitle>Aadhaar Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Number</Label>
                  <Input id="aadhaar" value="1234 5678 9012" readOnly className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value="Rahul Sharma" readOnly className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" value="1990-01-01" readOnly className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value="Mumbai, India" readOnly className="bg-muted" />
                </div>

                <Button onClick={handleVerify} disabled={isButtonDisabled} className="w-full mt-6" size="lg">
                  {isButtonDisabled ? "Verification Complete" : "Verify"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isVerificationComplete ? "Verification Complete" : "Verifying Document"}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4 py-6">
            {isVerificationComplete ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-500" />
                <p className="text-lg font-medium text-foreground">Verification Complete</p>
                <p className="text-sm text-muted-foreground text-center">
                  Your document has been successfully verified.
                </p>
                <Button onClick={handleCloseModal} className="mt-4">
                  Close
                </Button>
              </>
            ) : (
              <>
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium text-foreground">{verificationSteps[currentStep]}</p>
                  <div className="flex space-x-1 justify-center">
                    {verificationSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${index <= currentStep ? "bg-primary" : "bg-muted"}`}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
