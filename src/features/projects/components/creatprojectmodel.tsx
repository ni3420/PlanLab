"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreateProjectForm from "./createprojectform";

interface CreateProjectModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectModal({ isOpen, onOpenChange }: CreateProjectModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none sm:rounded-xl">
        <CreateProjectForm onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}