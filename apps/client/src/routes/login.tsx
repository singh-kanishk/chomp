import { createFileRoute } from "@tanstack/react-router";
import { LogIn } from "../features/auth/components/Login";

export const Route = createFileRoute("/login")({
  component: LogIn,
});
