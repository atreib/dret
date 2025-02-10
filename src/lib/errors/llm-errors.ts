export class LLMServiceError extends Error {
  constructor(
    message: string,
    public readonly code: LLMErrorCode,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "LLMServiceError";
  }
}

export enum LLMErrorCode {
  // API Connection Errors
  NETWORK_ERROR = "NETWORK_ERROR",
  API_TIMEOUT = "API_TIMEOUT",
  API_RATE_LIMIT = "API_RATE_LIMIT",

  // Authentication Errors
  INVALID_API_KEY = "INVALID_API_KEY",
  EXPIRED_API_KEY = "EXPIRED_API_KEY",

  // Response Errors
  INVALID_RESPONSE_FORMAT = "INVALID_RESPONSE_FORMAT",
  INCOMPLETE_YAML = "INCOMPLETE_YAML",

  // User Input Errors
  PROMPT_TOO_LONG = "PROMPT_TOO_LONG",
  PROMPT_EMPTY = "PROMPT_EMPTY",

  // Other
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export const ERROR_MESSAGES = {
  [LLMErrorCode.NETWORK_ERROR]:
    "Unable to connect to OpenAI. Please check your internet connection.",
  [LLMErrorCode.API_TIMEOUT]: "The request timed out. Please try again.",
  [LLMErrorCode.API_RATE_LIMIT]:
    "Rate limit exceeded. Please try again in a few minutes.",
  [LLMErrorCode.INVALID_API_KEY]:
    "Invalid API key. Please check your settings.",
  [LLMErrorCode.EXPIRED_API_KEY]:
    "Your API key has expired. Please update it in settings.",
  [LLMErrorCode.INVALID_RESPONSE_FORMAT]:
    "The AI response was not in the expected format. Please try again.",
  [LLMErrorCode.INCOMPLETE_YAML]:
    "The generated YAML was incomplete. Please try again with a more specific description.",
  [LLMErrorCode.PROMPT_TOO_LONG]:
    "Your description is too long. Please make it shorter.",
  [LLMErrorCode.PROMPT_EMPTY]:
    "Please enter a description of your infrastructure.",
  [LLMErrorCode.UNKNOWN_ERROR]:
    "An unexpected error occurred. Please try again.",
} as const;
