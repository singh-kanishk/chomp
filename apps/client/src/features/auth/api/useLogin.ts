import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import * as Comlink from "comlink";
import { toast } from "sonner";
import { useUserStore } from "@/store/useUserStore";
import { apiCall } from "@/lib/api-call-wrapper";
import { type HashingService } from "@/workers/hash";
import type { LogInParams, ApiResponse, LogInRequest } from "@chomp/shared";
import z from "zod";
import { LogInRequestZod } from "@chomp/shared";
import HashWorker from "@/workers/hash?worker";

export function useLogInMutation(resetForm: () => void) {
  const navigate = useNavigate();
  const { setMasterHash, setEmail, setEncryptionKey, salt } = useUserStore();

  return useMutation({
    mutationFn: async (data: LogInParams) => {
      //Doing Crypto Work On Worker threads

      const worker = new HashWorker();
      const cryptoWorker = Comlink.wrap<HashingService>(worker); //Wrapper for Worker thread functions

      try {
        const saltFromServer = salt || "";
        const masterHash = await cryptoWorker.generateMasterHash(
          data.password,
          saltFromServer,
        );
        const authHash = await cryptoWorker.generateAuthHash(
          masterHash,
          saltFromServer,
        );
        const encryptionKey = await cryptoWorker.generateEncryptionKey(
          masterHash,
          saltFromServer,
        );

        const payload: LogInRequest = LogInRequestZod.parse({
          email: data.email,
          authHash,
        });

        const response = await apiCall<ApiResponse<null>>({
          url: "/auth/LogIn",
          method: "POST",
          body: payload,
          config: {
            headers: { "Content-Type": "application/json" },
          },
        });

        return {
          response,
          masterHash,
          encryptionKey,
          email: data.email,
        };
      } finally {
        worker.terminate();
      }
    },
    onSuccess: (data) => {
      setMasterHash(data.masterHash);
      setEmail(data.email);
      setEncryptionKey(data.encryptionKey);

      toast.success("Logged In Successfully", { position: "top-right" });
      resetForm();
      navigate({ to: "/dashboard" });
    },
    onError: (error) => {
      console.error("LogIn lifecycle failed:", error);

      if (error instanceof z.ZodError) {
        const validationMessage =
          error.errors[0]?.message || "Invalid form data.";
        toast.error("Validation Error", {
          description: validationMessage,
          position: "top-right",
        });
        return;
      }

      toast.error("Unsuccessful Form Submission", {
        description: "Something went wrong.",
        position: "top-right",
      });
    },
  });
}
