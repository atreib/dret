"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
            <p>
              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                type: storage
              </code>{" "}
              - Object storage services (S3, Blob Storage)
            </p>
            <p>
              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                type: queue
              </code>{" "}
              - Message queues and brokers (RabbitMQ, Kafka)
            </p>
            <p>
              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                type: cdn
              </code>{" "}
              - Content Delivery Networks for edge caching
            </p>
            <p>
              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                type: apigateway
              </code>{" "}
              - API Gateways for managing API endpoints
            </p>
            <p>
              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                type: firewall
              </code>{" "}
              - Firewalls and security groups for network security
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
  protocol: "http" # example for loadbalancer
  type: "rabbitmq" # example for queue
  origin: "example.com" # example for cdn
  auth: ["jwt"]    # example for apigateway
  inbound: ["80/tcp"] # example for firewall`}
          </pre>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Metadata</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The metadata section stores visual layout information. This is used
            to preserve node positions and sizes when switching between text and
            diagram views:
          </p>
          <pre className="text-xs p-2 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-auto">
            {`metadata:
  position:        # position in the diagram
    x: 100        # x coordinate
    y: 200        # y coordinate
  size:           # only for networks
    width: 400    # network width
    height: 300   # network height`}
          </pre>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Connections</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Connect elements to each other using the connections array. Each
            connection can specify multiple protocols with their respective
            ports:
          </p>
          <pre className="text-xs p-2 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-auto">
            {`connections:
  - to: database    # target element
    protocols:      # protocol definitions
      postgresql: 5432  # protocol: port
      http: 8080       # multiple protocols
  - to: cache      
    protocols:
      tcp: 6379    # basic tcp connection`}
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
    metadata:
      position:
        x: 100
        y: 200
    connections:
      - to: database
        protocols:
          postgresql: 5432
          http: 8080

  database:
    type: database
    specs:
      engine: postgresql
      version: "14"
      storage: "100GB"
    metadata:
      position:
        x: 300
        y: 200

networks:
  main-vpc:
    specs:
      cidr: "10.0.0.0/16"
    metadata:
      position:
        x: 50
        y: 100
      size:
        width: 400
        height: 300
    contains:
      - web-server
      - database`}
      </pre>
    ),
  },
];

export function DocumentationSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
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
