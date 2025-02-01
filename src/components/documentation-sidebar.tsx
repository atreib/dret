"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DocumentationSidebarProps {
  children: React.ReactNode;
}

const sections = [
  {
    title: "Text Format",
    content: (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Use YAML to describe your infrastructure. Define machines, databases,
        and networks.
      </p>
    ),
  },
  {
    title: "Example",
    content: (
      <pre className="text-xs p-4 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-auto">
        {`machines:
  web-server:
    type: compute
    connections:
      - to: database
        port: 5432
    specs:
      cpu: 2
      memory: 4GB

databases:
  database:
    type: database
    specs:
      engine: postgresql
      version: "14"
      storage: 100GB

networks:
  main-vpc:
    type: network
    specs:
      cidr: 10.0.0.0/16
    contains:
      - web-server
      - database`}
      </pre>
    ),
  },
  {
    title: "Machines",
    content: (
      <div className="space-y-2">
        <p>Define compute instances with the following attributes:</p>
        <div className="pl-4 space-y-1">
          <p>
            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
              type: compute
            </code>{" "}
            (required)
          </p>
          <p>
            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
              specs:
            </code>
          </p>
          <div className="pl-4 space-y-1">
            <p>
              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                cpu: number
              </code>{" "}
              - Number of CPU cores
            </p>
            <p>
              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                memory: string
              </code>{" "}
              - Memory size (e.g., &quot;4GB&quot;, &quot;8GB&quot;)
            </p>
          </div>
          <p>
            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
              connections:
            </code>{" "}
            (optional)
          </p>
          <div className="pl-4 space-y-1">
            <p>
              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                to: string
              </code>{" "}
              - Target node ID
            </p>
            <p>
              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                port: number
              </code>{" "}
              - Connection port (optional)
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Databases",
    content: (
      <div className="space-y-2">
        <p>Define database instances with the following attributes:</p>
        <div className="pl-4 space-y-1">
          <p>
            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
              type: database
            </code>{" "}
            (required)
          </p>
          <p>
            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
              specs:
            </code>
          </p>
          <div className="pl-4 space-y-1">
            <p>
              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                engine: string
              </code>{" "}
              - Database engine (e.g., &quot;postgresql&quot;,
              &quot;mysql&quot;)
            </p>
            <p>
              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                version: string
              </code>{" "}
              - Engine version
            </p>
            <p>
              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                storage: string
              </code>{" "}
              - Storage size (e.g., &quot;100GB&quot;)
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Networks",
    content: (
      <div className="space-y-2">
        <p>Define networks with the following attributes:</p>
        <div className="pl-4 space-y-1">
          <p>
            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
              type: network
            </code>{" "}
            (required)
          </p>
          <p>
            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
              specs:
            </code>
          </p>
          <div className="pl-4 space-y-1">
            <p>
              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                cidr: string
              </code>{" "}
              - Network CIDR range (e.g., &quot;10.0.0.0/16&quot;)
            </p>
          </div>
          <p>
            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
              contains:
            </code>{" "}
            (optional)
          </p>
          <div className="pl-4">
            <p>List of node IDs that belong to this network</p>
          </div>
        </div>
      </div>
    ),
  },
];

export function DocumentationSidebar({ children }: DocumentationSidebarProps) {
  const [search, setSearch] = useState("");

  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Sheet>
      {children}
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Documentation</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 pr-6 mt-6">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Learn how to describe your cloud infrastructure using our simple
              text format.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
            <Input
              placeholder="Search documentation..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-6">
            {filteredSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-medium mb-2">{section.title}</h3>
                {section.content}
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
