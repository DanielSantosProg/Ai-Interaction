"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X, AlertCircle } from "lucide-react";

interface AlertDialogErrorProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export function AlertDialogError({ isOpen, message, onClose }: AlertDialogErrorProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="border-1 border-red-500">
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="text-red-500 flex items-center gap-2">
              <AlertCircle className="text-red-500" size={24} />
              Erro!
            </AlertDialogTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              className="p-1 h-fit text-gray-500 hover:text-red-500"
            >
              <X size={18} />
            </Button>
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-[14px] text-[#323232]">
          {message}
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
}