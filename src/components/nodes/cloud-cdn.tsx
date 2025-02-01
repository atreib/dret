"use client";

import { Globe } from "lucide-react";
import { CloudNodeShell, CloudNodeShellProps } from "./cloud-node-shell";
import { nodeColors } from "@/lib/node-colors";

interface CloudCdnNodeProps {
  data: {
    label: string;
  } & CloudNodeShellProps["specs"];
}

export function CloudCdnNode({ data: { label, ...specs } }: CloudCdnNodeProps) {
  return (
    <CloudNodeShell
      label={label}
      icon={Globe}
      specs={specs}
      color={nodeColors.cdn}
    />
  );
}
