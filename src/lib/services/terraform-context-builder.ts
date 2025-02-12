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
- Use aws provider with appropriate region and the following LocalStack configuration:
  - access_key = "test"
  - secret_key = "test"
  - region = "us-east-1"
  - skip_credentials_validation = true
  - skip_metadata_api_check = true
  - skip_requesting_account_id = true
  - endpoints configuration block with:
    - apigateway = "http://localhost:4566"
    - dynamodb = "http://localhost:4566"
    - ec2 = "http://localhost:4566"
    - iam = "http://localhost:4566"
    - lambda = "http://localhost:4566"
    - rds = "http://localhost:4566"
    - route53 = "http://localhost:4566"
    - s3 = "http://s3.localhost.localstack.cloud:4566"
    - sns = "http://localhost:4566"
    - sqs = "http://localhost:4566"
    - sts = "http://localhost:4566"
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
    const localstackRequirement =
      cloudProvider === "AWS"
        ? `
12. For LocalStack compatibility:
    - Configure ALL service endpoints in the provider block to use "http://localhost:4566"
    - Include endpoints for ALL AWS services being used (ec2, iam, s3, sts, etc.)
    - Do not use service-specific subdomains (like s3.localhost.localstack.cloud)
    - Include skip_credentials_validation = true, skip_metadata_api_check = true, and skip_requesting_account_id = true
    - Use "test" for both access_key and secret_key`
        : "";

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
10. IMPORTANT: Ensure there are no cyclic dependencies between resources. Resources should have a clear, one-directional dependency chain. For example:
    - If resource A depends on B and B depends on C, do not make C depend on A
    - Use data sources instead of resource references when possible to break potential cycles
    - Structure resource dependencies to follow a logical, hierarchical order (networking -> security -> compute -> applications)
11. For aws_db_instance with engine = "postgres", do NOT include the name argument, as PostgreSQL does not support it.${localstackRequirement}

Return ONLY the Terraform configuration without any additional text or markdown formatting.`;
  }
}
