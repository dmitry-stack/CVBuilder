"use client";

import { HttpLink, Observable, type ApolloLink } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { refreshAction } from "@/features/auth/actions/refresh.action";

let isRefreshing = false;
let pendingRequests: {
  resolve: () => void;
  reject: (err: unknown) => void;
}[] = [];

function isAuthError(error: unknown): boolean {
  if (CombinedGraphQLErrors.is(error)) {
    return error.errors.some(
      (e) =>
        e.extensions?.code === "UNAUTHENTICATED" ||
        e.message?.toLowerCase().includes("unauthorized"),
    );
  }
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    (error as { statusCode?: number }).statusCode === 401
  );
}

function waitForFreshToken(onUnauthorized?: () => void): Promise<void> {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      pendingRequests.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  return refreshAction()
    .then(() => {
      pendingRequests.forEach((req) => req.resolve());
      pendingRequests = [];
    })
    .catch((err) => {
      pendingRequests.forEach((req) => req.reject(err));
      pendingRequests = [];
      onUnauthorized?.();
      throw err;
    })
    .finally(() => {
      isRefreshing = false;
    });
}

function makeClient(onUnauthorized?: () => void) {
  const httpLink = new HttpLink({
    uri: "/api/graphql",
    credentials: "same-origin",
  });

  const errorLink = new ErrorLink(({ error, operation, forward }) => {
    if (!isAuthError(error)) return;

    return new Observable<ApolloLink.Result>((observer) => {
      let subscription:
        ReturnType<Observable<ApolloLink.Result>["subscribe"]> | undefined;

      waitForFreshToken(onUnauthorized)
        .then(() => {
          if (!observer.closed) {
            subscription = forward(operation).subscribe(observer);
          }
        })
        .catch((err) => {
          if (!observer.closed) observer.error(err);
        });

      return () => subscription?.unsubscribe();
    });
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: errorLink.concat(httpLink),
  });
}

export function ApolloProviderWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();
  const routerRef = useRef(router);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  const handleUnauthorized = useCallback(() => {
    routerRef.current?.push("/signin");
  }, []);

  const makeClientWithRouter = useCallback(() => {
    return makeClient(handleUnauthorized);
  }, [handleUnauthorized]);

  return (
    <ApolloNextAppProvider makeClient={makeClientWithRouter}>
      {children}
    </ApolloNextAppProvider>
  );
}
