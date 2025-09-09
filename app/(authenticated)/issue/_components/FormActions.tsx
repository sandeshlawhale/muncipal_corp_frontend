"use client";

import { Button } from "@/components/ui/button";
import { Save, FileCheck } from "lucide-react";

interface FormActionsProps {
  onSave: () => void;
  onIssue: () => void;
  saveDisabled?: boolean;
  issueDisabled?: boolean;
}

export default function FormActions({
  onSave,
  onIssue,
  saveDisabled = false,
  issueDisabled = false,
}: FormActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onSave} disabled={saveDisabled}>
        <Save className="w-4 h-4 mr-2" />
        Save
      </Button>
      <Button onClick={onIssue} disabled={issueDisabled}>
        <FileCheck className="w-4 h-4 mr-2" />
        Issue
      </Button>
    </div>
  );
}
