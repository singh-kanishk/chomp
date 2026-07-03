import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignUp } from "@/features/auth/components/SignUp";
import { useUserStore } from "../store/useUserStore";

export const Route = createFileRoute("/signup")({
  beforeLoad: () => {
    const { masterHash, encryptionKey } = useUserStore.getState();
    if (masterHash && encryptionKey) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: SignUp,
});
