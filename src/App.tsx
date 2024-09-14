import { Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "~/routeTree.gen";

const client = new QueryClient();

const router = createRouter({ routeTree });

export default function App() {
  useEffect(() => {
    window.document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={client}>
      <Suspense fallback="Loading...">
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  );
}
