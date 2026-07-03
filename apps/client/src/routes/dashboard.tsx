import { createFileRoute, redirect } from "@tanstack/react-router";
import { Dashboard } from "@/features/dashboard/Dashboard";
import { useUserStore } from "../store/useUserStore";

export const Route = createFileRoute(`/dashboard`)({
  beforeLoad: () => {
    const { masterHash, encryptionKey } = useUserStore.getState();
    if (!masterHash || !encryptionKey) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: Dashboard,
});
