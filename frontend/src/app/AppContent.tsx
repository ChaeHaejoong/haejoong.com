import { RouterProvider } from "react-router-dom";
import type { createRouter } from "./router";
import GlobalModal from "@/shared/ui/modal/GlobalModal";
import GlobalToast from "@/shared/ui/toast/GlobalToast";

type Props = { router: ReturnType<typeof createRouter> };

export default function AppContent({ router }: Props) {
  return (
    <>
      <RouterProvider router={router} />
      <GlobalModal />
      <GlobalToast />
    </>
  );
}
