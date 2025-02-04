"use client";

import { HardDrive } from "lucide-react";
import { CloudNodeShell, CloudNodeShellProps } from "./cloud-node-shell";
import { nodeColors } from "@/lib/node-colors";

type Props = Omit<CloudNodeShellProps, "icon" | "color">;

export function CloudStorageNode(props: Props) {
  return (
    <CloudNodeShell {...props} icon={HardDrive} color={nodeColors.storage} />
  );
}
