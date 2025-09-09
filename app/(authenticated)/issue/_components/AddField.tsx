"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddFieldProps {
  onAddField: () => void;
}

export default function AddField({ onAddField }: AddFieldProps) {
  return (
    <div className="flex justify-center">
      <Button variant="outline" onClick={onAddField}>
        <Plus className="w-4 h-4 mr-2" />
        Add More Field
      </Button>
    </div>
  );
}
