/**
 * Resolves the backend GraphQL endpoint URL.
 * Reads Vercel service binding (CV_BACKEND_URL / BACKEND_URL) at runtime in server functions,
 * falling back to NEXT_PUBLIC_GRAPHQL_URL or local default.
 */
export function getBackendGraphQLUrl(): string {
  const rawUrl = (
    process.env.NEXT_PUBLIC_GRAPHQL_URL ||
    process.env.NEXT_PUBLIC_GRAPHQL_API_URL ||
    process.env.CV_BACKEND_URL ||
    process.env.BACKEND_URL ||
    process.env.VITE_GRAPHQL_URL ||
    "http://localhost:3001/api/graphql"
  ).trim();

  if (rawUrl.endsWith("/api/graphql")) {
    return rawUrl;
  }

  const normalizedBase = rawUrl.endsWith("/") ? rawUrl : `${rawUrl}/`;
  return new URL("api/graphql", normalizedBase).toString();
}
