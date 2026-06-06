"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import WorkSpaceForm from "./CreateWorkspaceForm";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWorkspaceModal({ isOpen, onOpenChange }: CreateWorkspaceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Create Workspace</DialogTitle>
        </DialogHeader>
        <WorkSpaceForm onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}