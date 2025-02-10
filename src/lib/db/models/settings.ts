"use client";

import { z } from "zod";
import { BaseRepository } from "../indexed-db";

export const LLMModelEnum = {
  GPT_4: "gpt-4",
  GPT_3_5_TURBO: "gpt-3.5-turbo",
  CLAUDE_3_OPUS: "claude-3-opus",
  CLAUDE_3_SONNET: "claude-3-sonnet",
} as const;

export const CloudProviderEnum = {
  AWS: "aws",
  GCP: "gcp",
  AZURE: "azure",
} as const;

const UserSettingsSchema = z.object({
  id: z.string(),
  llmModel: z.enum([
    LLMModelEnum.GPT_4,
    LLMModelEnum.GPT_3_5_TURBO,
    LLMModelEnum.CLAUDE_3_OPUS,
    LLMModelEnum.CLAUDE_3_SONNET,
  ]),
  apiKey: z.string().min(1, "API Key is required"),
  cloudProvider: z.enum([
    CloudProviderEnum.AWS,
    CloudProviderEnum.GCP,
    CloudProviderEnum.AZURE,
  ]),
  updatedAt: z.date(),
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;

const DEFAULT_SETTINGS: UserSettings = {
  id: "user-settings",
  llmModel: LLMModelEnum.GPT_4,
  apiKey: "",
  cloudProvider: CloudProviderEnum.AWS,
  updatedAt: new Date(),
};

class SettingsRepository extends BaseRepository<UserSettings> {
  constructor() {
    super("settings", UserSettingsSchema);
  }

  // Helper method to get the current settings
  async getCurrentSettings(): Promise<UserSettings> {
    const result = await this.findById(DEFAULT_SETTINGS.id);

    if (result._tag === "failure") {
      throw result.error;
    }

    if (!result.value) {
      // Create default settings if none exist
      const createResult = await this.create(DEFAULT_SETTINGS);
      if (createResult._tag === "failure") {
        throw createResult.error;
      }

      return createResult.value;
    }

    return result.value;
  }

  // Helper method to update the current settings
  async updateSettings(
    settings: Partial<Omit<UserSettings, "id">>
  ): Promise<UserSettings> {
    const current = await this.getCurrentSettings();

    const updatedSettings: UserSettings = {
      ...current,
      ...settings,
      updatedAt: new Date(),
    };

    const result = await this.update(DEFAULT_SETTINGS.id, updatedSettings);
    if (result._tag === "failure") {
      throw result.error;
    }

    return result.value;
  }
}

// Create a singleton instance
export const settingsRepository = new SettingsRepository();
