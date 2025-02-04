"use client";

import { BarChart2 } from "lucide-react";
import { CloudNodeShell, CloudNodeShellProps } from "./cloud-node-shell";
import { nodeColors } from "@/lib/node-colors";

type Props = Omit<CloudNodeShellProps, "icon" | "color">;

export function CloudLoadBalancerNode(props: Props) {
  return (
    <CloudNodeShell
      {...props}
      icon={BarChart2}
      color={nodeColors.loadBalancer}
    />
  );
}
