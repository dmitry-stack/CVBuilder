/**
 * Resolves the backend GraphQL endpoint URL.
 * Reads Vercel service binding (CV_BACKEND_URL / BACKEND_URL) at runtime in server functions,
 * falling back to NEXT_PUBLIC_GRAPHQL_URL or local default.
 */
export function getBackendGraphQLUrl(): string {
  const backendBaseUrl =
    process.env.CV_BACKEND_URL || process.env.BACKEND_URL;

  if (backendBaseUrl) {
    if (backendBaseUrl.endsWith("/api/graphql")) {
      return backendBaseUrl;
    }
    const normalizedBase = backendBaseUrl.endsWith("/")
      ? backendBaseUrl
      : `${backendBaseUrl}/`;
    return new URL("api/graphql", normalizedBase).toString();
  }

  return (
    process.env.NEXT_PUBLIC_GRAPHQL_URL ||
    process.env.NEXT_PUBLIC_GRAPHQL_API_URL ||
    process.env.VITE_GRAPHQL_URL ||
    "http://localhost:3001/api/graphql"
  );
}
