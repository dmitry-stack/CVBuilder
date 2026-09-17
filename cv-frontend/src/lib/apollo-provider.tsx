"use client";
import { HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import Cookies from "js-cookie";
import type { ReactNode } from "react";

function makeClient() {
  const httpLink = new HttpLink({
    uri:
      process.env.NEXT_PUBLIC_GRAPHQL_URL ||
      "http://localhost:3001/api/graphql",
  });

  const authLink = setContext((_, { headers }) => {
    const token = Cookies.get("access_token");
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
}

export function ApolloProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
