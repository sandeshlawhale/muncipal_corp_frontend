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

interface CustomField {
  id: string;
  label: string;
  value: string;
}

interface DeathFormData {
  date: string;
  subject: string;
  customFields: CustomField[];
}

interface SavedForm {
  id: string;
  savedAt: string;
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
        data: formData,
      };

      if (editFormId) {
        // Update existing form
        const formIndex = formsData.death.findIndex(
          (form) => form.id === editFormId
        );
        if (formIndex !== -1) {
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
        <FormActions onSave={handleSave} onIssue={handleIssue} />
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

          <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            <p>Death certificate form fields will be added here.</p>
            <p className="text-sm">
              This is a placeholder section for future development.
            </p>
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
