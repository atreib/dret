"use client";

import { Shield } from "lucide-react";
import { CloudNodeShell, CloudNodeShellProps } from "./cloud-node-shell";
import { nodeColors } from "@/lib/node-colors";

type Props = Omit<CloudNodeShellProps, "icon" | "color">;

export function CloudFirewallNode(props: Props) {
  return (
    <CloudNodeShell {...props} icon={Shield} color={nodeColors.firewall} />
  );
}
