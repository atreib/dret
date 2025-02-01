"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface DocumentationSidebarProps {
  children: React.ReactNode;
}

const sections = [
  {
    title: "Elements",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Elements are the building blocks of your infrastructure. Each element
          has a type, customizable specs, and optional connections to other
          elements.
        </p>

        <div className="space-y-2">
          <h4 className="font-medium">Available Types</h4>
          <div className="pl-4 space-y-2">
            <p>
              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                type: compute
              </code>{" "}
              - Compute instances like VMs or servers
            </p>
            <p>
              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                type: database
              </code>{" "}
              - Database instances (PostgreSQL, Redis, etc.)
            </p>
            <p>
              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                type: loadbalancer
              </code>{" "}
              - Load balancers for traffic distribution
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Specs</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The specs section accepts any key-value pairs. Use it to define
            properties specific to your element:
          </p>
          <pre className="text-xs p-2 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-auto">
            {`specs:
  cpu: 2           # example for compute
  memory: "4GB"    # example for compute
  engine: "redis"  # example for database
  protocol: "http" # example for loadbalancer`}
          </pre>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Connections</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Connect elements to each other using the connections array.
            Optionally specify a port to label the connection:
          </p>
          <pre className="text-xs p-2 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-auto">
            {`connections:
  - to: database    # basic connection
    port: 5432      # optional port number
  - to: cache       # multiple connections
    port: 6379      # are supported`}
          </pre>
        </div>
      </div>
    ),
  },
  {
    title: "Networks",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Networks define the topology of your infrastructure by grouping
          related elements together.
        </p>

        <div className="space-y-2">
          <h4 className="font-medium">Network Specs</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Networks only accept CIDR range in their specs:
          </p>
          <pre className="text-xs p-2 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-auto">
            {`specs:
  cidr: "10.0.0.0/16"  # required CIDR range`}
          </pre>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Contains</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Use the contains array to specify which elements belong to this
            network:
          </p>
          <pre className="text-xs p-2 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-auto">
            {`contains:
  - web-server
  - database
  - cache`}
          </pre>
        </div>
      </div>
    ),
  },
  {
    title: "Example",
    content: (
      <pre className="text-xs p-4 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-auto">
        {`elements:
  web-server:
    type: compute
    specs:
      cpu: 2
      memory: "4GB"
    connections:
      - to: database
        port: 5432

  database:
    type: database
    specs:
      engine: postgresql
      version: "14"
      storage: "100GB"

networks:
  main-vpc:
    specs:
      cidr: "10.0.0.0/16"
    contains:
      - web-server
      - database`}
      </pre>
    ),
  },
];

export function DocumentationSidebar({ children }: DocumentationSidebarProps) {
  return (
    <Sheet>
      {children}
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Documentation</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 pr-6 mt-6">
          <div className="space-y-6">
            {sections.map((section) => (
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
