/**
 * Application Configuration
 * Centralizes environmental and model settings.
 */

export const APP_CONFIG = Object.freeze({
  appName: 'LinkedFlow',
  aiModelName: import.meta.env.VITE_AI_MODEL_NAME || 'GPT-4o',
  aiProviderLabel: import.meta.env.VITE_AI_PROVIDER_LABEL || 'Powered by GPT-4o',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  maxPostCharacters: 3000,
  defaultTimezone: 'UTC',
  defaultLanguage: 'en-US',
});

export default APP_CONFIG;
