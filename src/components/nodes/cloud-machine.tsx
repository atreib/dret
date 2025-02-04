"use client";

import { Server } from "lucide-react";
import { CloudNodeShell, CloudNodeShellProps } from "./cloud-node-shell";
import { nodeColors } from "@/lib/node-colors";

type Props = Omit<CloudNodeShellProps, "icon" | "color">;

export function CloudMachineNode(props: Props) {
  return <CloudNodeShell {...props} icon={Server} color={nodeColors.machine} />;
}
