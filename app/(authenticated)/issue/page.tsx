"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Eye,
  FileCheck,
  X,
  RotateCcw,
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  types: CertificateType[];
}

interface CertificateType {
  id: string;
  name: string;
  route: string;
}

interface SavedForm {
  id: string;
  savedAt: string;
  data: any;
}

interface IssueFormsStorage {
  birth: SavedForm[];
  death: SavedForm[];
}

const dummyDepartments: Department[] = [
  {
    id: "rural",
    name: "Rural Development",
    types: [
      { id: "birth", name: "Birth Certificate", route: "/birth" },
      { id: "death", name: "Death Certificate", route: "/death" },
    ],
  },
  {
    id: "health",
    name: "Health Department",
    types: [
      { id: "birth", name: "Birth Certificate", route: "/birth" },
      { id: "death", name: "Death Certificate", route: "/death" },
    ],
  },
];

export default function IssuePage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [savedForms, setSavedForms] = useState<SavedForm[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (selectedType) {
      loadSavedForms(selectedType);
    }
  }, [selectedType]);

  const loadSavedForms = (certificateType: string) => {
    try {
      const storedForms = localStorage.getItem("issueForms");
      if (storedForms) {
        const formsData: IssueFormsStorage = JSON.parse(storedForms);
        setSavedForms(
          formsData[certificateType as keyof IssueFormsStorage] || []
        );
      } else {
        setSavedForms([]);
      }
    } catch (error) {
      console.error("Error loading saved forms:", error);
      setSavedForms([]);
    }
  };

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    setSelectedType("");
    setSavedForms([]);
  };

  const getAvailableTypes = (): CertificateType[] => {
    const department = dummyDepartments.find(
      (d) => d.id === selectedDepartment
    );
    return department?.types || [];
  };

  const handleAddNewForm = () => {
    const types = getAvailableTypes();
    const selectedTypeObj = types.find((t) => t.id === selectedType);
    if (selectedTypeObj) {
      router.push(`/issue/${selectedTypeObj.route}`);
    }
  };

  const handleEditForm = (formId: string) => {
    const types = getAvailableTypes();
    const selectedTypeObj = types.find((t) => t.id === selectedType);
    if (selectedTypeObj) {
      router.push(`/issue/${selectedTypeObj.route}?edit=${formId}`);
    }
  };

  const handlePreviewForm = (formId: string) => {
    // TODO: Implement preview functionality
    console.log("Preview form:", formId);
  };

  const handleIssueForm = (formId: string) => {
    // TODO: Implement issue functionality
    console.log("Issue form:", formId);
  };

  const handleRevokeForm = (formId: string) => {
    // TODO: Implement revoke functionality
    console.log("Revoke form:", formId);
  };

  const handleReissueForm = (formId: string) => {
    // TODO: Implement reissue functionality
    console.log("Reissue form:", formId);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Issue</h1>

      <div className="flex gap-4">
        <Select
          value={selectedDepartment}
          onValueChange={handleDepartmentChange}
        >
          <SelectTrigger className="w-sm">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            {dummyDepartments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedType}
          onValueChange={setSelectedType}
          disabled={!selectedDepartment}
        >
          <SelectTrigger className="w-sm">
            <SelectValue placeholder="Select Document Type" />
          </SelectTrigger>
          <SelectContent>
            {getAvailableTypes().map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedType && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Saved Forms
              <Button onClick={handleAddNewForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Form
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {savedForms.length > 0 ? (
              <div className="space-y-3">
                {savedForms.map((form) => (
                  <div
                    key={form.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">Form ID: {form.id}</div>
                      <div className="text-sm text-muted-foreground">
                        Saved At: {new Date(form.savedAt).toLocaleString()}
                      </div>
                      <Badge variant="secondary">Saved, not Issued</Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditForm(form.id)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          EDIT
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handlePreviewForm(form.id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          PREVIEW
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleIssueForm(form.id)}
                        >
                          <FileCheck className="w-4 h-4 mr-2" />
                          ISSUE
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRevokeForm(form.id)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          REVOKE
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleReissueForm(form.id)}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          REISSUE
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No saved forms found. Click "Add New Form" to create one.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
