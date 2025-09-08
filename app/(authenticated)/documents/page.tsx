"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Document {
  id: string;
  name: string;
  type: string;
  department: string;
  uploadDate: string;
  url: string; // Added URL field for document links
}

const dummyDocuments: Document[] = [
  {
    id: "DOC001",
    name: "Aadhaar Card - Rahul Sharma",
    type: "Identity Proof",
    department: "HR",
    uploadDate: "2024-01-15",
    url: "/docs/aadhaar-rahul-sharma.pdf",
  },
  {
    id: "DOC002",
    name: "PAN Card - John Doe",
    type: "Tax Document",
    department: "Finance",
    uploadDate: "2024-01-14",
    url: "/docs/pan-john-doe.pdf",
  },
  {
    id: "DOC003",
    name: "Passport - Jane Smith",
    type: "Identity Proof",
    department: "HR",
    uploadDate: "2024-01-13",
    url: "/docs/passport-jane-smith.pdf",
  },
  {
    id: "DOC004",
    name: "Bank Statement - Alice Johnson",
    type: "Financial Document",
    department: "Finance",
    uploadDate: "2024-01-12",
    url: "/docs/bank-statement-alice-johnson.pdf",
  },
  {
    id: "DOC005",
    name: "Salary Certificate - Bob Wilson",
    type: "Employment Document",
    department: "HR",
    uploadDate: "2024-01-11",
    url: "/docs/salary-certificate-bob-wilson.pdf",
  },
  {
    id: "DOC006",
    name: "Tax Return - Charlie Brown",
    type: "Tax Document",
    department: "Finance",
    uploadDate: "2024-01-10",
    url: "/docs/tax-return-charlie-brown.pdf",
  },
  {
    id: "DOC007",
    name: "Medical Certificate - Diana Prince",
    type: "Medical Document",
    department: "Operations",
    uploadDate: "2024-01-09",
    url: "/docs/medical-certificate-diana-prince.pdf",
  },
  {
    id: "DOC008",
    name: "Insurance Policy - Eve Adams",
    type: "Insurance Document",
    department: "Operations",
    uploadDate: "2024-01-08",
    url: "/docs/insurance-policy-eve-adams.pdf",
  },
];

const departmentDocumentTypes: Record<string, string[]> = {
  HR: ["Identity Proof", "Employment Document"],
  Finance: ["Tax Document", "Financial Document"],
  Operations: ["Medical Document", "Insurance Document"],
};

export default function DocumentsPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [availableDocumentTypes, setAvailableDocumentTypes] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (selectedDepartment) {
      setAvailableDocumentTypes(
        departmentDocumentTypes[selectedDepartment] || []
      );
      setSelectedDocumentType(""); // Reset document type when department changes
    } else {
      setAvailableDocumentTypes([]);
      setSelectedDocumentType("");
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedDepartment && selectedDocumentType) {
      const filtered = dummyDocuments.filter(
        (doc) =>
          doc.department === selectedDepartment &&
          doc.type === selectedDocumentType
      );
      setFilteredDocuments(filtered);
    } else {
      setFilteredDocuments([]);
    }
  }, [selectedDepartment, selectedDocumentType]);

  const handleViewDocument = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Documents</h1>
        <p className="text-muted-foreground">
          Manage your document verification
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="min-w-sm">
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-sm">
          <Select
            value={selectedDocumentType}
            onValueChange={setSelectedDocumentType}
            disabled={!selectedDepartment}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Document Type" />
            </SelectTrigger>
            <SelectContent>
              {availableDocumentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedDepartment && selectedDocumentType && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Documents ({filteredDocuments.length} found)
          </h3>

          {filteredDocuments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document ID</TableHead>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.id}</TableCell>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocument(doc.url)}
                      >
                        View Document
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No documents found for the selected filters.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
