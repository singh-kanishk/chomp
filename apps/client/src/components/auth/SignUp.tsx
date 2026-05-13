import { useEffect } from "react";
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
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import {SignUpSchema, type SignUpParams, type ApiResponse, type SignupResponse} from "@chomp/shared";
import { toast } from "sonner";
import { apiCall } from "@/lib/api-call-wrapper";
import {useMutation, type UseMutationResult, useQuery} from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import { generateAuthHash, generateMasterHash } from "@/lib/auth/hashGenerator";
import  {type SignupRequest} from '@chomp/shared'


function SignUp() {
  const setMasterHash = useUserStore((state) => state.setMasterHash);
  const setUserEmail = useUserStore((state) => state.setEmail);
  const setSalt = useUserStore((state) => state.setSalt);

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
  const emailValue = useWatch({ control, name: "email" });

  const isValidEmail =
    emailValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

  const  preLoginData  = useQuery({
    queryKey: ["preLoginUuid", emailValue],
    queryFn: async () => {
      return await apiCall<{ uuid: string }>({
        url: `/auth/salt?email=${encodeURIComponent(emailValue)}`,
        method: "GET",
      });
    },
    enabled: !!isValidEmail,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {

    if (preLoginData?.data?.body) {
      setSalt(preLoginData.data.body.uuid);
      setUserEmail(emailValue);
    }
  }, [preLoginData, setSalt, setUserEmail, emailValue]);
  // ----------------------------------

  // 1. Define the mutation at the top level of the component

  const signUpMutation:UseMutationResult<ApiResponse<SignupResponse>,Error,SignupRequest>   = useMutation({
    mutationFn: async (safePayload) => {
      return apiCall({
        
        url: "/auth/signup",
        method: "POST",
        config: {
          body: JSON.stringify(safePayload),
          headers: { "Content-Type": "application/json" },
        },
      });
    },
    onSuccess: () => {

      const result = signUpMutation.data||''
      if(result){
        setSalt(result.body?.salt||'')
      }
      toast.success("Form Submitted Successfully", {
        position: "top-right",
      });
      reset();
    },
    onError: () => {
      toast.error("Unsuccessful Form Submission", {
        description: "Something went wrong",
        position: "top-right",
      });
    },
  });

  // 2. Handle the cryptographic work in the submit function
  async function onSubmit(data: SignUpParams) {
    // Avoid stale closures by getting the freshest UUID directly from Zustand
    const currentUuid = useUserStore.getState().salt;

    if (!currentUuid) {
      toast.error("Security Error", {
        description: "Missing server salt. Please try typing your email again.",
        position: "top-right"
      });
      return;
    }

    try {
      // Pass the password (if your function requires it) along with the email and uuid
      const masterHash = await generateMasterHash(data.email, currentUuid);
      setMasterHash(masterHash);
      
      const authHash = await generateAuthHash(masterHash, currentUuid);

      // Convert Uint8Array to a standard array for JSON transmission if necessary
       

      // 3. Trigger the mutation with the safe payload
      signUpMutation.mutate({
        name: data.name,
        email: data.email,
        authHash: authHash, 
      });
    } catch (error) {
      console.error(error);
      toast.error("Encryption Failed", {
        description: "Could not generate secure hashes.",
        position: "top-right"
      });
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
              {(isSubmitting || signUpMutation.isPending) ? "Submitting..." : "Submit"}
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

export default SignUp