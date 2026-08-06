import { useMutation } from "@tanstack/react-query";
import { apiCall } from "@/lib/api-call-wrapper";
import { useNavigate } from "@tanstack/react-router";

export function useLogoutMutation() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      const response = await apiCall<null>({
        url: "/auth/logout",
        method: "POST",
      });
      if (response.success === false) {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: () => {
      navigate({ to: "/login" });
      console.log("Logout sweep successful");
    },
    onError: (error) => {
      console.error("Logout sweep failed:", error);
    },
  });
}
