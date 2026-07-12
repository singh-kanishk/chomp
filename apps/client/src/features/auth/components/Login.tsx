import authBg from "../../../assets/auth_page.png";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "../../../components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { Link } from "@tanstack/react-router";
import { LogInSchema, type LogInParams } from "@chomp/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { fetchSalt } from "@/services/pre-login";
import { useUserStore } from "@/store/useUserStore";
import { useLogInMutation } from "../api/useLogin";

export function LogIn() {
  const { setSalt } = useUserStore();
  const [isSaltReceived, setIsSaltReceived] = useState<boolean>(false);
  const { handleSubmit, control, reset, trigger, setError, getValues, watch } =
    useForm<LogInParams>({
      resolver: zodResolver(LogInSchema),
      mode: "onBlur",
      defaultValues: {
        email: "",
        password: "",
      },
    });

  const { mutate, isPending } = useLogInMutation(reset);
  async function onSubmit(data: LogInParams) {
    // TODO: Implement logIn logic
    if (!isSaltReceived) {
      preLogin();
      return;
    }
    mutate(data);
    console.log("Form submitted with data:", data);
  }

  const watchEmail = watch("email");
  useEffect(() => {
    setIsSaltReceived(false);
  }, [watchEmail]);

  async function preLogin() {
    const isEmailValid = await trigger("email");
    if (!isEmailValid) return;
    const email = getValues("email");
    try {
      const salt = await fetchSalt(email);
      if (salt) {
        setIsSaltReceived(true);
        setSalt(salt);
      }
    } catch (error) {
      setError(
        "email",
        { message: (error as Error).message },
        { shouldFocus: true },
      );
      console.error("Error: Invalid User or Re-Enter Email");
    }
  }

  return (
    <div
      className={`h-screen w-screen bg-cover bg-center`}
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <Card className="stone-slab fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-md p-6 border-4 border-border bg-popover text-muted-foreground shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ffb77d]/60 to-transparent" />
        
        <CardHeader>
          <div className="flex justify-center">
            <CardTitle className="font-headline text-2xl text-[#ffb77d] uppercase tracking-widest">
              LOG IN
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form id="logIn-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-body">
            <FieldGroup>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel className="text-[11px] font-mono uppercase text-muted-foreground">E-mail</FieldLabel>
                    <Input type="email" {...field} className="font-mono h-10 bg-input border-border text-muted-foreground focus-visible:ring-[#ffb77d]" />
                    {fieldState.error && (
                      <span className="text-xs font-mono text-[#ffb4ab]">
                        {fieldState.error.message}
                      </span>
                    )}
                  </Field>
                )}
              />

              {!isSaltReceived && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    preLogin();
                  }}
                  className="w-full h-10 bg-transparent border-2 border-[#ffb77d] text-[#ffb77d] hover:bg-[#ffb77d] hover:text-[#131313] font-mono text-[12px] uppercase tracking-wider font-bold transition-all rounded-none mt-4"
                >
                  Check Email
                </Button>
              )}
              {isSaltReceived && (
                <Controller
                  name="password"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field className="mt-4">
                      <FieldLabel className="text-[11px] font-mono uppercase text-muted-foreground">Password</FieldLabel>
                      <Input type="password" {...field} className="font-mono h-10 bg-input border-border text-muted-foreground focus-visible:ring-[#ffb77d]" />
                      {fieldState.error && (
                        <span className="text-xs font-mono text-[#ffb4ab]">
                          {fieldState.error.message}
                        </span>
                      )}
                    </Field>
                  )}
                />
              )}
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col mt-4">
          <Field orientation="horizontal" className="w-full flex gap-3 mb-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsSaltReceived(false);
                reset();
              }}
              disabled={isPending}
              className="flex-1 h-10 font-mono text-[12px] uppercase bg-transparent border-border text-muted-foreground hover:text-[#ffb77d] hover:border-[#ffb77d] rounded-none"
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="logIn-form"
              disabled={isPending || !isSaltReceived}
              className="flex-1 h-10 font-mono text-[12px] uppercase bg-[#4b5320] hover:bg-[#c3cc8c] text-[#bdc787] hover:text-[#2d3404] border border-[#c3cc8c] rounded-none disabled:opacity-50"
            >
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </Field>
          <Link to="/signup" className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground hover:text-[#ffb77d] transition-colors underline underline-offset-4">
            Or Sign Up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
