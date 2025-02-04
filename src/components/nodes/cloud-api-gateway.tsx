"use client";

import { Router } from "lucide-react";
import { CloudNodeShell, CloudNodeShellProps } from "./cloud-node-shell";
import { nodeColors } from "@/lib/node-colors";

type Props = Omit<CloudNodeShellProps, "icon" | "color">;

export function CloudApiGatewayNode(props: Props) {
  return (
    <CloudNodeShell {...props} icon={Router} color={nodeColors.apiGateway} />
  );
}
