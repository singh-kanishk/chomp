import { createFileRoute, redirect } from "@tanstack/react-router";
import { LogIn } from "../features/auth/components/Login";
import { useUserStore } from "../store/useUserStore";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    const { masterHash, encryptionKey } = useUserStore.getState();
    if (masterHash && encryptionKey) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: LogIn,
});
