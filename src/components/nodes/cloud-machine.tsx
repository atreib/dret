"use client";

import { Server } from "lucide-react";
import { CloudNodeShell } from "./cloud-node-shell";

interface CloudMachineNodeProps {
  data: {
    label: string;
    cpu?: number;
    memory?: string;
  };
}

export function CloudMachineNode({ data }: CloudMachineNodeProps) {
  const specs = {
    ...(data.cpu && { cpu: `${data.cpu} cores` }),
    ...(data.memory && { memory: data.memory }),
  };

  return <CloudNodeShell label={data.label} icon={Server} specs={specs} />;
}
