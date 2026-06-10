import { createFileRoute } from "@tanstack/react-router";
import {SignUp} from "@/features/auth/components/SignUp";
export const Route = createFileRoute("/signup")({
  component: SignUp,
});
