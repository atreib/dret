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
import { CodeIcon, Download } from "lucide-react";
import { TerraformService } from "@/lib/services/terraform-service";
import { RotatingLoadingMessage } from "./ui/rotating-loading-message";
import Link from "next/link";

interface GenerateTerraformDialogProps {
  content: string;
}

export function GenerateTerraformDialog({
  content,
}: GenerateTerraformDialogProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const loadingMessages = [
    "Analyzing your infrastructure diagram...",
    "Converting to Terraform configuration...",
    "Optimizing resource definitions...",
    "Validating infrastructure components...",
    "Generating provider configurations...",
    "Almost there, finalizing your Terraform code...",
  ];

  const dockerComposeContent = `version: "3.8"
services:
  localstack:
    container_name: "localstack"
    image: localstack/localstack
    ports:
      - "4566:4566"
      - "4571:4571"
    environment:
      - DEBUG=1
      - DOCKER_HOST=unix:///var/run/docker.sock
      - AWS_ACCESS_KEY_ID=test
      - AWS_SECRET_ACCESS_KEY=test
      - AWS_DEFAULT_REGION=us-east-1
    volumes:
      - "\${PWD}/terraform:/terraform"
      - "/var/run/docker.sock:/var/run/docker.sock"`;

  const handleDownloadDockerCompose = () => {
    const blob = new Blob([dockerComposeContent], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "docker-compose.yml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async () => {
    try {
      setError(null);
      setIsGenerating(true);
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
      setIsGenerating(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate Terraform";

      if (
        errorMessage.includes("Please set your API key") ||
        errorMessage.includes("Validation failed")
      ) {
        setError(
          "To use this feature, you need to configure your API key in Settings. Click the gear icon in the top right corner to open Settings."
        );
      } else {
        setError(errorMessage);
      }
      setIsGenerating(false);
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

        <div className="space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : isGenerating ? (
            <div className="flex items-center justify-center py-4">
              <RotatingLoadingMessage messages={loadingMessages} />
            </div>
          ) : (
            <Alert variant="default" className="bg-muted/50">
              <AlertTitle>
                Success! Your Terraform file has been downloaded.
              </AlertTitle>
            </Alert>
          )}
        </div>

        <Alert className="w-full overflow-x-auto">
          <AlertTitle className="flex items-center justify-between">
            <span>Test it locally</span>
          </AlertTitle>
          <AlertDescription className="pt-4 space-y-2">
            <p>
              1. We have a docker-compose file you can use to test your
              Terraform locally
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadDockerCompose}
              className="h-8"
            >
              <Download className="mr-2 h-4 w-4" />
              Download docker-compose.yml
            </Button>
            <p>2. Evaluate and finish your Terraform code:</p>
            <ol className="list-inside list-disc">
              <li>Update the Terraform with your endpoint and secrets</li>
            </ol>
            <p>3. Initialize, validate and apply Terraform:</p>
            <pre className="w-full overflow-x-auto bg-muted p-2 rounded-md text-sm">
              terraform init{"\n"}
              terraform validate{"\n"}
              terraform plan{"\n"}
              terraform apply
            </pre>
            <p className="text-sm text-muted-foreground mt-2">
              Note: This is just a quickstart for your Terraform code. Take a
              look at{" "}
              <Link
                className="underline"
                target="_blank"
                href="https://developer.hashicorp.com/terraform/intro"
              >
                Terraform documentation
              </Link>{" "}
              for more information.
            </p>
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
