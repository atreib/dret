"use client";

import { Globe } from "lucide-react";
import { CloudNodeShell, CloudNodeShellProps } from "./cloud-node-shell";
import { nodeColors } from "@/lib/node-colors";

type Props = Omit<CloudNodeShellProps, "icon" | "color">;

export function CloudCdnNode(props: Props) {
  return <CloudNodeShell {...props} icon={Globe} color={nodeColors.cdn} />;
}
