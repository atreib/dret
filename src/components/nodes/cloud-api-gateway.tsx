"use client";

import { Router } from "lucide-react";
import { CloudNodeShell, CloudNodeShellProps } from "./cloud-node-shell";
import { nodeColors } from "@/lib/node-colors";

interface CloudApiGatewayNodeProps {
  data: {
    label: string;
  } & CloudNodeShellProps["specs"];
}

export function CloudApiGatewayNode({
  data: { label, ...specs },
}: CloudApiGatewayNodeProps) {
  return (
    <CloudNodeShell
      label={label}
      icon={Router}
      specs={specs}
      color={nodeColors.apiGateway}
    />
  );
}
