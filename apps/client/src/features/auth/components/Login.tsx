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
      <Card className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-md bg-wood shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
        <CardHeader>
          <div className="flex justify-center">
            <CardTitle>LOG IN</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form id="logIn-form" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>E-mail</FieldLabel>
                    {/* Spread the field props here to connect to RHF */}
                    <Input type="email" {...field} />
                    {fieldState.error && (
                      <span className="text-sm text-red-800">
                        {fieldState.error.message}
                      </span>
                    )}
                  </Field>
                )}
              />

              {!isSaltReceived && (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    preLogin();
                  }}
                >
                  Check Email
                </Button>
              )}
              {isSaltReceived && (
                <Controller
                  name="password"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Password</FieldLabel>
                      {/* Spread the field props here to connect to RHF */}
                      <Input type="password" {...field} />
                      {fieldState.error && (
                        <span className="text-sm text-red-800">
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
        <CardFooter className="flex flex-col">
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsSaltReceived(false);
                reset();
              }}
              disabled={isPending}
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="logIn-form"
              disabled={isPending || !isSaltReceived}
            >
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </Field>
          <Link to="/signup" className="underline">
            Or Sign Up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
