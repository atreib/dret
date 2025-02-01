"use client";

import { MessageSquare } from "lucide-react";
import { CloudNodeShell, CloudNodeShellProps } from "./cloud-node-shell";

interface CloudQueueNodeProps {
  data: {
    label: string;
  } & CloudNodeShellProps["specs"];
}

export function CloudQueueNode({
  data: { label, ...specs },
}: CloudQueueNodeProps) {
  return <CloudNodeShell label={label} icon={MessageSquare} specs={specs} />;
}
