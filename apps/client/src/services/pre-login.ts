import { apiCall } from "@/lib/api-call-wrapper";
import { EmailSchema } from "@chomp/shared";
export async function fetchSalt(email: string) {
  const verifiedEmail = EmailSchema.parse({ email });
  const salt = await apiCall<string>({
    url: `/auth/salt?email=${encodeURIComponent(verifiedEmail.email)}`,
    method: "GET",
  });
  return salt.body || "";
}
