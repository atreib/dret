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
        Use YAML to describe your infrastructure. Define compute resources under
        &quot;elements&quot; and network topology under &quot;networks&quot;.
      </p>
    ),
  },
  {
    title: "Example",
    content: (
      <pre className="text-xs p-4 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-auto">
        {`elements:
  web-server-1:
    type: compute
    specs:
      cpu: 2
      memory: 4GB
    connections:
      - to: database
        port: 5432

  database:
    type: database
    specs:
      engine: postgresql
      version: "14"
      storage: 100GB

networks:
  main-vpc:
    specs:
      cidr: 10.0.0.0/16
    contains:
      - web-server-1
      - database`}
      </pre>
    ),
  },
  {
    title: "Elements",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Elements represent compute resources like machines, databases, and
          load balancers. Each element has a type, specs, and optional
          connections.
        </p>

        <div>
          <h4 className="font-medium mb-2">Compute (type: compute)</h4>
          <div className="pl-4 space-y-1">
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
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Database (type: database)</h4>
          <div className="pl-4 space-y-1">
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

        <div>
          <h4 className="font-medium mb-2">
            Load Balancer (type: loadbalancer)
          </h4>
          <div className="pl-4 space-y-1">
            <p>
              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                specs:
              </code>
            </p>
            <div className="pl-4 space-y-1">
              <p>
                <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                  protocol: string
                </code>{" "}
                - Protocol (e.g., &quot;http&quot;, &quot;tcp&quot;)
              </p>
              <p>
                <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                  port: number
                </code>{" "}
                - Listening port
              </p>
              <p>
                <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                  algorithm: string
                </code>{" "}
                - Load balancing algorithm (e.g., &quot;round-robin&quot;,
                &quot;least-connections&quot;)
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Networks",
    content: (
      <div className="space-y-2">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Networks define the topology of your infrastructure, grouping related
          elements together.
        </p>
        <div className="pl-4 space-y-1">
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
            - List of element IDs that belong to this network
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Connections",
    content: (
      <div className="space-y-2">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Elements can be connected to each other using connections. Networks
          don&apos;t have connections, they contain elements.
        </p>
        <div className="pl-4 space-y-1">
          <p>
            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
              connections:
            </code>
          </p>
          <div className="pl-4 space-y-1">
            <p>
              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                to: string
              </code>{" "}
              - Target element ID
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
