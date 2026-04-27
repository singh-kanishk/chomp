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
import { Link } from "@tanstack/react-router";
import { SignUpSchema, type SignUpParams } from "@chomp/shared";

export function SignUp() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpParams>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: SignUpParams) {
    // This will only fire if Zod validation passes
    console.log("Valid data ready to send:", data);
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
                    {/* Spread the field props here to connect to RHF */}
                    <Input type="text" {...field} />
                    {errors.name && (
                      <span className="text-sm text-red-500">
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
                      <span className="text-sm text-red-500">
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
                      <span className="text-sm text-red-500">
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
                      <span className="text-sm text-red-500">
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
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button type="submit" form="signup-form" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
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
