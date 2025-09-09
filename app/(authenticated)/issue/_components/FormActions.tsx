"use client";

import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface FormActionsProps {
  onSave: () => void;
  saveDisabled?: boolean;
}

export default function FormActions({
  onSave,
  saveDisabled = false,
}: FormActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onSave} disabled={saveDisabled}>
        <Save className="w-4 h-4 mr-2" />
        Save
      </Button>
    </div>
  );
}
