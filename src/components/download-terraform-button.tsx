"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

interface DownloadTerraformButtonProps {
  content: string;
}

export function DownloadTerraformButton({
  content,
}: DownloadTerraformButtonProps) {
  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "main.tf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleDownload} variant="outline">
      <Download className="mr-2 h-4 w-4" />
      Download Terraform
    </Button>
  );
}
