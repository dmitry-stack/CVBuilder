import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getBackendGraphQLUrl } from "./graphql-url";

describe("getBackendGraphQLUrl", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.CV_BACKEND_URL;
    delete process.env.BACKEND_URL;
    delete process.env.NEXT_PUBLIC_GRAPHQL_URL;
    delete process.env.NEXT_PUBLIC_GRAPHQL_API_URL;
    delete process.env.VITE_GRAPHQL_URL;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("defaults to localhost:3001/api/graphql when no env vars are set", () => {
    expect(getBackendGraphQLUrl()).toBe("http://localhost:3001/api/graphql");
  });

  it("resolves from NEXT_PUBLIC_GRAPHQL_URL when set", () => {
    process.env.NEXT_PUBLIC_GRAPHQL_URL = "https://custom.backend.com/api/graphql";
    expect(getBackendGraphQLUrl()).toBe("https://custom.backend.com/api/graphql");
  });

  it("prioritizes explicit NEXT_PUBLIC_GRAPHQL_URL over CV_BACKEND_URL binding", () => {
    process.env.NEXT_PUBLIC_GRAPHQL_URL = "https://custom.backend.com/api/graphql";
    process.env.CV_BACKEND_URL = "https://cv-backend-service.vercel.app";
    expect(getBackendGraphQLUrl()).toBe(
      "https://custom.backend.com/api/graphql",
    );
  });

  it("resolves from CV_BACKEND_URL binding when NEXT_PUBLIC_GRAPHQL_URL is not set", () => {
    process.env.CV_BACKEND_URL = "https://cv-backend-service.vercel.app";
    expect(getBackendGraphQLUrl()).toBe(
      "https://cv-backend-service.vercel.app/api/graphql",
    );
  });

  it("handles CV_BACKEND_URL with trailing slash", () => {
    process.env.CV_BACKEND_URL = "https://cv-backend-service.vercel.app/";
    expect(getBackendGraphQLUrl()).toBe(
      "https://cv-backend-service.vercel.app/api/graphql",
    );
  });

  it("handles CV_BACKEND_URL when already containing /api/graphql", () => {
    process.env.CV_BACKEND_URL =
      "https://cv-backend-service.vercel.app/api/graphql";
    expect(getBackendGraphQLUrl()).toBe(
      "https://cv-backend-service.vercel.app/api/graphql",
    );
  });

  it("supports BACKEND_URL alias", () => {
    process.env.BACKEND_URL = "http://localhost:4000";
    expect(getBackendGraphQLUrl()).toBe("http://localhost:4000/api/graphql");
  });

  it("resolves from NEXT_PUBLIC_GRAPHQL_API_URL when set", () => {
    process.env.NEXT_PUBLIC_GRAPHQL_API_URL = "https://api.example.com/api/graphql";
    expect(getBackendGraphQLUrl()).toBe("https://api.example.com/api/graphql");
  });

  it("resolves and appends /api/graphql from NEXT_PUBLIC_GRAPHQL_URL when given base host", () => {
    process.env.NEXT_PUBLIC_GRAPHQL_URL = "https://custom.backend.com";
    expect(getBackendGraphQLUrl()).toBe("https://custom.backend.com/api/graphql");
  });

  it("resolves and appends /api/graphql from VITE_GRAPHQL_URL when given base host", () => {
    process.env.VITE_GRAPHQL_URL = "https://vite.backend.com/";
    expect(getBackendGraphQLUrl()).toBe("https://vite.backend.com/api/graphql");
  });
});
