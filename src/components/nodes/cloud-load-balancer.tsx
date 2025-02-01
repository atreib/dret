"use client";

import { BarChart2 } from "lucide-react";
import { CloudNodeShell, CloudNodeShellProps } from "./cloud-node-shell";

interface CloudLoadBalancerNodeProps {
  data: {
    label: string;
  } & CloudNodeShellProps["specs"];
}

export function CloudLoadBalancerNode({
  data: { label, ...specs },
}: CloudLoadBalancerNodeProps) {
  return <CloudNodeShell label={label} icon={BarChart2} specs={specs} />;
}
