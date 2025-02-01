"use client";

import { Server } from "lucide-react";
import { CloudNodeShell, CloudNodeShellProps } from "./cloud-node-shell";

interface CloudMachineNodeProps {
  data: {
    label: string;
  } & CloudNodeShellProps["specs"];
}

export function CloudMachineNode({
  data: { label, ...specs },
}: CloudMachineNodeProps) {
  return <CloudNodeShell label={label} icon={Server} specs={specs} />;
}
