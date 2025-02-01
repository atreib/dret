"use client";

import { BarChart2 } from "lucide-react";
import { CloudNodeShell, CloudNodeShellProps } from "./cloud-node-shell";
import { nodeColors } from "@/lib/node-colors";

interface CloudLoadBalancerNodeProps {
  data: {
    label: string;
  } & CloudNodeShellProps["specs"];
}

export function CloudLoadBalancerNode({
  data: { label, ...specs },
}: CloudLoadBalancerNodeProps) {
  return (
    <CloudNodeShell
      label={label}
      icon={BarChart2}
      specs={specs}
      color={nodeColors.loadBalancer}
    />
  );
}
