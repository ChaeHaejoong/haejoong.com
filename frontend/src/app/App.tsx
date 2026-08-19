import { QueryClientProvider } from "@tanstack/react-query";
import AppContent from "./AppContent";
import { queryClient } from "./queryClient";
import type { createRouter } from "./router";

type Props = { router: ReturnType<typeof createRouter> };

export default function App({ router }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent router={router} />
    </QueryClientProvider>
  );
}
