"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import AddField from "../../_components/AddField";
import FormActions from "../../_components/FormActions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CustomField {
  id: string;
  label: string;
  value: string;
}

interface DeathFormData {
  date: string;
  subject: string;
  customFields: CustomField[];
  dateOfDeath: string;
  deceasedGender: string;
  placeOfDeath: string;
  applicantSurname: string;
  applicantName: string;
  applicantFatherName: string;
  deceasedSurname: string;
  deceasedName: string;
  deceasedFatherName: string;
}

interface SavedForm {
  id: string;
  savedAt: string;
  status: "data-added" | "revoked";
  data: DeathFormData;
}

interface IssueFormsStorage {
  birth: SavedForm[];
  death: SavedForm[];
}

export default function DeathCertificatePage() {
  const [formData, setFormData] = useState<DeathFormData>({
    date: new Date().toISOString().split("T")[0],
    subject: "Regarding obtaining death certificate",
    dateOfDeath: new Date().toISOString().split("T")[0],
    deceasedGender: "",
    placeOfDeath: "",
    applicantSurname: "",
    applicantName: "",
    applicantFatherName: "",
    deceasedSurname: "",
    deceasedName: "",
    deceasedFatherName: "",
    customFields: [],
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const editFormId = searchParams.get("edit");

  useEffect(() => {
    if (editFormId) {
      loadFormData(editFormId);
    }
  }, [editFormId]);

  const loadFormData = (formId: string) => {
    try {
      const storedForms = localStorage.getItem("issueForms");
      if (storedForms) {
        const formsData: IssueFormsStorage = JSON.parse(storedForms);
        const deathForms = formsData.death || [];
        const formToEdit = deathForms.find((form) => form.id === formId);
        if (formToEdit) {
          setFormData(formToEdit.data);
        }
      }
    } catch (error) {
      console.error("Error loading form data:", error);
    }
  };

  const updateField = (field: keyof DeathFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addCustomField = () => {
    const newField: CustomField = {
      id: Date.now().toString(),
      label: "",
      value: "",
    };
    setFormData((prev) => ({
      ...prev,
      customFields: [...prev.customFields, newField],
    }));
  };

  const updateCustomField = (
    fieldId: string,
    field: "label" | "value",
    newValue: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.map((f) =>
        f.id === fieldId ? { ...f, [field]: newValue } : f
      ),
    }));
  };

  const removeCustomField = (fieldId: string) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((f) => f.id !== fieldId),
    }));
  };

  const handleSave = () => {
    try {
      const storedForms = localStorage.getItem("issueForms");
      let formsData: IssueFormsStorage = { birth: [], death: [] };

      if (storedForms) {
        formsData = JSON.parse(storedForms);
      }

      const formId = editFormId || `form-${Date.now()}`;
      const savedForm: SavedForm = {
        id: formId,
        savedAt: new Date().toISOString(),
        status: "data-added",
        data: formData,
      };

      if (editFormId) {
        // Update existing form
        const formIndex = formsData.death.findIndex(
          (form) => form.id === editFormId
        );
        if (formIndex !== -1) {
          savedForm.status = formsData.death[formIndex].status;
          formsData.death[formIndex] = savedForm;
        }
      } else {
        // Add new form
        formsData.death.push(savedForm);
      }

      localStorage.setItem("issueForms", JSON.stringify(formsData));
      console.log("[v0] Death certificate form saved successfully");

      // Navigate back to issue page
      router.push("/issue");
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  const handleIssue = () => {
    console.log("Issued");
    console.log("[v0] Death certificate issued:", formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {editFormId ? "Edit Death Certificate" : "Death Certificate"}
        </h1>
        <FormActions onSave={handleSave} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date & Subject */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => updateField("date", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          <Separator />

          {/* Applicant Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Applicant Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="applicantSurname">Surname</Label>
                <Input
                  id="applicantSurname"
                  value={formData.applicantSurname}
                  onChange={(e) =>
                    updateField("applicantSurname", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="applicantName">Name</Label>
                <Input
                  id="applicantName"
                  value={formData.applicantName}
                  onChange={(e) => updateField("applicantName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="applicantFatherName">
                  Father's/Husband's Name
                </Label>
                <Input
                  id="applicantFatherName"
                  value={formData.applicantFatherName}
                  onChange={(e) =>
                    updateField("applicantFatherName", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Related Person Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Details of Deceased</h3>
            <div className="space-y-4">
              {/* Full Name */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="deceasedSurname">Surname</Label>
                  <Input
                    id="deceasedSurname"
                    value={formData.deceasedSurname}
                    onChange={(e) =>
                      updateField("deceasedSurname", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="deceasedName">Name</Label>
                  <Input
                    id="deceasedName"
                    value={formData.deceasedName}
                    onChange={(e) =>
                      updateField("deceasedName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="deceasedFatherName">
                    Father's/Husband's Name
                  </Label>
                  <Input
                    id="deceasedFatherName"
                    value={formData.deceasedFatherName}
                    onChange={(e) =>
                      updateField("deceasedFatherName", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Date of Death */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfDeath">Date of Death</Label>
                  <Input
                    id="dateOfDeath"
                    type="date"
                    value={formData.dateOfDeath}
                    onChange={(e) => updateField("dateOfDeath", e.target.value)}
                  />
                </div>

                {/* Gender */}
                <div>
                  <Label>Gender of Deceased</Label>
                  <RadioGroup
                    value={formData.deceasedGender}
                    onValueChange={(value) =>
                      updateField("deceasedGender", value)
                    }
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Address */}
              <div>
                <Label htmlFor="placeOfDeath">Address of Place of Death</Label>
                <Input
                  id="placeOfDeath"
                  value={formData.placeOfDeath}
                  onChange={(e) => updateField("placeOfDeath", e.target.value)}
                  placeholder="Enter address"
                />
              </div>
            </div>
          </div>

          {/* Custom Fields (optional, if you want like Birth) */}
          {formData.customFields.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4">Custom Fields</h3>
                <div className="space-y-3">
                  {formData.customFields.map((field) => (
                    <div key={field.id} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Label>Field Label</Label>
                        <Input
                          value={field.label}
                          onChange={(e) =>
                            updateCustomField(field.id, "label", e.target.value)
                          }
                          placeholder="Enter field label"
                        />
                      </div>
                      <div className="flex-1">
                        <Label>Field Value</Label>
                        <Input
                          value={field.value}
                          onChange={(e) =>
                            updateCustomField(field.id, "value", e.target.value)
                          }
                          placeholder="Enter field value"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCustomField(field.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <AddField onAddField={addCustomField} />
        </CardContent>
      </Card>
    </div>
  );
}
