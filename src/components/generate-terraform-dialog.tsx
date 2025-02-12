"use client";

import * as React from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CodeIcon, Loader2 } from "lucide-react";
import { TerraformService } from "@/lib/services/terraform-service";

interface GenerateTerraformDialogProps {
  content: string;
  onGenerated: (terraform: string) => void;
}

export function GenerateTerraformDialog({
  content,
  onGenerated,
}: GenerateTerraformDialogProps) {
  const [isPending, setIsPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleGenerate = async () => {
    try {
      setIsPending(true);
      setError(null);
      const terraform = await TerraformService.generateTerraform(content);
      onGenerated(terraform);
      setIsOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate Terraform"
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <CodeIcon className="mr-2 h-4 w-4" />
          Export Terraform
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Terraform Configuration</DialogTitle>
          <DialogDescription>
            Generate Terraform configuration for your cloud infrastructure.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button onClick={handleGenerate} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
