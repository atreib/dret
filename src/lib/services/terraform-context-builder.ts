import { CloudProviderEnum } from "../db/models/settings";

export class TerraformContextBuilder {
  static buildYAMLSyntaxContext(): string {
    return `You are a cloud infrastructure expert. You understand our YAML syntax for defining cloud infrastructure:

Elements can be of these types:
- compute: VMs or servers with cpu and memory specs
- database: Database instances with engine, version, and storage
- loadbalancer: Load balancers with protocol and algorithm
- storage: Object storage with capacity
- queue: Message queues with type and throughput
- cdn: Content Delivery Networks with origin and caching
- apigateway: API Gateways with auth and rate limiting
- firewall: Network security with inbound/outbound rules

Elements are grouped into networks with CIDR ranges.
Elements can have connections to other elements with specific protocols and ports.`;
  }

  static buildTerraformSyntaxContext(
    cloudProvider: keyof typeof CloudProviderEnum
  ): string {
    const contexts: Record<keyof typeof CloudProviderEnum, string> = {
      AWS: `For AWS, we use the following Terraform patterns:
- Use aws provider with appropriate region
- EC2 instances for compute nodes
- RDS for databases
- ALB/NLB for load balancers
- S3 for storage
- SQS/SNS for queues
- CloudFront for CDN
- API Gateway for API management
- Security Groups for firewalls
- VPC for networks`,
      GCP: `For GCP, we use the following Terraform patterns:
- Use google provider with project and region
- Compute Engine for compute nodes
- Cloud SQL for databases
- Load Balancing for traffic distribution
- Cloud Storage for object storage
- Pub/Sub for queues
- Cloud CDN for content delivery
- Cloud Endpoints for API management
- Firewall rules for network security
- VPC for networks`,
      AZURE: `For Azure, we use the following Terraform patterns:
- Use azurerm provider
- Virtual Machines for compute nodes
- Azure SQL for databases
- Load Balancer for traffic distribution
- Blob Storage for object storage
- Service Bus for queues
- CDN for content delivery
- API Management for API gateway
- Network Security Groups for firewalls
- Virtual Networks for networks`,
    };

    return contexts[cloudProvider];
  }

  static buildUserPrompt(
    yaml: string,
    cloudProvider: keyof typeof CloudProviderEnum
  ): string {
    return `Generate a complete and valid Terraform configuration for the following cloud infrastructure YAML using ${cloudProvider}:

${yaml}

Requirements:
1. Generate the simplest possible Terraform configuration that achieves this infrastructure
2. Include all necessary providers and required resources
3. Use appropriate naming conventions and best practices
4. Handle all necessary networking and security configurations
5. Include necessary IAM roles and permissions
6. Add helpful comments explaining each major section
7. Format the output as valid HCL (HashiCorp Configuration Language)
8. Include any required variables with default values
9. Add outputs for important values (IPs, endpoints, etc.)

Return ONLY the Terraform configuration without any additional text or markdown formatting.`;
  }
}
