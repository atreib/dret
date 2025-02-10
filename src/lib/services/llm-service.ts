import {
  LLMServiceError,
  LLMErrorCode,
  ERROR_MESSAGES,
} from "../errors/llm-errors";
import { settingsRepository } from "../db/models/settings";

export class LLMService {
  private static readonly TIMEOUT_MS = 30000; // 30 second timeout
  private static readonly MAX_RETRIES = 2;

  private static readonly SYSTEM_PROMPT = `You are an expert cloud infrastructure architect. Your task is to convert natural language descriptions into YAML that follows this specific format:

Elements can be of these types:
- compute: VMs or servers with cpu and memory specs
- database: Database instances with engine, version, and storage
- loadbalancer: Load balancers with protocol and algorithm
- storage: Object storage with capacity
- queue: Message queues with type and throughput
- cdn: Content Delivery Networks with origin and caching
- apigateway: API Gateways with auth and rate limiting
- firewall: Network security with inbound/outbound rules

Elements should be grouped into networks with CIDR ranges.
Elements can have connections to other elements with specific protocols and ports.

IMPORTANT: Connections are ONE-WAY (source -> target) and should only be defined in the source element. Do not define reverse connections.
For example:
- If a load balancer distributes traffic to app servers, only the load balancer should have connections to the app servers
- If an app server connects to a database, only the app server should have a connection to the database
- Never define connections in both directions between two elements

The YAML should follow this structure:
elements:
  load-balancer-example:
    type: loadbalancer
    specs:
      protocol: http
      algorithm: round-robin
    metadata:
      position:
        x: [number]
        y: [number]
    connections:
      - to: app-server-1    # Connection defined here in the source
        protocols:
          http: 8080
      - to: app-server-2    # Connection defined here in the source
        protocols:
          http: 8080
  
  app-server-1:
    type: compute
    specs:
      cpu: 4
      memory: 8GB
    metadata:
      position:
        x: [number]
        y: [number]
    connections:
      - to: database    # Only app server defines connection to database
        protocols:
          postgresql: 5432
  
  app-server-2:
    type: compute
    specs:
      cpu: 4
      memory: 8GB
    metadata:
      position:
        x: [number]
        y: [number]
    connections:
      - to: database    # Only app server defines connection to database
        protocols:
          postgresql: 5432
  
  database:
    type: database      # No connections defined here as it's only a target
    specs:
      engine: postgresql
      version: "15"
      storage: 100GB
    metadata:
      position:
        x: [number]
        y: [number]

networks:
  network-example:
    specs:
      cidr: [cidr-range]
    metadata:
      position:
        x: [number]
        y: [number]
      size:
        width: [number]
        height: [number]
    contains:
      - [element-name]

Generate a complete and valid YAML that includes all necessary components and their connections. Use realistic values for specs and ensure all required fields are present.

IMPORTANT: 
1. Return ONLY the YAML content without any additional text or markdown formatting
2. Remember that connections are ONE-WAY (source -> target) and should only be defined in the source element
3. Never define reverse/duplicate connections between elements`;

  private static extractYAMLFromResponse(response: string): string {
    // Try to extract YAML from markdown code blocks first
    const yamlMatch = response.match(/```(?:yaml)?\n([\s\S]*?)```/);
    if (yamlMatch) {
      return yamlMatch[1].trim();
    }

    // If no code blocks found, check if the response looks like YAML
    if (this.isValidInfrastructureYAML(response)) {
      return response.trim();
    }

    throw new LLMServiceError(
      ERROR_MESSAGES[LLMErrorCode.INVALID_RESPONSE_FORMAT],
      LLMErrorCode.INVALID_RESPONSE_FORMAT
    );
  }

  static async generateInfrastructure(prompt: string): Promise<string> {
    if (!prompt.trim()) {
      throw new LLMServiceError(
        ERROR_MESSAGES[LLMErrorCode.PROMPT_EMPTY],
        LLMErrorCode.PROMPT_EMPTY
      );
    }

    if (prompt.length > 4000) {
      throw new LLMServiceError(
        ERROR_MESSAGES[LLMErrorCode.PROMPT_TOO_LONG],
        LLMErrorCode.PROMPT_TOO_LONG
      );
    }

    const settings = await settingsRepository.getCurrentSettings();

    if (!settings.apiKey?.trim()) {
      throw new LLMServiceError(
        "Please set your API key in settings to use this feature",
        LLMErrorCode.INVALID_API_KEY
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${settings.apiKey}`,
          },
          body: JSON.stringify({
            model: settings.llmModel,
            messages: [
              { role: "system", content: this.SYSTEM_PROMPT },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 2000,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        switch (response.status) {
          case 401:
            throw new LLMServiceError(
              ERROR_MESSAGES[LLMErrorCode.INVALID_API_KEY],
              LLMErrorCode.INVALID_API_KEY
            );
          case 429:
            throw new LLMServiceError(
              ERROR_MESSAGES[LLMErrorCode.API_RATE_LIMIT],
              LLMErrorCode.API_RATE_LIMIT
            );
          default:
            throw new LLMServiceError(
              `API request failed: ${response.statusText}`,
              LLMErrorCode.UNKNOWN_ERROR,
              errorData
            );
        }
      }

      const data = await response.json();
      const rawResponse = data.choices[0].message.content;

      // Extract and validate YAML from the response
      const yaml = this.extractYAMLFromResponse(rawResponse);
      return yaml;
    } catch (err: unknown) {
      if (err instanceof LLMServiceError) {
        throw err;
      }

      const error = err as Error;

      if (error.name === "AbortError") {
        throw new LLMServiceError(
          ERROR_MESSAGES[LLMErrorCode.API_TIMEOUT],
          LLMErrorCode.API_TIMEOUT
        );
      }

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new LLMServiceError(
          ERROR_MESSAGES[LLMErrorCode.NETWORK_ERROR],
          LLMErrorCode.NETWORK_ERROR
        );
      }

      throw new LLMServiceError(
        ERROR_MESSAGES[LLMErrorCode.UNKNOWN_ERROR],
        LLMErrorCode.UNKNOWN_ERROR,
        error instanceof Error
          ? { message: error.message, stack: error.stack }
          : error
      );
    }
  }

  private static isValidInfrastructureYAML(yaml: string): boolean {
    try {
      // Basic validation that the YAML contains required top-level keys
      return (
        yaml.includes("elements:") &&
        yaml.includes("networks:") &&
        yaml.includes("type:") &&
        yaml.includes("specs:")
      );
    } catch {
      return false;
    }
  }
}
