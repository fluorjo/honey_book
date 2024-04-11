"use client";

// import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { useFormState } from "react-dom";
// import Button from "../../components/button";
import Input from "../../components/input";
// import SocialLogin from "../../components/social-login";
import { createAccount } from "./actions";

export default function CreateAccount() {
  const [state, dispatch] = useFormState(createAccount, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form className="flex flex-col gap-3" action={dispatch}>
        <Input
          type={"text"}
          placeholder={"Username"}
          required={true}
          name={"username"}
          errors={state?.fieldErrors.username}
          minLength={3}
          maxLength={10}
        />
        <Input
          type={"email"}
          placeholder={"Email"}
          required={true}
          name={"email"}
          errors={state?.fieldErrors.email}
        />
        <Input
          type={"password"}
          placeholder={"Password"}
          required={true}
          name={"password"}
          errors={state?.fieldErrors.password}
          // minLength={PASSWORD_MIN_LENGTH}
        />
        <Input
          type={"password"}
          placeholder={"Confirm Password"}
          required={true}
          name={"confirm_password"}
          errors={state?.fieldErrors.confirm_password}
          // minLength={PASSWORD_MIN_LENGTH}
        />
        <button> submit</button>
        {/* <Button text={"Create account"} /> */}
      </form>
      {/* <SocialLogin /> */}
    </div>
  );
}
