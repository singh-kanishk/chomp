import authBg from '../../../assets/auth_page.png'
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import {
  SignUpSchema,
  type SignUpParams,
} from "@chomp/shared";
import { useSignUpMutation } from "../api/useSignUp";

export function SignUp() {
 
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

  

  const {mutate,isPending} = useSignUpMutation(reset)

  async function onSubmit (data:SignUpParams){
    mutate(data);
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
              SIGN UP
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form id="signup-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-body">
            <FieldGroup>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="text-[11px] font-mono uppercase text-muted-foreground">Name</FieldLabel>
                    <Input type="text" {...field} className="font-mono h-10 bg-input border-border text-muted-foreground focus-visible:ring-[#ffb77d]" />
                    {errors.name && (
                      <span className="text-xs font-mono text-[#ffb4ab]">
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
                  <Field className="mt-4">
                    <FieldLabel className="text-[11px] font-mono uppercase text-muted-foreground">E-mail</FieldLabel>
                    <Input type="email" {...field} className="font-mono h-10 bg-input border-border text-muted-foreground focus-visible:ring-[#ffb77d]" />
                    {errors.email && (
                      <span className="text-xs font-mono text-[#ffb4ab]">
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
                  <Field className="mt-4">
                    <FieldLabel className="text-[11px] font-mono uppercase text-muted-foreground">Password</FieldLabel>
                    <Input type="password" {...field} className="font-mono h-10 bg-input border-border text-muted-foreground focus-visible:ring-[#ffb77d]" />
                    {errors.password && (
                      <span className="text-xs font-mono text-[#ffb4ab]">
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
                  <Field className="mt-4">
                    <FieldLabel className="text-[11px] font-mono uppercase text-muted-foreground">Confirm Password</FieldLabel>
                    <Input type="password" {...field} className="font-mono h-10 bg-input border-border text-muted-foreground focus-visible:ring-[#ffb77d]" />
                    {errors.confirmPassword && (
                      <span className="text-xs font-mono text-[#ffb4ab]">
                        {errors.confirmPassword.message}
                      </span>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col mt-4">
          <Field orientation="horizontal" className="w-full flex gap-3 mb-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting || isPending}
              className="flex-1 h-10 font-mono text-[12px] uppercase bg-transparent border-border text-muted-foreground hover:text-[#ffb77d] hover:border-[#ffb77d] rounded-none"
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="signup-form"
              disabled={isSubmitting || isPending}
              className="flex-1 h-10 font-mono text-[12px] uppercase bg-[#4b5320] hover:bg-[#c3cc8c] text-[#bdc787] hover:text-[#2d3404] border border-[#c3cc8c] rounded-none disabled:opacity-50"
            >
              {isSubmitting || isPending
                ? "Submitting..."
                : "Submit"}
            </Button>
          </Field>
          <Link to="/login" className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground hover:text-[#ffb77d] transition-colors underline underline-offset-4 mt-2">
            Or Log In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
