"use client";

import { HttpLink, Observable } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { authStorage } from "./auth-storage";

function makeClient(onUnauthorized?: () => void) {
  const httpLink = new HttpLink({
    uri:
      process.env.NEXT_PUBLIC_GRAPHQL_URL ||
      "http://localhost:3001/api/graphql",
  });

  const authLink = setContext((_, { headers }) => {
    const token = authStorage.getAccessToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const errorLink = new ErrorLink(({ error, operation, forward }) => {
    const opName = operation.operationName;
    if (opName === "UpdateToken" || opName === "Login" || opName === "Signup") {
      return;
    }

    const isUnauthorized =
      (CombinedGraphQLErrors.is(error) &&
        error.errors.some(
          (e) =>
            e.message?.toLowerCase().includes("unauthorized") ||
            e.extensions?.code === "UNAUTHENTICATED" ||
            (e.extensions?.originalError as { statusCode?: number })
              ?.statusCode === 401,
        )) ||
      (typeof error === "object" &&
        error !== null &&
        "statusCode" in error &&
        (error as { statusCode?: number }).statusCode === 401);

    if (!isUnauthorized) {
      return;
    }

    return new Observable((observer) => {
      authStorage
        .refreshTokens()
        .then((newToken) => {
          if (!newToken) {
            onUnauthorized?.();
            observer.error(error);
            return;
          }

          operation.setContext(({ headers = {} }) => ({
            headers: {
              ...headers,
              authorization: `Bearer ${newToken}`,
            },
          }));

          const subscriber = {
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          };

          forward(operation).subscribe(subscriber);
        })
        .catch((err) => {
          onUnauthorized?.();
          observer.error(err);
        });
    });
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: errorLink.concat(authLink).concat(httpLink),
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
