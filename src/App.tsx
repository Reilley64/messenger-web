import { Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "~/routeTree.gen";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "~/components/ui/sonner";

const router = createRouter({ routeTree });

const client = new QueryClient();

export default function App() {
  useEffect(() => {
    window.document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={client}>
      <Suspense fallback="Loading...">
        <RouterProvider router={router} />
      </Suspense>

      <Toaster />

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
