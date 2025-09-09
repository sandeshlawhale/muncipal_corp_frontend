"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import AddField from "../../_components/AddField";
import FormActions from "../../_components/FormActions";

interface CustomField {
  id: string;
  label: string;
  value: string;
}

interface BirthFormData {
  date: string;
  subject: string;
  applicantSurname: string;
  applicantName: string;
  applicantFatherName: string;
  motherSurname: string;
  motherName: string;
  motherFatherName: string;
  fatherSurname: string;
  fatherName: string;
  fatherFatherName: string;
  childSurname: string;
  childName: string;
  childFatherName: string;
  childDob: string;
  childGender: string;
  customFields: CustomField[];
}

interface SavedForm {
  id: string;
  savedAt: string;
  data: BirthFormData;
}

interface IssueFormsStorage {
  birth: SavedForm[];
  death: SavedForm[];
}

export default function BirthCertificatePage() {
  const [formData, setFormData] = useState<BirthFormData>({
    date: new Date().toISOString().split("T")[0],
    subject: "Regarding obtaining birth certificate",
    applicantSurname: "",
    applicantName: "",
    applicantFatherName: "",
    motherSurname: "",
    motherName: "",
    motherFatherName: "",
    fatherSurname: "",
    fatherName: "",
    fatherFatherName: "",
    childSurname: "",
    childName: "",
    childFatherName: "",
    childDob: "",
    childGender: "",
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
        const birthForms = formsData.birth || [];
        const formToEdit = birthForms.find((form) => form.id === formId);
        if (formToEdit) {
          setFormData(formToEdit.data);
        }
      }
    } catch (error) {
      console.error("Error loading form data:", error);
    }
  };

  const updateField = (field: keyof BirthFormData, value: string) => {
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
        data: formData,
      };

      if (editFormId) {
        // Update existing form
        const formIndex = formsData.birth.findIndex(
          (form) => form.id === editFormId
        );
        if (formIndex !== -1) {
          formsData.birth[formIndex] = savedForm;
        }
      } else {
        // Add new form
        formsData.birth.push(savedForm);
      }

      localStorage.setItem("issueForms", JSON.stringify(formsData));
      console.log("[v0] Birth certificate form saved successfully");

      // Navigate back to issue page
      router.push("/issue");
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  const handleIssue = () => {
    console.log("Issued");
    console.log("[v0] Birth certificate issued:", formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {editFormId ? "Edit Birth Certificate" : "Birth Certificate"}
        </h1>
        <FormActions onSave={handleSave} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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

          <div>
            <h3 className="text-lg font-semibold mb-4">Related Person Info</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Mother's details</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <Input
                    placeholder="Surname"
                    value={formData.motherSurname}
                    onChange={(e) =>
                      updateField("motherSurname", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Name"
                    value={formData.motherName}
                    onChange={(e) => updateField("motherName", e.target.value)}
                  />
                  <Input
                    placeholder="Father's/Husband's Name"
                    value={formData.motherFatherName}
                    onChange={(e) =>
                      updateField("motherFatherName", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Father's details</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <Input
                    placeholder="Surname"
                    value={formData.fatherSurname}
                    onChange={(e) =>
                      updateField("fatherSurname", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Name"
                    value={formData.fatherName}
                    onChange={(e) => updateField("fatherName", e.target.value)}
                  />
                  <Input
                    placeholder="Father's/Husband's Name"
                    value={formData.fatherFatherName}
                    onChange={(e) =>
                      updateField("fatherFatherName", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Infant's name</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <Input
                    placeholder="Surname"
                    value={formData.childSurname}
                    onChange={(e) =>
                      updateField("childSurname", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Name"
                    value={formData.childName}
                    onChange={(e) => updateField("childName", e.target.value)}
                  />
                  <Input
                    placeholder="Father's/Husband's Name"
                    value={formData.childFatherName}
                    onChange={(e) =>
                      updateField("childFatherName", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="childDob">Date of Birth</Label>
                  <Input
                    id="childDob"
                    type="date"
                    value={formData.childDob}
                    onChange={(e) => updateField("childDob", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Gender</Label>
                  <RadioGroup
                    value={formData.childGender}
                    onValueChange={(value) => updateField("childGender", value)}
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
            </div>
          </div>

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
