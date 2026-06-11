import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import * as Comlink from "comlink";
import { toast } from "sonner";
import { useUserStore } from "@/store/useUserStore";
import { apiCall } from "@/lib/api-call-wrapper";
import { generateSaltUuid, type HashingService } from "@/workers/hash";
import type { SignUpParams, ApiResponse } from "@chomp/shared";
import z from "zod";
import { SignUpRequestZod } from "@chomp/shared";
import HashWorker from "@/workers/hash?worker";

export function useSignUpMutation(resetForm: () => void) {
  const navigate = useNavigate();
  const { setMasterHash, setEmail, setEncryptionKey, setSalt } = useUserStore();

  return useMutation({
    mutationFn: async (data: SignUpParams) => {
      //Doing Crypto Work On Worker threads

      const worker = new HashWorker();
      const cryptoWorker = Comlink.wrap<HashingService>(worker); //Wrapper for Worker thread functions

      try {
        const salt = generateSaltUuid();
        const masterHash = await cryptoWorker.generateMasterHash(
          data.password,
          salt,
        );
        const authHash = await cryptoWorker.generateAuthHash(masterHash, salt);
        const encryptionKey = await cryptoWorker.generateEncryptionKey(
          masterHash,
          salt,
        );

        const payload = SignUpRequestZod.parse({
          name: data.name,
          email: data.email,
          authHash,
          salt: salt,
        });

        const response = await apiCall<ApiResponse<null>>({
          url: "/auth/signup",
          method: "POST",
          config: {
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
          },
        });

        return {
          response,
          masterHash,
          encryptionKey,
          salt,
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
      setSalt(data.salt);

      toast.success("Signed Up Successfully", { position: "top-right" });
      resetForm();
      navigate({ to: "/dashboard" });
    },
    onError: (error) => {
      console.error("Signup lifecycle failed:", error);

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
        description:
          "Something went wrong during local encryption or on the server.",
        position: "top-right",
      });
    },
  });
}
