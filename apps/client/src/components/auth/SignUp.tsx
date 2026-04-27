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


interface Test {
    name:string;
    email: string;
    password: string;
    confirmPassword:string;
}
export function SignUp() {
  const form = useForm<Test>();
  function onSubmit() {}
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
          <form id="form-rhf" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                name="name"
                control={form.control}
                render={() => (
                  <Field>
                    <FieldLabel>Name</FieldLabel>
                    <Input type="text"></Input>
                  </Field>
                )}
              />
            
            
              <Controller
                name="email"
                control={form.control}
                render={() => (
                  <Field>
                    <FieldLabel>E-mail</FieldLabel>
                    <Input type="text"></Input>
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={() => (
                  <Field>
                    <FieldLabel>Password</FieldLabel>
                    <Input type="text"></Input>
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={form.control}
                render={() => (
                  <Field>
                    <FieldLabel>Confirm Password</FieldLabel>
                    <Input type="text"></Input>
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
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" form="form-rhf">
              Submit
            </Button>
          </Field>
                <Link to="/login" className="underline"> Or Log In</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
