import { Code } from "@/components/ui/code";

const example = `# Example infrastructure
machines:
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
      - database`;

export default function DocsPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Documentation</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="text-muted-foreground mb-4">
          Cloud Text2Diagram is a tool that helps you document your cloud
          infrastructure using a simple text format. The tool is
          vendor-agnostic, meaning it uses generic terms instead of specific
          tools from cloud providers.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Text Format</h2>
        <p className="text-muted-foreground mb-4">
          The text format is based on YAML and consists of three main sections:
        </p>
        <ul className="list-disc list-inside mb-4 text-muted-foreground">
          <li className="mb-2">
            <code className="text-sm bg-muted px-1 py-0.5 rounded">
              machines
            </code>{" "}
            - Define compute instances
          </li>
          <li className="mb-2">
            <code className="text-sm bg-muted px-1 py-0.5 rounded">
              databases
            </code>{" "}
            - Define database instances
          </li>
          <li className="mb-2">
            <code className="text-sm bg-muted px-1 py-0.5 rounded">
              networks
            </code>{" "}
            - Define networks and their relationships
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Example</h2>
        <Code>{example}</Code>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Syntax Reference</h2>

        <h3 className="text-xl font-semibold mb-3">Machines</h3>
        <p className="text-muted-foreground mb-4">Each machine can have:</p>
        <ul className="list-disc list-inside mb-4 text-muted-foreground">
          <li className="mb-2">
            <code className="text-sm bg-muted px-1 py-0.5 rounded">type</code> -
            Always &quot;compute&quot;
          </li>
          <li className="mb-2">
            <code className="text-sm bg-muted px-1 py-0.5 rounded">
              connections
            </code>{" "}
            - List of connections to other resources
          </li>
          <li className="mb-2">
            <code className="text-sm bg-muted px-1 py-0.5 rounded">specs</code>{" "}
            - Machine specifications (cpu, memory, etc.)
          </li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Databases</h3>
        <p className="text-muted-foreground mb-4">Each database can have:</p>
        <ul className="list-disc list-inside mb-4 text-muted-foreground">
          <li className="mb-2">
            <code className="text-sm bg-muted px-1 py-0.5 rounded">type</code> -
            Always &quot;database&quot;
          </li>
          <li className="mb-2">
            <code className="text-sm bg-muted px-1 py-0.5 rounded">specs</code>{" "}
            - Database specifications (engine, version, storage, etc.)
          </li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Networks</h3>
        <p className="text-muted-foreground mb-4">Each network can have:</p>
        <ul className="list-disc list-inside mb-4 text-muted-foreground">
          <li className="mb-2">
            <code className="text-sm bg-muted px-1 py-0.5 rounded">type</code> -
            Always &quot;network&quot;
          </li>
          <li className="mb-2">
            <code className="text-sm bg-muted px-1 py-0.5 rounded">specs</code>{" "}
            - Network specifications (cidr, etc.)
          </li>
          <li className="mb-2">
            <code className="text-sm bg-muted px-1 py-0.5 rounded">
              contains
            </code>{" "}
            - List of resources that belong to this network
          </li>
        </ul>
      </section>
    </div>
  );
}
