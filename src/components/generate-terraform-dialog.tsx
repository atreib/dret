"use client";

import * as React from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CodeIcon } from "lucide-react";
import { TerraformService } from "@/lib/services/terraform-service";
import { RotatingLoadingMessage } from "./ui/rotating-loading-message";

interface GenerateTerraformDialogProps {
  content: string;
}

export function GenerateTerraformDialog({
  content,
}: GenerateTerraformDialogProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const loadingMessages = [
    "Analyzing your infrastructure diagram...",
    "Converting to Terraform configuration...",
    "Optimizing resource definitions...",
    "Validating infrastructure components...",
    "Generating provider configurations...",
    "Almost there, finalizing your Terraform code...",
  ];

  const handleGenerate = async () => {
    try {
      setError(null);
      const terraform = await TerraformService.generateTerraform(content);

      // Create and trigger download
      const blob = new Blob([terraform], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "main.tf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate Terraform"
      );
    }
  };

  // Start generation as soon as dialog opens
  React.useEffect(() => {
    if (isOpen) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full lg:w-min">
          <CodeIcon className="mr-2 h-4 w-4" />
          Export Terraform
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generating Terraform Configuration</DialogTitle>
          <DialogDescription>
            Please wait while we generate your Terraform configuration...
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="flex items-center justify-center py-4">
            <RotatingLoadingMessage messages={loadingMessages} />
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
