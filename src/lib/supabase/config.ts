const FALLBACK_URL = "https://agzsfvmxbvcyhtueyatk.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnenNmdm14YnZjeWh0dWV5YXRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NjI1MTMsImV4cCI6MjEwMjAzODUxM30.cFYhecmzhJN6Ny8KwjBXSZZTUiOs5ecrX1gR7yCWYcY";

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;
  return Boolean(url && key && !url.includes("your-project") && !key.includes("your-anon"));
}
