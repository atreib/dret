"use client";

import { Shield } from "lucide-react";
import { CloudNodeShell, CloudNodeShellProps } from "./cloud-node-shell";
import { nodeColors } from "@/lib/node-colors";

interface CloudFirewallNodeProps {
  data: {
    label: string;
  } & CloudNodeShellProps["specs"];
}

export function CloudFirewallNode({
  data: { label, ...specs },
}: CloudFirewallNodeProps) {
  return (
    <CloudNodeShell
      label={label}
      icon={Shield}
      specs={specs}
      color={nodeColors.firewall}
    />
  );
}
