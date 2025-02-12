import { settingsRepository } from "../db/models/settings";
import { TerraformContextBuilder } from "./terraform-context-builder";

export class TerraformService {
  private static readonly TIMEOUT_MS = 60000; // 60 second timeout
  private static readonly MAX_TOKENS = 4000;

  private static stripMarkdownCodeBlock(content: string): string {
    // Remove ```hcl, ```tf, or just ``` tags from start and end
    return content
      .replace(/^```(?:hcl|tf)?\n/, "")
      .replace(/\n```$/, "")
      .trim();
  }

  static async generateTerraform(yaml: string): Promise<string> {
    const settings = await settingsRepository.getCurrentSettings();

    if (!settings.apiKey?.trim()) {
      throw new Error(
        "Please set your API key in settings to use this feature"
      );
    }

    // Convert cloud provider value to uppercase for the enum key
    const cloudProvider = settings.cloudProvider.toUpperCase() as
      | "AWS"
      | "GCP"
      | "AZURE";

    const messages = [
      {
        role: "system",
        content: TerraformContextBuilder.buildYAMLSyntaxContext(),
      },
      {
        role: "system",
        content:
          TerraformContextBuilder.buildTerraformSyntaxContext(cloudProvider),
      },
      {
        role: "user",
        content: TerraformContextBuilder.buildUserPrompt(yaml, cloudProvider),
      },
    ];

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
            messages,
            temperature: 0.2, // Lower temperature for more deterministic output
            max_tokens: this.MAX_TOKENS,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Please set your API key in settings to use this feature"
          );
        }

        const data = await response.json();
        console.error(data);
        throw new Error(
          `We could not communicate with your selected model at the moment. Please, try again later.`
        );
      }

      const data = await response.json();
      return this.stripMarkdownCodeBlock(data.choices[0].message.content);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to generate Terraform configuration");
    }
  }
}
