"use client";

import { Database } from "lucide-react";
import { CloudNodeShell } from "./cloud-node-shell";

interface CloudDatabaseNodeProps {
  data: {
    label: string;
    engine?: string;
    version?: string;
    storage?: string;
  };
}

export function CloudDatabaseNode({ data }: CloudDatabaseNodeProps) {
  const specs = {
    ...(data.engine && { engine: data.engine }),
    ...(data.version && { version: data.version }),
    ...(data.storage && { storage: data.storage }),
  };

  return <CloudNodeShell label={data.label} icon={Database} specs={specs} />;
}
