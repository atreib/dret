"use client";

import { MessageSquare } from "lucide-react";
import { CloudNodeShell, CloudNodeShellProps } from "./cloud-node-shell";
import { nodeColors } from "@/lib/node-colors";

type Props = Omit<CloudNodeShellProps, "icon" | "color">;

export function CloudQueueNode(props: Props) {
  return (
    <CloudNodeShell {...props} icon={MessageSquare} color={nodeColors.queue} />
  );
}
