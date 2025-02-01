"use client";

import { Database } from "lucide-react";
import { CloudNodeShell, CloudNodeShellProps } from "./cloud-node-shell";

interface CloudDatabaseNodeProps {
  data: {
    label: string;
  } & CloudNodeShellProps["specs"];
}

export function CloudDatabaseNode({
  data: { label, ...specs },
}: CloudDatabaseNodeProps) {
  return <CloudNodeShell label={label} icon={Database} specs={specs} />;
}
