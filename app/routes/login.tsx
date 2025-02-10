import { Form } from "@remix-run/react";

export default function Login() {
  return (
    <Form method="post" action="/auth/google">
      <button>Login with Google</button>
    </Form>
  );
}
