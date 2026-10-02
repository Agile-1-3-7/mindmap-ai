/**
 * Supabase client configuration and graceful fallback.
 * If credentials are not supplied, the application operates in resilient DEMO MODE.
 */

export const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && anonKey && url.startsWith("http"));
};

export const isOpenAIConfigured = (): boolean => {
  return Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith("sk-"));
};
