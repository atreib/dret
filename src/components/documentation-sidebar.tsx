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

export function DocumentationSidebar({ children }: DocumentationSidebarProps) {
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

          <div>
            <h3 className="font-medium mb-2">Text Format</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Use YAML to describe your infrastructure. Define machines,
              databases, and networks.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Example</h3>
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
          </div>

          <div>
            <h3 className="font-medium mb-2">Syntax Reference</h3>
            <div className="space-y-6 text-sm text-slate-500 dark:text-slate-400">
              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Machines
                </h4>
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
              </div>

              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Databases
                </h4>
                <div className="space-y-2">
                  <p>
                    Define database instances with the following attributes:
                  </p>
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
              </div>

              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Networks
                </h4>
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
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
