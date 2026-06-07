"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreateTaskForm from "../components/createTaskForm";

interface CreateTaskModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskModal({ isOpen, onOpenChange }: CreateTaskModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden border-none bg-transparent shadow-none sm:rounded-xl">
        <CreateTaskForm onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}