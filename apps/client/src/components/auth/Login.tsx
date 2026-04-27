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
import { Link } from "@tanstack/react-router";
import { LogInSchema,type LoginParams } from "@chomp/shared";
import { zodResolver } from "@hookform/resolvers/zod";


export function Login() {
  const { 
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },} = useForm<LoginParams>(
    {
      resolver: zodResolver(LogInSchema),
          defaultValues: {            
            email: "",
            password: "",
          },
    }
  );
  function onSubmit() {}
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
          <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Name</FieldLabel>
                    {/* Spread the field props here to connect to RHF */}
                    <Input type="text" {...field} />
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
                    <FieldLabel>Name</FieldLabel>
                    {/* Spread the field props here to connect to RHF */}
                    <Input type="text" {...field} />
                    {errors.password && (
                      <span className="text-sm text-red-500">
                        {errors.password.message}
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
                <Link to="/signup" className="underline"> Or Sign In</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
