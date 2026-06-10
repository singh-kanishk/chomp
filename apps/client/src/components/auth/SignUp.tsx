import authBg from "../../assets/auth_page.png";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "../ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  SignUpSchema,
  type SignUpParams,
  type ApiResponse,
  type SignupRequest
} from "@chomp/shared";
import { toast } from "sonner";
import { apiCall } from "@/lib/api-call-wrapper";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import * as Comlink from "comlink";
import { type HashingService, generateSaltUuid } from "@/workers/hash";

export function SignUp() {
  const setMasterHash = useUserStore((state) => state.setMasterHash);
  const setUserEmail = useUserStore((state) => state.setEmail);
  const setEncryptionKey = useUserStore((state) => state.setEncryptionKey);
  const setSalt = useUserStore((state) => state.setSalt);
  const navigate = useNavigate({ from: "/signup" });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpParams>({
    resolver: zodResolver(SignUpSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // --- PRE-LOGIN UUID FETCH LOGIC ---
  // const emailValue = useWatch({ control, name: "email" });
  //
  // const isValidEmail =
  //   emailValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
  //
  // const  preLoginData  = useQuery({
  //   queryKey: ["preLoginUuid", emailValue],
  //   queryFn: async () => {
  //     return await apiCall<{ uuid: string }>({
  //       url: `/auth/salt?email=${encodeURIComponent(emailValue)}`,
  //       method: "GET",
  //     });
  //   },
  //   enabled: !!isValidEmail,
  //   staleTime: 1000 * 60 * 5,
  // });
  //
  // useEffect(() => {
  //
  //   if (preLoginData?.data?.body) {
  //     setSalt(preLoginData.data.body.uuid);
  //     setUserEmail(emailValue);
  //   }
  // }, [preLoginData, setSalt, setUserEmail, emailValue]);
  // // ----------------------------------
  //
  // // 1. Define the mutation at the top level of the component

  const signUpMutation: UseMutationResult<ApiResponse<null>,Error,SignupRequest,unknown> = useMutation({
    mutationFn: async (safePayload:SignupRequest) => {
      return apiCall({
        url: "/auth/signup",
        method: "POST",
        config: {
          body: JSON.stringify(safePayload),
          headers: { "Content-Type": "application/json" },
        },
      });
    },
  });

  // 2. Handle the cryptographic work in the submit function
  async function onSubmit(data: SignUpParams) {
    const worker = new Worker(
      new URL("../../workers/hash.ts", import.meta.url),
      { type: "module" },
    );
    const obj = Comlink.wrap<HashingService>(worker);

    try {
      const saltUuid = generateSaltUuid();
      const masterHash = await obj.generateMasterHash(data.password, saltUuid);
      const authHash = await obj.generateAuthHash(masterHash, saltUuid);
      const encryptionKey = await obj.generateEncryptionKey(
        masterHash,
        saltUuid,
      );


      signUpMutation.mutate(
        {
          name: data.name,
          email: data.email,
          authHash: authHash,
          salt: saltUuid,
        },
        {
          onSuccess: () => {
            setMasterHash(masterHash);
            setUserEmail(data.email);
            setEncryptionKey(encryptionKey);
            setSalt(saltUuid);

            toast.success("Signed Up Successfully", {
              position: "top-right",
            });

            reset();
            navigate({ to: "/dashboard" });
          },
          onError: (error) => {
            console.error("Server signup failed:", error);
            toast.error("Unsuccessful Form Submission", {
              description: "Something went wrong on the server.",
              position: "top-right",
            });
          },
        },
      );
    } catch (error) {
      console.error("Crypto Worker Failed:", error);
      toast.error("Encryption Failed", {
        description: "Could not generate secure hashes.",
        position: "top-right",
      });
    } finally {
      worker.terminate();
    }
  }

  return (
    <div
      className={`h-screen w-screen bg-cover bg-center`}
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <Card className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-md bg-wood shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
        <CardHeader>
          <div className="flex justify-center">
            <CardTitle>SIGN UP</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form id="signup-form" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Name</FieldLabel>
                    <Input type="text" {...field} />
                    {errors.name && (
                      <span className="text-sm text-red-800">
                        {errors.name.message}
                      </span>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>E-mail</FieldLabel>
                    <Input type="email" {...field} />
                    {errors.email && (
                      <span className="text-sm text-red-800">
                        {errors.email.message}
                      </span>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Password</FieldLabel>
                    <Input type="password" {...field} />
                    {errors.password && (
                      <span className="text-sm text-red-800">
                        {errors.password.message}
                      </span>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Confirm Password</FieldLabel>
                    <Input type="password" {...field} />
                    {errors.confirmPassword && (
                      <span className="text-sm text-red-800">
                        {errors.confirmPassword.message}
                      </span>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting || signUpMutation.isPending}
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="signup-form"
              disabled={isSubmitting || signUpMutation.isPending}
            >
              {isSubmitting || signUpMutation.isPending
                ? "Submitting..."
                : "Submit"}
            </Button>
          </Field>
          <Link to="/login" className="underline mt-4">
            Or Log In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
