"use client";

import { MessageSquare } from "lucide-react";
import { CloudNodeShell, CloudNodeShellProps } from "./cloud-node-shell";
import { nodeColors } from "@/lib/node-colors";

interface CloudQueueNodeProps {
  data: {
    label: string;
  } & CloudNodeShellProps["specs"];
}

export function CloudQueueNode({
  data: { label, ...specs },
}: CloudQueueNodeProps) {
  return (
    <CloudNodeShell
      label={label}
      icon={MessageSquare}
      specs={specs}
      color={nodeColors.queue}
    />
  );
}
