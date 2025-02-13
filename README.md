# Cloudret

A modern web application that converts cloud infrastructure text descriptions into interactive diagrams and vice versa. Built with Next.js, React Flow, and TypeScript.

![Cloudret Demo](docs/demo.gif)

## Features

- 🔄 Bidirectional conversion between YAML and diagrams
- 🎨 Interactive diagram editor with drag-and-drop interface
- 📝 Real-time YAML editor with syntax highlighting
- 🌙 Dark/Light mode support
- 🎯 Snap-to-grid and auto-layout functionality
- 🔌 Support for various cloud infrastructure elements
- 🚀 Generate Terraform configurations for AWS, GCP, and Azure

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cloud-text2diagram.git

# Navigate to the project directory
cd cloud-text2diagram

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.

## Usage

### YAML Format

The application uses a simple YAML format to describe cloud infrastructure:

```yaml
elements:
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
      - database
```

### Available Element Types

- **Compute** (`type: compute`): Virtual machines or servers with configurable CPU and memory
- **Database** (`type: database`): Database instances with configurable engine and storage
- **Load Balancer** (`type: loadbalancer`): Traffic distribution with protocol and algorithm settings
- **Storage** (`type: storage`): Object storage services with configurable capacity
- **Queue** (`type: queue`): Message queues and brokers (RabbitMQ, Kafka)
- **CDN** (`type: cdn`): Content Delivery Networks for edge caching
- **API Gateway** (`type: apigateway`): API management with auth and rate limiting
- **Firewall** (`type: firewall`): Network security with inbound/outbound rules
- **Network**: Container for grouping related elements with CIDR range

### Terraform Generation

The application can generate Terraform configurations for your cloud infrastructure diagrams. This feature supports:

- **Multiple Cloud Providers**:

  - AWS (using AWS provider)
  - GCP (using Google Cloud provider)
  - Azure (using AzureRM provider)

- **Generated Resources**:
  - Compute instances (EC2, Compute Engine, Virtual Machines)
  - Databases (RDS, Cloud SQL, Azure SQL)
  - Load Balancers (ALB/NLB, Cloud Load Balancing, Azure Load Balancer)
  - Storage (S3, Cloud Storage, Blob Storage)
  - Message Queues (SQS/SNS, Pub/Sub, Service Bus)
  - CDN (CloudFront, Cloud CDN, Azure CDN)
  - API Management (API Gateway, Cloud Endpoints, API Management)
  - Network Security (Security Groups, Firewall Rules, Network Security Groups)
  - Networking (VPC, VPC Networks, Virtual Networks)

To generate Terraform configurations:

1. Create your infrastructure diagram using the visual editor or YAML
2. Click the "Generate Terraform" button in the toolbar
3. Wait for the generation to complete
4. Click "Download Terraform" to save the configuration as `main.tf`

The generated Terraform configurations include:

- Provider configuration
- Resource definitions with best practices
- Network configuration and security
- Required variables with default values
- Output values for important resources

## Developer Guide

### Adding New Element Types

To add a new element type to the infrastructure diagram tool, follow these steps:

1. **Create the Node Component**

   ```typescript
   // src/components/nodes/cloud-[type].tsx
   "use client";
   import { [IconName] } from "lucide-react";
   import { CloudNodeShell, CloudNodeShellProps } from "./cloud-node-shell";

   interface Cloud[Type]NodeProps {
     data: {
       label: string;
     } & CloudNodeShellProps["specs"];
   }

   export function Cloud[Type]Node({
     data: { label, ...specs },
   }: Cloud[Type]NodeProps) {
     return <CloudNodeShell label={label} icon={[IconName]} specs={specs} />;
   }
   ```

2. **Register the Node Type in diagram-editor.tsx**

   - Import the component
   - Add to nodeTypes object
   - Add to the Select dropdown
   - Add default data in the addNode callback

3. **Update Infrastructure Parser**

   - Add type mapping in parseInfrastructureText
   - Add type mapping in generateInfrastructureText

4. **Update Documentation**
   - Add element type description in documentation-sidebar.tsx

### Project Structure

```
src/
├── app/                 # Next.js app router
├── components/
│   ├── nodes/          # Cloud infrastructure node components
│   ├── edges/          # Edge components for connections
│   ├── ui/             # Reusable UI components
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and parsers
└── styles/             # Global styles
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React Flow](https://reactflow.dev/) for the diagram functionality
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Next.js](https://nextjs.org/) for the React framework
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the YAML editing experience

---

Built with ❤️ by André Treib
