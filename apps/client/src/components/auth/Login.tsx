import authBg from "../../assets/auth_page.png";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "../ui/input";
import { Controller, useForm } from "react-hook-form"


interface Test{
  username:string;
  password:string;
};
export function Login() {
  const form = useForm<Test>();
  function onSubmit(){}
  return (
    <div 
      className={`h-screen w-screen bg-cover bg-center`} 
      style={{ backgroundImage: `url(${authBg})` }}
    >
<Card className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-md bg-wood shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
      <CardHeader>
        <div className="flex justify-center">
        <CardTitle>LOGIN</CardTitle>
        </div>
        <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={() => (
                <Field >
                  <FieldLabel>UserName</FieldLabel>
                  <Input type="text"></Input>                 
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={() => (
                <Field > 
                  <FieldLabel>Password</FieldLabel>
                  <Input type="text"></Input>                 
                </Field>
              )}
            />            
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-demo">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
    </div>
  );
}