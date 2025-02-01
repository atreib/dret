"use client";

import { HardDrive } from "lucide-react";
import { CloudNodeShell, CloudNodeShellProps } from "./cloud-node-shell";

interface CloudStorageNodeProps {
  data: {
    label: string;
  } & CloudNodeShellProps["specs"];
}

export function CloudStorageNode({
  data: { label, ...specs },
}: CloudStorageNodeProps) {
  return <CloudNodeShell label={label} icon={HardDrive} specs={specs} />;
}
