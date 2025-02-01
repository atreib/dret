"use client";

import { Globe } from "lucide-react";
import { CloudNodeShell, CloudNodeShellProps } from "./cloud-node-shell";

interface CloudCdnNodeProps {
  data: {
    label: string;
  } & CloudNodeShellProps["specs"];
}

export function CloudCdnNode({ data: { label, ...specs } }: CloudCdnNodeProps) {
  return <CloudNodeShell label={label} icon={Globe} specs={specs} />;
}
