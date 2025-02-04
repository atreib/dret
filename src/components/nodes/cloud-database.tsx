"use client";

import { Database } from "lucide-react";
import { CloudNodeShell, CloudNodeShellProps } from "./cloud-node-shell";
import { nodeColors } from "@/lib/node-colors";

type Props = Omit<CloudNodeShellProps, "icon" | "color">;

export function CloudDatabaseNode(props: Props) {
  return (
    <CloudNodeShell {...props} icon={Database} color={nodeColors.database} />
  );
}
